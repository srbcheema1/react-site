import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import { Button, Icon, Tabs } from 'antd';
import { connect } from 'react-redux';
import InviteModal from '../Invite/InviteModal';
import { Link } from 'react-router-dom';

import * as actions from '../../store/actions';
import CandidatesTable from './CandidatesView/CandidatesTable';
import QuestionsTable from './QuestionsView/QuestionsTable';
import AssessmentSummary from "./AssessmentView/AssessmentSummary";

import './TestView.scss';

class TestView extends Component {
	constructor(props) {
		super(props);
		this.inviteRef = React.createRef();
		this.state = {
			tab:'candidates',
		}
	}

	componentDidMount() {
		if(this.props.curr_test.id !== this.props.match.params.test_id) {
			this.props.fetchTest(this.props.match.params.test_id)
		}
		if(this.props.match.params.assessment_id) { 
			this.setState({tab:'candidates'})
		}
	}

	componentWillUnmount() {
		this.props.resetCurrTest();
		this.props.candidatesResetState()
		this.props.assessmentResetState();
	}

	componentDidUpdate(prevProps) {
		if(prevProps.curr_test.id !== this.props.curr_test.id) {
			this.props.candidatesResetState()
			this.props.fetchCandidates({...this.props.pagination})
		}
	}

	sendInvite = (test_id) => {
		this.inviteRef.current.init(test_id);
	}

	leaveAssessment = () => {
		this.props.assessmentResetState()
		this.props.history.push(`/admin/test/${this.props.curr_test.id}`);
	}

	setTab = (key) => {
		this.setState({tab:key})
		switch(key){
			case "candidates":
				if(this.props.assessment.assessment_id)
					this.props.history.push(`/admin/test/${this.props.curr_test.id}/assessment/${this.props.assessment.assessment_id}/`);
				else
					this.props.history.push(`/admin/test/${this.props.curr_test.id}/`);
				break;
			case "questions":
				this.props.history.push(`/admin/test/${this.props.curr_test.id}/`);
				break;
			default:
				this.props.history.push(`/admin/test/${this.props.curr_test.id}/`);
		}
	}

	render() {
		if(!this.props.curr_test.id) {
			return (
				<React.Fragment>
					<div styleName="c-test">
						<div styleName="l-test-header">
							<div styleName="l-test-header__left">
								<h3>Invalid Test Id</h3>
							</div>
							<div styleName="l-test-header__center">
							</div>
							<div styleName="l-test-header__right">
							</div>
						</div>
						<div styleName="l-test-table">
							<div styleName="c-test__invalidtest">
								<h3>Please go to <Link to="/admin/tests/">Active Tests</Link> and select a valid test.</h3>
							</div>
						</div>
					</div>
				</React.Fragment>
			)
		}

		return (
			<div styleName="c-test">
				<div styleName="l-test-header">
					<div styleName="l-test-header__left">
						<h3 style={{width:'190px'}}>
							<Switch>
								<Route
									path="/admin/test/:test_id/"
									exact
									render={() =>(
										<Link to="/admin/tests/" style={{color:'rgba(0, 0, 0, 0.65)'}} >
											<Icon type="left" style={{fontSize:'0.90em'}}/>Back to all Tests
										</Link>
									)}
								/>
								<Route
									path="/admin/test/:test_id/assessment/:assessment_id/"
									exact
									render={() =>(
										<span onClick={this.leaveAssessment} style={{color:'rgba(0, 0, 0, 0.65)',cursor:'pointer'}} >
											<Icon type="left" style={{fontSize:'0.90em'}}/>Back to all Candidates
										</span>
									)}
								/>
							</Switch>
						</h3>
					</div>
					<div styleName="l-test-header__center">
					<Tabs defaultActiveKey={this.state.tab} onChange={(key)=>this.setTab(key)}>
						<Tabs.TabPane tab="Questions" key="questions">
						</Tabs.TabPane>
						<Tabs.TabPane tab="Candidates" key="candidates">
						</Tabs.TabPane>
					</Tabs>
					</div>
					<div styleName="l-test-header__right">
						<Button>Try Test</Button>
						<Button type="primary" onClick={()=>this.sendInvite(this.props.curr_test.id)}>Invite</Button>
						<Icon type="more"/>
					</div>
				</div>
				<div styleName="l-test-table">
					{this.state.tab==="questions" ? (
						<QuestionsTable
							curr_test={this.props.curr_test}
							problems={this.props.curr_test.problems}
						/>
					):(
						<Switch>
							<Route
								path="/admin/test/:test_id/"
								exact
								render={() =>(
									<CandidatesTable
										curr_test={this.props.curr_test}
									/>
								)}
							/>
							<Route
								path="/admin/test/:test_id/assessment/:assessment_id/"
								exact
								render={() =>(
									<AssessmentSummary
										curr_test={this.props.curr_test}
									/>
								)}
							/>
						</Switch>
					)}
				</div>
				<InviteModal
					ref={this.inviteRef}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		curr_test: state.test.curr_test,
		pagination: state.candidates.pagination,
		assessment: state.assessment,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		resetCurrTest: () => dispatch(actions.resetCurrTest()),
		fetchCandidates: (pager) => dispatch(actions.fetchCandidates(pager)),
		fetchTest: (test_id) => dispatch(actions.fetchTest(test_id)),
		candidatesResetState: () => dispatch(actions.candidatesResetState()),
		assessmentResetState: () => dispatch(actions.assessmentResetState()),
	};
};

TestView.propTypes = {
};

export default connect( mapStateToProps, mapDispatchToProps )( TestView );
