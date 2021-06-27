import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal } from 'antd';

import * as actions from "../../store/actions";
import HomePageContainer from "../HomePageContainer/HomePageContainer";
import InviteUIContainer from "../InviteUI/InviteUIContainer";
import AssessmentContainer from "../Assessment/AssessmentContainer";
import ProblemContainer from "../Problem/ProblemContainer";
import ErrorContainer from "../Error/ErrorContainer";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Wrapper from "../../HOC/Wrapper"
import TestComplete from "../../components/Problem/TestComplete";
import { history } from "../../index"

import FlashMessageList from "../../components/FlashMessageList/FlashMessageList";
import ErrorImage from "../../components/ErrorImage/ErrorImage"
import {problemsSelector, attemptedCountSelector} from "../../store/reducers/AssessmentReducer"

import './MainContainer.scss';

const { confirm, info } = Modal

class MainContainer extends Component {
	state = {
		innerWidth: 0
	};
	// componentWillMount() {
	// 	if (!localStorage.getItem("token")) this.props.onGetToken();
	// }
	componentDidMount() {
		this.setState({ innerWidth: window.innerWidth });
		window.addEventListener("resize", this.handleResize);
	}
	componentDidUpdate(prevProps) {
		/*if(prevProps.location!==this.props.location) this.props.resetPageNotFound();*/
	}

	handleResize = () => {
		this.setState({ innerWidth: window.innerWidth });
	};
	
	modalTriggerHandler = () => {
		if (this.props.showAuthModal) this.props.onToggleAuthModal("");
		this.props.onLoadModal({
			showModal: false,
			modalType: "",
			modalContent: null
		});
	};

	shouldComponentUpdate(nextProps) {
		if (window.location.pathname.substring(1, 5) === "http") {
			window.open(
				window.location.pathname.substring(
					1,
					window.location.pathname.length + 1
				)
			);
			nextProps.location.pathname = this.props.location.pathname;
			nextProps.history.goBack();
			return false;
		}
		return true;
	}

	submitTest = (assessmentId, testEnded=false) => {
		if (!testEnded) {
			let message = ''
			if (this.props.attemptedCount < this.props.totalCount) {
				message = `You have not attempted ${this.props.totalCount - this.props.attemptedCount} problems.`
			}
			message = `${message} You will not be able to make any further changes, your submission will be final.`
			confirm({
				title: 'Are you sure you want to submit the test?',
				content: message,
				onOk:() => {
					this.props.submitAssessment(assessmentId, true)
				},
				onCancel:() => {
					console.log('Cancel');
				},
			})
		} else {
			this.props.submitAssessment(assessmentId, false)
			info({
				title: 'Time is up!',
				content: (
					<p>Your test has been submitted</p>
				),
				onOk: () => history.push('/testcomplete')
			})
		}
	}

	render() {
		let full="false";
		if(window.location.pathname.includes("/set_password/") ||
			window.location.pathname.includes("/testcomplete") ||
			window.location.pathname === "/invite" ||
			window.location.pathname === "/error")
		{
			full="true";
		}

		return (
			<React.Fragment>
				<FlashMessageList />
				<div styleName="c-layout">
					{window.location.pathname.includes("/set_password/") ||
						window.location.pathname.includes("/testcomplete") ||
						window.location.pathname === "/invite" ||
						window.location.pathname === "/error" ? null :
					(
						<div styleName="c-header">
							<Header
								headerStyle=""
								onToggleAuthModal={this.props.onToggleAuthModal}
								user_detail={this.props.user_detail}
								innerWidth={this.state.innerWidth}
								attemptedCount={this.props.attemptedCount}
								totalCount={this.props.totalCount}
								remainingTime={this.props.remainingTime*1000}
								assessmentId={this.props.assessmentId}
								submitTest={this.submitTest}
								timerWarnLevel={this.props.timerWarnLevel}
								setTimerExpLevel={this.props.setTimerExpLevel}
							/>
						</div>
					)}
					<div styleName="c-content" full={full}>
						<Switch>
							{this.props.notFound ?
								<Route render={props => ( <ErrorImage {...props} errorType={this.props.errorType} errorHeading={this.props.errorHeading} errorMessage={this.props.errorMessage}  />)} />
								:null
							}
							<Route path="/home" exact component={HomePageContainer} />
							<Redirect exact from="/" to="/home" />
							<Route path="/assessment/:id" exact component={AssessmentContainer}/>
							<Route
								path="/invite"
								exact
								render={props => (
									<InviteUIContainer {...props} />
								)}
							/>
							<Route path="/assessment/:assessment_id/problem/:problem_id" exact component={ProblemContainer}/>
							<Route
								path="/error"
								exact
								render={props => (<Wrapper><ErrorContainer/></Wrapper>)}
							/>
							<Route
								path="/testcomplete"
								exact
								render={props => (<Wrapper><TestComplete testTitle={this.props.test_title}/></Wrapper>)}
							/>
							<Route render={props => ( <ErrorImage {...props} errorType="404" errorHeading="Link not found" errorMessage="THE REQUESTED URL WAS NOT FOUND" />)} />
						</Switch>
					</div>
					{window.location.pathname.includes("/set_password/") ||
						window.location.pathname.includes("/testcomplete") ||
						window.location.pathname === "/invite" ||
						window.location.pathname === "/error" ? null :
					(
						<div styleName="c-footer">
							<Footer configurations={this.props.configurations}/>
						</div>
					)}
				</div>

				{this.props.modal.showModal ? (
					<Modal showModal={this.props.modal.showModal} onClickHandler={this.modalTriggerHandler}>
						{this.props.modal.modalContent}
					</Modal>
				):null}
			</React.Fragment>
		);
	}
}

MainContainer.propTypes = {
	modal: PropTypes.object,
	onLoadModal: PropTypes.func,
	showAuthModal: PropTypes.string,
	onToggleAuthModal: PropTypes.func,
	location: PropTypes.object,
	user_detail: PropTypes.object,
	configurations: PropTypes.array,
	setPayloads: PropTypes.func,
	notFound: PropTypes.bool,
	resetPageNotFound: PropTypes.func,
	errorType: PropTypes.string,
	errorHeading: PropTypes.string,
	errorMessage: PropTypes.string
};

const mapStateToProps = state => {
	return {
		modal: state.global.modal,
		showAuthModal: state.global.showAuthModal,
		user_detail: state.auth,
		notFound: state.global.notFound,
		errorType:state.global.errorType,
		errorHeading:state.global.errorHeading,
		errorMessage:state.global.errorMessage,
		attemptedCount: attemptedCountSelector(state.assessment),
		totalCount: problemsSelector(state.assessment).length,
		remainingTime: state.assessment.remainingTime,
		assessmentId: state.assessment.id,
		test_title: state.assessment.test_title,
		timerWarnLevel: state.assessment.timerWarnLevel
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLoadModal: modal => dispatch(actions.onLoadModal(modal)),
		onToggleAuthModal: showAuthModal => dispatch(actions.onToggleAuthModal(showAuthModal)),
		resetPageNotFound: () => dispatch(actions.resetPageNotFound()),
		submitAssessment: (assessmentId, redirect) => dispatch(actions.submitAssessment(assessmentId, redirect)),
		setTimerExpLevel: level => dispatch(actions.setTimerExpLevel({level:level}))
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(MainContainer)
);
