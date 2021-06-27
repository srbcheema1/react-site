import { createAction } from "redux-action";
import axios from "axios";
import { AxiosCallError, AxiosCallRequest, AxiosCallSuccess, showErrorPage } from "./commonActions";
import { get_service_endpoint } from "../../ServiceEndpoints.js";
import { history } from "../../index"
import { Modal } from 'antd'
import { selectedTab } from "../reducers/AssessmentReducer";

let ep = get_service_endpoint('assessment')

export const resetTestCaseResultStatus = createAction("RESET_TC_RES_STATUS")
export const setCustInpResults = createAction("SET_CUSTOM_INP_RESULTS")
export const resetCustInpResults = createAction("RESET_CUSTOM_INP_RESULTS")

//sets the tab being viewed - prob desc, output or testcases
export const chooseOption = createAction("CHOOSE_OPTION");

export const SetInviteCredential = createAction("SET_INVITE_CREDENTIAL");

export const startTestSuccess = createAction("START_TEST_SUCCESS")

export const updateAssessment = createAction("UPDATE_ASSESSMENT")

export const assignLogo =createAction("ASSIGN_LOGO");

//selects a single problem to work on
export const assignProblem = createAction("ASSIGN_PROBLEM");
export const assignTestcases = createAction("ASSIGN_TESTCASES");
export const assignTemplate = createAction("EDITOR_ASSIGN_TEMPLATE");

//removes all the base code set in ASSIGN_TEMPLATES action
export const resetAll = createAction("EDITOR_RESET_ALL");

export const markAttempted = createAction("MARK_ATTEMPTED")

export const setTimerExpLevel = createAction("SET_TIMER_EXP_LEVEL")

export const fetchAssessment = (assessment_id, problem_id) => {
	return (dispatch, getState) => {
		dispatch(AxiosCallRequest());
		axios.get(
			`${ep}/api/assessments/${assessment_id}/`
		).then(
			response => {
				if (response.data.status === 'CM') {
					dispatch(showErrorPage({
						'errorType': 'Application Error',
						'errorHeading': 'Assessment Complete',
						'errorMessage': 'This assessment is complete and can no longer be viewed'
					}))
					history.push('/error')
				} else {
					dispatch(updateAssessment(response.data))
					dispatch(fetchTestCasesData(response.data))
					dispatch(selectProblem(problem_id, false))
				}
				dispatch(AxiosCallSuccess()) 
			}
		).catch(
			error => {
				if (error.response) {
					if (error.response.status === 401) {
						Modal.error({
							title: 'Unauthorized access',
							content: 'Please make sure you are logged in as the user who received the invite'
						})
					}
				}
				dispatch(AxiosCallError())
			}
		)
	}
}

const assignLogoAndStatus = ({id,logo}) => {
	return (dispatch) => {
		let logo_list = Object.values(logo)
		let passCases = logo_list.filter(logo => logo === 'AC').length
		let totalCases = logo_list.length
		let notAttempted = logo_list.filter(logo => ["UA","NA"].includes(logo)).length
		let failedCases = logo_list.filter(logo => ["TLE","WA","CE","RE"].includes(logo)).length
		let status = ""
		if (passCases === totalCases) {
			status = "ALL_PASS"
		} else if (notAttempted === totalCases) {
			status = "NA"
		} else if (failedCases === totalCases) {
			status = "ALL_FAIL"
		} else if (passCases > 0) {
			status = "SOME_PASS"
		}
		dispatch(assignLogo({id,logo,status}));
	}
}

export const fetchTestCasesData = (res) => {
	return(dispatch) => {
		res.problems.forEach(prob => {
			if (prob.codesubmission_id && prob.codesubmission_id !== null) {
				dispatch(fetchTestCaseExecResults(prob.id, prob.codesubmission_id))
			} else {
				let tc_logo = {}
				prob.testcases.forEach(t=>{
					tc_logo[t.id] = 'NA'
				})
				dispatch(assignLogoAndStatus({id:prob.id,logo:tc_logo}));
			}
		});
	}
}

export const selectProblem = (problem_id, hist_push=true) => {
	return (dispatch, getState) => {
			dispatch(assignProblem({problem_id: problem_id}));
			dispatch(chooseOption({
				activeTab: selectedTab.problemStatement,
				problem_id: problem_id,
			}))
			if (hist_push) {
				history.push(`/assessment/${getState().assessment.id}/problem/${problem_id}`)
			}
		};
};

export const submitAssessment = (assessmentId, redirect=true) => {
	
	return (dispatch, getState) => {
		dispatch(AxiosCallRequest());
		const submitCodePromises = []
		getState().assessment.problems.forEach(problem => {
		if (!problem.attempted && problem.editor && problem.editor.isDirty) {
		  problem.templates.forEach(template => {
			if (problem.editor.isDirty[template.language]) {
			  let data = {
				assessment_id: assessmentId,
				problem_id: problem.id,
				code_body: problem.editor.code[template.language]
				  .replace(template.header, "")
				  .replace(template.tailer, ""),
				language: template.language,
				cs_type: "regular",
				auto_submitted: true
			  };
			  submitCodePromises.push(axios.post(`${ep}/api/codesubmissions/`, data));
			}
		  });
		}
	  });
	  
  	Promise.all(submitCodePromises).finally(() => {
		const body ={}
		axios.post(
			`${ep}/api/assessments/${assessmentId}/end_assessment/`,
			body
		).then(
			response => {
				dispatch(AxiosCallSuccess())
				if (redirect) {
					history.push("/testcomplete")
				}
			}
		).catch(
			error => {
				if (error.response) {
					if (error.response.status === 401) {
						Modal.error({
							title: 'Unauthorized access',
							content: 'Please make sure you are logged in as the user who received the invite'
						})
					}
					if (error.response.status === 400) {
						Modal.error({
							title: 'An error occured',
							content: error.response.data.msg
						})
					}
				}
				dispatch(AxiosCallError())
			}
		)
	 });
	}
}

export const fetchCustomInputExecResults = (code_submission_id, max_tries=5) => {
	return dispatch => {
		const url = `${ep}/api/codesubmissions/${code_submission_id}/tc_executions/`;
		axios.get(url)
		.then(
			res => {
				let ciResult = res.data[0]
				if (ciResult.status === 'EX' && max_tries > 0) {
					window.setTimeout(
						() => { dispatch(fetchCustomInputExecResults(code_submission_id, max_tries-1)) },
						2000
					)
				} else {
					dispatch(setCustInpResults(res.data[0]))
					dispatch(AxiosCallSuccess())
				}
			}
		)
	}
}

export const fetchTestCaseExecResults = (prob_id, code_submission_id, max_tries=10) => {
	return dispatch => {
		const url = `${ep}/api/codesubmissions/${code_submission_id}/tc_executions/`;
		axios.get(url)
		.then(
			res => {
				let tc_logo = {}
				res.data.forEach(
					tcResult => {
						if(tcResult.compiler_error) {
							tc_logo[tcResult.testcase_id] = 'CE'
						}
						else if(tcResult.runtime_error) {
							tc_logo[tcResult.testcase_id] = 'RE'
						}
						else if(tcResult.timelimitexceeded_error) {
							tc_logo[tcResult.testcase_id] = 'TLE'
						}
						else {
							if(tcResult.status==='SC') {
								tc_logo[tcResult.testcase_id] = 'AC'
							}
							else if (tcResult.status==='EX') {
								tc_logo[tcResult.testcase_id] = 'LOAD'
							}
							else if (tcResult.status==='FL') {
								tc_logo[tcResult.testcase_id] = 'WA'
							}
							else {
								tc_logo[tcResult.testcase_id] = 'UA'
							}
						}
					}
				)
				dispatch(assignLogoAndStatus({id:prob_id,logo:tc_logo}));
				let pending_tcs = res.data.filter(tcResult => tcResult.status==='EX')
				if (pending_tcs.length > 0 && max_tries > 0) {
					window.setTimeout(
						() => { dispatch(fetchTestCaseExecResults(prob_id, code_submission_id, max_tries-1)) },
						2000
					)
				}
			}
		)
	}
}


export const submitCode=(data) => {
	return dispatch => {
		dispatch(AxiosCallRequest());
		const url = `${ep}/api/codesubmissions/`;
		const body ={
			"assessment_id":data.id,
			"problem_id": data.problem_id,
			"code_body": data.code_body,
			"language": data.language,
			"cs_type": data.cs_type
		}
		if (data.cs_type==='custom_input') {
			body['ci_stdin'] = data.ci_stdin
		} else {
			dispatch(resetTestCaseResultStatus({logo: 'LOAD'}))
		}

		axios.post(url,body)
		.then(response => {
			if (data.cs_type === 'regular') {
				dispatch(chooseOption({
					activeTab: selectedTab.results,
					problem_id: data.problem_id
				}))
			}

			if (data.cs_type === "custom_input") {
				dispatch(fetchCustomInputExecResults(response.data.id))
			} else {
				dispatch(AxiosCallSuccess())
				dispatch(fetchTestCaseExecResults(data.problem_id, response.data.id))
				// question is marked attempted only when it is submitted not tested
				dispatch(markAttempted({problem_id: data.problem_id}))
			}
		})
	};
};
