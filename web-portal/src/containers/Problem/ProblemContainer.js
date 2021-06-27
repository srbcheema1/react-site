import React, { Component } from "react";
import { Row, Col, Tabs } from 'antd'
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { currProblemSelector, activeTemplateSelector,
					activeTabSelector, languageListSelector,
					selectedTab, attemptedCountSelector,
				} from "../../store/reducers/AssessmentReducer"
import { withRouter } from 'react-router-dom'
import ProblemDescription from "../../components/Problem/ProblemDescription";
import TestCase from "../../components/Problem/TestCase";
import OutPut from "../../components/Problem/OutPut";
import Editor from "../../components/Editor/Editor";
import Header from "../../components/Editor/Header";
import Footer from "../../components/Editor/Footer";
import ProblemSelector from "../../components/Problem/ProblemSelector"

import "./ProblemContainer.scss"

const { TabPane } = Tabs

class ProblemContainer extends Component {

	constructor(props) {
		super(props)
		this.state = {
			assessment_id: this.props.match.params.assessment_id,
			problem_id: this.props.match.params.problem_id,
			code: this.props.code,
			editorExpand:false,
			stdin:'',
			submit_disabled:false,
		}
	}

	componentDidMount() {
		if (!this.props.assessment.id) {
			this.props.fetchAssessment(this.state.assessment_id, this.state.problem_id)
		}
	}

	componentDidUpdate() {
	}

	componentWillReceiveProps = (nextProps) => {
		// is this the best way to handle code in the Ace Editor
		// should we sync the code in editor with the code in redux state by
		// dispatching an action on every change/keypress
		// or do we keep just the container state in sync with editor content
		if (this.props.code !== nextProps.code) {
			this.setState({code: nextProps.code})
		}
	}

	setStdIn = val => {
		this.setState({stdin: val})
	}

	setEditorCode = code => {
		this.setState({code: code})
		setTimeout(() => {
			this.props.updateCode(this.props.currProblem.id, this.state.code);
		  }, 0);
	}

	switchLanguage = language => {
		this.props.updateCode(this.props.currProblem.id, this.state.code)
		this.props.updateLang(language, this.props.currProblem.id)
	}

	onProblemClick = problem_id => {
		this.props.updateCode(this.props.currProblem.id, this.state.code)
		this.props.switchProblem(problem_id)
	}

	getSubmissionData = () => {
		let code_body = this.state.code.replace(this.props.activeTemplate.header, '')
																		.replace(this.props.activeTemplate.tailer, '')
		let data={
			"id":this.props.assessment.id,
			"problem_id":this.props.currProblem.id,
			"code_body":code_body,
			"code_body_full": this.props.code,
			"language": this.props.lang,
			"cs_type":"regular"
		}
		return data;
	}

	handleTestCode = () => {
		let data = this.getSubmissionData();
		data["cs_type"] = "custom_input";
		data["ci_stdin"] = this.state.stdin;

		this.props.updateCode(data.problem_id, data.code_body_full)
		this.props.submitCode(data)
	}

	handleSubmitCode = () => {
		let data = this.getSubmissionData()
		this.props.updateCode(data.problem_id, data.code_body_full)
		this.setState({editorExpand: false})
		this.props.submitCode(data)
		this.setState({submit_disabled:true},()=>{
			setTimeout(()=>{ this.setState({submit_disabled:false}) },9000)
		})
	}

	handleTabSwitch = key => {
		this.TabHandler(key)
	}

	toggleExpand = () => {
		this.setState((prevState, props) => ({editorExpand: !prevState.editorExpand}));
	}

	//changes the redux  state based on the option the user has selected
	// user can either view the problem statement, test cases for the problem and
	// ouput tab shows the results of code execution and allow to run custom tests.
	TabHandler = (value) => {
		this.setState({stdin: ""});
		this.props.resetCustInpResults();
		let activeTab = "";
		switch(value){
			case selectedTab.problemStatement:
				activeTab = selectedTab.problemStatement;
				break;
			case selectedTab.customInput:
				activeTab = selectedTab.customInput;
				break;
			case selectedTab.results:
				activeTab = selectedTab.results;
				break;
			default:
				activeTab = "";
		}
		this.props.chooseOption({
			activeTab:activeTab,
			problem_id:this.props.currProblem.id
		})
	}

	render() {
		let problemSelectorSpan = 2;
		let problemTabSpan = 11;
		let editorTabSpan = 11;
		if(this.state.editorExpand){
			problemSelectorSpan = 0;
			problemTabSpan = 0;
			editorTabSpan = 24;
		}
		return (
			<div styleName="l-problem-container">
				<Row gutter={16} style={{marginRight:0, marginLeft:0}} styleName="l-problem-container__row">
					<Col span={problemSelectorSpan} style={{paddingRight:0, paddingLeft:0}}>
						<ProblemSelector problems={this.props.allProblems} onProblemClick={this.onProblemClick}/>
					</Col>
					<Col span={problemTabSpan} style={{height: '100%'}}>
						<div styleName="c-problem-def-results">
							<Tabs defaultActiveKey={selectedTab.problemStatement} activeKey={this.props.activeTab} onChange={this.handleTabSwitch} tabBarGutter={80}>
								<TabPane tab={selectedTab.problemStatement} key={selectedTab.problemStatement}>
									<ProblemDescription problem={this.props.currProblem}/>
								</TabPane>
								<TabPane tab={selectedTab.customInput} key={selectedTab.customInput}>
									<TestCase
										stdout={this.props.stdout}
										stderr={this.props.stderr}
										stdin={this.state.stdin}
										verdict={this.props.verdict}
										testcases={this.props.testcases}
										setInput={this.setStdIn}
										testCode={this.handleTestCode}
									/>
								</TabPane>
								<TabPane tab={selectedTab.results} key={selectedTab.results}>
									<OutPut
										testcases={this.props.testcases}
										leftCount={this.props.totalProbs - this.props.attemptedCount}
										probStatus={this.props.currProblem.status}
									/>
								</TabPane>
							</Tabs>
						</div>
					</Col>
					<Col span={editorTabSpan} style={{height: '100%'}}>
						<div styleName="c-editor">
							<Header selectedLanguage={this.props.lang}
								editorExpand={this.state.editorExpand}
								languageList={this.props.languageList}
								switchLanguage={this.switchLanguage}
								toggleExpand={this.toggleExpand}
							/>
							<div styleName="c-editor__ace">
								<Editor
									lang={this.props.lang}
									code={this.state.code}
									updateCode={this.setEditorCode}
									headerSize={this.props.activeTemplate.header.split(/\r\n|\r|\n/).length - 1}
									footerSize={this.props.activeTemplate.tailer.split(/\r\n|\r|\n/).length - 1}
								/>
							</div>
							<Footer
								submitCode={this.handleSubmitCode}
								disabled={this.state.submit_disabled && this.props.testcases.filter(tc => tc.logo === 'LOAD').length > 0}
							/>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		assessment:state.assessment,
		currProblem: currProblemSelector(state.assessment),
		stdout : currProblemSelector(state.assessment).stdout,
		stderr : currProblemSelector(state.assessment).stderr,
		verdict : currProblemSelector(state.assessment).verdict,
		testcases : currProblemSelector(state.assessment).testcases,
		lang : currProblemSelector(state.assessment).editor.lang,
		code : currProblemSelector(state.assessment).editor.code[currProblemSelector(state.assessment).editor.lang],
		activeTemplate: activeTemplateSelector(state.assessment),
		activeTab: activeTabSelector(state.assessment),
		allProblems: state.assessment.problems,
		languageList: languageListSelector(state.assessment),
		attemptedCount: attemptedCountSelector(state.assessment),
		totalProbs: state.assessment.problems.length
	};
};

const mapDispatchToProps = dispatch => {
	return {
		resetCustInpResults: () => dispatch(actions.resetCustInpResults({
			stdout: null,
			stderr: null
		})),
		chooseOption: val => dispatch(actions.chooseOption(val)),
		updateLang : (language, problem_id) => dispatch(
			actions.updateLang({
				language: language,
				problem_id: problem_id
			})
		),
		updateCode: (problem_id, code) => dispatch(
			actions.updateCode({
				problem_id: problem_id,
				code: code
			})
		),
		submitCode: data => dispatch(actions.submitCode(data)),
		fetchAssessment: (assessment_id, problem_id) => dispatch(actions.fetchAssessment(assessment_id, problem_id)),
		switchProblem: problem_id => dispatch(actions.selectProblem(problem_id)),
	};
};

export default withRouter(
	connect(mapStateToProps,mapDispatchToProps)(ProblemContainer)
);
