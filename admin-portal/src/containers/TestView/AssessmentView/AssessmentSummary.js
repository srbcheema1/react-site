import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Progress, Row, Col, Avatar, Select, Collapse } from 'antd';
import moment from 'moment';

import * as actions from '../../../store/actions';
import { activeQuestionSelector, activeSubmissionSelector, bestSubmissionSelector } from '../../../store/selectors';
import VerdictTable from './VerdictTable';
import TimeLine from './TimeLine';
import './AssessmentSummary.scss';
import Editor from './Editor';

const { Option } = Select;
const { Panel } = Collapse;

const candidate_status_map = {
	FL:"Fail",
	PS:"Pass",
	CM:"To Evaluate",
}

class ParamValue extends Component {
	render() {
		return (
			<Col span={8}>
				<div style={{fontSize:'14px', fontWeight:'900'}}>{this.props.title}</div>
				<div style={{fontSize:'12px'}}>{this.props.value}</div>
			</Col>
		)
	}
}

class AssessmentSummary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editor_full:false,
		}
	}
	componentDidMount() {
		if(this.props.match.params.assessment_id !== this.props.assessment.assessment_id) {
			this.props.fetchAssessment(this.props.match.params.test_id,this.props.match.params.assessment_id,true)
		}
	}

	takeAction = (e) => {
		const callback = (status) => {
			this.props.assessmentSetState({status})
			this.props.fetchCandidates({...this.props.pagination})
		}
		if(e==="Pass") {
			this.props.evaluate([this.props.assessment.assessment_id],"pass",()=>callback('PS'))
		}
		if(e==="Fail") {
			this.props.evaluate([this.props.assessment.assessment_id],"fail",()=>callback('FL'))
		}
	}

	toggleEditor = () => {
		this.setState({editor_full:!this.state.editor_full});
	}

	render() {
		let questions_index = Object.keys(this.props.assessment.questions)
		let ques_btns = questions_index.map((ques_id)=>{
			let index = this.props.assessment.questions[ques_id].index
			let active = (ques_id===this.props.assessment.active_question ? "true" : "false")
			return(
				<Avatar
					key={index}
					active={active}
					styleName="c-assessment-summary-body__question-icon"
					onClick={()=>this.props.setActiveQuestion(ques_id)}
				>
					Q{index}
				</Avatar>
			)
		})

		let editorCol = 16;
		let tcCol = 8;
		if(this.state.editor_full) {
			editorCol = 24;
			tcCol = 0;
		}

		let percent = (this.props.assessment.score / this.props.assessment.total_score) * 100;
		return (
			<div style={{...this.props.style}} styleName="c-assessment-summary">
				<div styleName="c-assessment-summary-header">
					<div styleName="c-assessment-summary-header__title">{this.props.curr_test.title}</div>
					<Select
						styleName="c-assessment-summary-header__actions"
						value={candidate_status_map[this.props.assessment.status]}
						onChange={e=>this.takeAction(e)}
					>
						<Option value="Pass" selected>Pass</Option>
						<Option value="Fail">Fail</Option>
					</Select>
				</div>
				<div styleName="c-assessment-summary-top">
					<Progress type="circle" 
						percent={percent}
						strokeLinecap="square"
						strokeColor="#399862"
						strokeWidth={3}
						width={145}
						format={percent =>
							(
								<div>
									<div style={{fontSize:'50px'}}>{this.props.assessment.score}</div>
									<div style={{fontSize:'12px'}}>out of {this.props.assessment.total_score}</div>
								</div>
							)}
					/>
					<div styleName="c-assessment-summary-top__user-info">
						<Row>
							<ParamValue title="Name" value={this.props.assessment.name}/>
							<ParamValue title="Completed" value={moment(this.props.assessment.completion_time).format("MMMM D[,] YYYY [at] hh:mm A")}/>
							<ParamValue title="Experience" value={this.props.assessment.experience}/>
						</Row>
						<Row>
							<ParamValue title="Email" value={this.props.assessment.email}/>
							<ParamValue title="Time Taken" value={this.props.assessment.time_taken}/>
							<ParamValue title="Invited By" value={this.props.assessment.invited_by}/>
						</Row>
					</div>
				</div>
				<div styleName="c-assessment-summary-body">
					<div styleName="c-assessment-summary-body__title">Choose Question</div>
					<div styleName="c-assessment-summary-body__questions">
						<div styleName="c-assessment-summary-body__question-buttons">
							{ques_btns}
						</div>
						<div styleName="c-summary">
							<Collapse>
								<Panel 
									header={this.props.curr_question.title} 
									extra={this.props.best_submission.score + " / " + this.props.curr_question.points + ' points'}
								>
									{this.props.curr_question.description}
								</Panel>
							</Collapse>
							{this.props.curr_submission.id ? (
								<div styleName="c-summary__body">
									<Row gutter={20}>
										<Col span={editorCol}>
											<Editor
												code={this.props.code}
												lang={this.props.curr_submission.language}
												time={this.props.curr_submission.creation_date}
												full={this.state.editor_full}
												toggle={this.toggleEditor}
											/>
										</Col>
										<Col span={tcCol} styleName="c-tc">
											<div styleName="c-tc__title">
												Test Cases
											</div>
											<VerdictTable/>
										</Col>
									</Row>
									{Object.keys(this.props.curr_question.submissions).length > 1 && <TimeLine/>}
								</div>
							) : (
								<div styleName="c-summary__body no-submission">
									No Submissions
								</div>
							)}
							
						</div>
					</div>
				</div>
				<div styleName="c-assessment-summary-notes">
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		assessment: state.assessment,
		best_submission: bestSubmissionSelector(state.assessment),
		curr_submission: activeSubmissionSelector(state.assessment),
		code: activeSubmissionSelector(state.assessment).code_to_execute,
		pagination: state.candidates.pagination,
		curr_question: activeQuestionSelector(state.assessment)
	};
};

const mapDispatchToProps = dispatch => {
	return {
		assessmentSetState: (state) => dispatch(actions.assessmentSetState(state)),
		evaluate: (assessments,action,callback) => dispatch(actions.evaluate(assessments,action,callback)),
		fetchAssessment: (test_id,assessment_id,setBase) => dispatch(actions.fetchAssessment(test_id,assessment_id,setBase)),
		fetchCandidates: (pager) => dispatch(actions.fetchCandidates(pager)),
		setActiveQuestion: (index) => dispatch(actions.setActiveQuestion({active_question:index})),
	};
};

export default withRouter(connect( mapStateToProps, mapDispatchToProps, null, {forwardRef:true} )( AssessmentSummary ));

