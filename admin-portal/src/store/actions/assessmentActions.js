import axios from "axios";
import { createAction } from "redux-actions";
import { get_service_endpoint } from "../../ServiceEndpoints.js";
import { getAxiosCallError } from "./commonActions.js";
import { fetchUsers } from "./authActions";

export const assessmentSetState = createAction("ASSESSMENT_SET_STATE")
export const assessmentResetState = createAction("ASSESSMENT_RESET_STATE")

export const assessmentSetBase = createAction("ASSESSMENT_SET_BASE")
export const updateAssessment = createAction("UPDATE_ASSESSMENT")
export const assessmentSetSubmissions = createAction("ASSESSMENT_SET_SUBMISSIONS")
export const setBestSubmission = createAction("SET_BEST_SUBMISSION")
export const setCurrSubmission = createAction("SET_CURR_SUBMISSION")

export const setActiveQuestion = createAction("SET_ACTIVE_QUESTION")

export const fetchAssessment = (test_id, assessment_id,setBase=false) => {
	return (dispatch) => {
		let ep = get_service_endpoint("assessment");               
		axios.get(
			`${ep}/api/assessments/${assessment_id}/`
		).then(
			response => {
				let questions = {}
				let index = 0
				let total_score = 0
				let submissions = []
				response.data.problems.forEach(p=>{
					index++;
					questions[p.id] = {
						...p,
						index:index,
						submissions
					}
					total_score += p.points
					dispatch(fetchAllSubmissions(assessment_id,p.id));
				})
				dispatch(updateAssessment({questions,active_question:response.data.problems[0].id,total_score}))
				if(setBase) dispatch(fetchAssessmentBase(test_id, assessment_id))
			}
		).catch(
			error => {
				dispatch(getAxiosCallError(error));
			}
		)
	}
}

const fetchAssessmentBase = (test_id, assessment_id) => {
	return dispatch => {
		fetchAssessmentById(test_id, assessment_id)
		.then(response => {
			let assessment = response.data.results[0];
			fetchUsers([assessment.invited_by]).then(res=>{
				let full_name = assessment.full_name
				let invited_by = res[0].full_name
				let experience = assessment.experience
				let email_id = assessment.email_id
				let assessment_vals = {
					assessment_id,
					full_name,
					completion_time: assessment.completion_time,
					invited_by,
					experience,
					email_id,
					score: assessment.score,
					status: assessment.status,
					start_time: assessment.start_time
				}
				dispatch(assessmentSetBase(assessment_vals))
			}).catch(err => {
				dispatch(getAxiosCallError(err));
			});
		})
	}
}

const fetchAssessmentById = async (test_id, assessment_id) => {
		let ep = get_service_endpoint("assessment");
		let url = `${ep}/api/tests/${test_id}/candidate_filter/`
		let response = await axios.get(url,{
			params: {
				assessment_id: assessment_id,
			}
		})
		return response
}

export const fetchAllSubmissions = (assessment_id, problem_id) => {
	return dispatch => {
		let ep = get_service_endpoint("assessment");
		axios
			.get(`${ep}/api/assessments/${assessment_id}/problems/${problem_id}/codesubmissions/`)
			.then(response => {
				let data = {}
				response.data.code_submissions.forEach(submission => {
					data[submission.id] = submission
				})
				dispatch(assessmentSetSubmissions({question_id:problem_id,data}))
				if(response.data.best_code_submission !== "") {
					dispatch(setBestSubmission({question_id:problem_id,data:response.data.best_code_submission}))
					dispatch(setCurrSubmission({question_id:problem_id,data:response.data.best_code_submission}))
				} else {
					dispatch(setBestSubmission({question_id:problem_id,data:null}))
				}
			})
			.catch(err=>{
				dispatch(getAxiosCallError(err));
			})
	};
}

export const evaluate = (assesments,action,callback) => {
	return dispatch => {
		let ep = get_service_endpoint("assessment");
		axios
		.post(
			`${ep}/api/assessments/evaluate/${action}/`,
			assesments,
		)
		.then(response => {
			callback()
		})
		.catch(err => {
			dispatch(getAxiosCallError(err));
		});
	};
}