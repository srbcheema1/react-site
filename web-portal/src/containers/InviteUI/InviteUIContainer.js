import React, { Component } from "react"
import { connect } from "react-redux"
import * as actions from "../../store/actions/InviteActions"
import { withRouter } from 'react-router-dom'
import { isLoggedIn } from '../../helperFunctions'
import { InviteStatus, AssessmentStatus } from '../../store/reducers/InviteReducer'
import { GoogleLogin } from "react-google-login";
import { loginUsingGoogle } from '../../store/actions/AuthActions'
import "./InviteContainer.scss"
import logo from "../../assets/images/codehall-logo-dark.png";
import { Button } from 'antd';

class InviteUIContainer extends Component {

	constructor(props) {
		super(props)
		let urlparams = new URLSearchParams(this.props.location.search)
		this.state = {
			"invite_id": urlparams.get("invite_id"),
			"hash_value": urlparams.get("hash_value")
		}
	}

	componentDidMount() {
		this.props.fetchInvite(this.state.invite_id, this.state.hash_value)
	}

	componentDidUpdate() {
		// if (!this.props.assessment_id && isLoggedIn(this.props.user_id)) {
		// 	this.props.fetchInvite(this.state.invite_id, this.state.hash_value)
		// }
	}

	handleGoogleResponse = response => {
		const payload = {
			provider: "google",
			code: response.code,
			callback: this.props.fetchAssessmentForInvite.bind(this, this.props.test_id, this.state.invite_id)
		};
		this.props.loginUsingGoogle(payload);
	};

	render() {
		let msg = null
		if (isLoggedIn(this.props.user_id)) {
			if (this.props.assessment_id) {
				if (this.props.assessment_status === AssessmentStatus.InProgress) {
					msg = (
						<Button
							onClick={() => {this.props.history.push(`/assessment/${this.props.assessment_id}`)}}
							size="large"
							type="primary">
							Resume Test
						</Button>
					)
				}
			} else {
				msg = (
					<Button 
						onClick={() => this.props.startTest(this.props.test_id, this.state.invite_id)}
						size="large"
						type="primary">
						Start Test
					</Button>
				)
			}
		} else {
			msg = (
				<GoogleLogin
				clientId="73660977592-m50kcgualicen86vokvsbg3vsh8h6c2e.apps.googleusercontent.com"
				buttonText="Sign in with Google"
				responseType="code"
				onSuccess={response => this.handleGoogleResponse(response)}
				onFailure={response => this.handleGoogleResponse(response)}
				/>
			)
		}
		
		return (
			<div styleName="l-invite-wrapper">
				<div styleName="c-invite">
					<div>&nbsp;</div>
					<div styleName="c-invite__logo">
						<img src={logo} alt="CodeHall logo"/>
					</div>
					{(this.props.status === InviteStatus.ACTIVE && this.props.assessment_status !== AssessmentStatus.Completed) ? 
						(
							<React.Fragment>
								<div styleName="c-invite__test-details">
									<h1 className="header-font-size font-weight-bold">{this.props.test_title}</h1>
									<p className="sub-header-font-size-mid">{this.props.test_num_problems} Questions {this.props.test_duration} Minutes</p>
								</div>
								{(!isLoggedIn(this.props.user_id)) ?
									(
										<div styleName="c-invite__test-instructions">
											<p>You have been invited to take the online coding test from CodeHall. 
												<br/><br/>
												To start the test, login with your Google account, use the same account
												where you recieved the test invite email.
											</p>
										</div>
									):
									(
										<div styleName="c-invite__test-instructions">
											<h3 className="font-weight-bold">Instructions</h3>
											<ul>
												<li>
													All coding problems are designed to read from stdin and your code is expected to write to stdout
												</li>
												<li>
													The system checks the correctness of your solution by running your code against different inputs and comparing the generated output
													with the expected output
												</li>
												<li>
													You will generally not be required to write code that reads from stdin. For most of the problems this code is
													already provided.
												</li>
												<li>
													In the code editor, you will see certain greyed out areas, these pieces of code are not editable, you are supposed
													to write your code in the editable area. 
												</li>
												<li>
													When you hit the button to run code, all the code that is shown in the editor is run as a unit
												</li>
												<li>
													You can run your code with custom input to identify errors and fix failure. 
													In this scenario, the system will not execute the testcases.
												</li>
												<li>
													To debug your code, please add print statements to print to console and run the code in the custom input mode. 
												</li>
												<li>
													Do not close your browser window, while the test is in progress.
													If you close the window, you can resume the test by clicking the link in the invite email.
												</li>
											</ul>
											<hr/>
										</div>
									)
								}
								<div styleName="c-invite__test-cta">
									{msg}
								</div>
							</React.Fragment>
						):
						(
							<div styleName="c-invite__error-msg">
								{msg}
							</div>
						)
					}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		assessment_id: state.invite.assessment_id,
		status: state.invite.status,
		assessment_status: state.invite.assessment_status,
		user_id:state.auth.user_id,
		test_id: state.invite.test_id,
		test_title: state.invite.test_title,
		test_duration: state.invite.test_time,
		test_num_problems: state.invite.test_num_problems
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fetchInvite: (invite_id, hash_value) => dispatch(actions.fetchInvite(invite_id, hash_value)),
		loginUsingGoogle: payload => dispatch(loginUsingGoogle(payload)),
		fetchAssessmentForInvite: (test_id, invite_id) => dispatch(actions.fetchAssesmentForInvite(test_id, invite_id)),
		startTest: (test_id, invite_id) => dispatch(actions.startTest(test_id, invite_id))
	};
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InviteUIContainer));
