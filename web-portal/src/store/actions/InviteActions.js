import { createAction } from "redux-action";
import axios from "axios";
import { AxiosCallError, AxiosCallRequest, AxiosCallSuccess, showErrorPage } from "./commonActions";
import { startTestSuccess, fetchAssessment } from "./AssessmentActions"
import { get_service_endpoint } from "../../ServiceEndpoints.js";
import { isLoggedIn } from "../../helperFunctions.js"
import { history } from '../../index'
import { Modal } from 'antd';
import { InviteStatus } from '../../store/reducers/InviteReducer'

let ep = get_service_endpoint('assessment')

export const validateInviteSuccess = createAction("VALIDATE_INVITE_SUCCESS");

export const validateInviteFailure = createAction("VALIDATE_INVITE_FAILURE")

export const setAssessment = createAction("SET_ASSESSMENT");

export const fetchInvite = (invite_id, hash_value) => {
	return (dispatch, getState) => {
		dispatch(AxiosCallRequest());
		let url=`${ep}/api/invites`;
		axios.get(url,{
			params:{
				"invite_id":invite_id,
				"hash_value":hash_value
			}
		}).then(response => {
			if(response.success) {
				if (response.data.status === InviteStatus.EXPIRED) {
					dispatch(showErrorPage({
						errorType:"Application Error",
						errorHeading:"Invalid Invite Id",
						errorMessage:"Please contact CodeHall for further assistance"
					}))
					history.push('/error')
				} else {
					dispatch(validateInviteSuccess(response.data))
					let user_id = getState().auth.user_id
					let test_id = response.data.test_id
					if (isLoggedIn(user_id)) {
						dispatch(fetchAssesmentForInvite(test_id, invite_id))
					}
				}
				dispatch(AxiosCallSuccess())
			}
		}).catch(error => {
			if (error.response) {
				if (error.response.status === 404) {
					dispatch(showErrorPage({
						errorType:"Application Error",
						errorHeading:"Invalid Invite Id",
						errorMessage:"Please contact CodeHall for further assistance"
					}))
				} else if (error.response.status === 400) {
					dispatch(showErrorPage({
						errorType:"Application Error",
						errorHeading:"Invalid Signature",
						errorMessage:"Please contact CodeHall for further assistance"
					}))
				} else {
					dispatch(showErrorPage({
						errorType:"Application Error",
						errorHeading:"Invalid Invite Id",
						errorMessage:"An error occured while validating the invite"
					}))
				}
				history.push('/error')
				dispatch(AxiosCallSuccess())
			}
		})
	};
};

export const startTest = (test_id, invite_id) => {
	return (dispatch, getState) => {
		dispatch(AxiosCallRequest())
		let url=`${ep}/api/start_test`
		axios.get(url,{
			params: {
				test_id: test_id,
				invite_id: invite_id
			}
		}).then(
			response => {
				dispatch(startTestSuccess(response.data))
				dispatch(AxiosCallSuccess())
				history.push(`/assessment/${response.data.id}`)
			}
		).catch(
			error => {
				if (error.response) {
					if (error.response.status === 401) {
						Modal.error({
							title: 'Unauthorized access',
							content: 'Please make sure you are logged in as the user who received the invite'
						})
					} else if (error.response.status === 409) {
						Modal.error({
							title: 'Unable to start test',
							content: 'This invite has already been used for another test'
						})
					} else {
						Modal.error({
							title: 'An error occured',
							content: 'Please contact CodeHall for further assistance'
						})
					}
				}
				dispatch(AxiosCallError({message: "An error occured while starting test"}))
			}
		)
	}
}

export const fetchAssesmentForInvite = (test_id, invite_id) => {
	return (dispatch) => {
		dispatch(AxiosCallRequest())
		let url = `${ep}/api/tests/${test_id}/invites/${invite_id}/assessments/`
		axios.get(url).then(
			response=>{
				if (response.data.status === 'CM') {
					dispatch(showErrorPage({
						'errorType': 'Application Error',
						'errorHeading': 'Assessment Complete',
						'errorMessage': 'This assessment is complete and can no longer be viewed'
					}))
					history.push('/error')
				}
				//sets the assesment in invite state
				dispatch(setAssessment(response.data))
				//updates the assessment in assessment sub state
				dispatch(fetchAssessment(response.data.id))
				dispatch(AxiosCallSuccess())
			}
		).catch(error => {
			if (error.response) {
				if (error.response.status === 401) {
					Modal.error({
						title: 'Unauthorized access',
						content: 'Please make sure you are logged in as the user who received the invite'
					})
				}
			}
			dispatch(AxiosCallError(error))
		})
	}
}