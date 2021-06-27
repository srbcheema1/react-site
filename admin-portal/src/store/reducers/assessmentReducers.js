import { handleActions } from "redux-actions";
import produce from "immer"
import moment from 'moment';
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment);

export const question = {
	// just a prototype of a question
	best_submission:null,
	curr_submission:null,
	submissions:{},
	testcases:[],
}

const assessment = {
	assessment_id:null,
	name:"",
	completion_time:"",
	experience:"",
	email:"",
	time_taken:"",
	score:0,
	invited_by:"",
	status:"",

	total_score:100,
	questions:{},
	active_question:null,
}

const assessmentReducer = handleActions(
	{
		ASSESSMENT_SET_STATE: (state,action) => {
			return {
				...state,
				...action.payload,
			}
		},
		ASSESSMENT_RESET_STATE: (state,action) => {
			return assessment
		},
		ASSESSMENT_SET_BASE: (state,action) => 
			produce(state, draft => {
				draft.assessment_id = action.payload.assessment_id
				draft.name = action.payload.full_name
				draft.completion_time = action.payload.completion_time
				draft.invited_by = action.payload.invited_by
				draft.experience = action.payload.experience
				draft.email = action.payload.email_id
				draft.score = action.payload.score
				draft.status = action.payload.status

				let end = moment(action.payload.completion_time)
				let start = moment(action.payload.start_time)
				draft.time_taken = moment.duration(end.diff(start)).format('hh:mm:ss',{trim:false})
			}),
		UPDATE_ASSESSMENT: (state,action) =>
			produce(state,draft =>{
				draft.questions = action.payload.questions
				draft.active_question = action.payload.active_question
				draft.total_score = action.payload.total_score
			}),
		SET_ACTIVE_QUESTION: (state,action) =>
			produce(state,draft=>{
				draft.active_question = action.payload.active_question
			}),
		ASSESSMENT_SET_SUBMISSIONS: (state,action) =>
			produce(state,draft=>{
				if(action.payload.question_id in draft.questions) {
					draft.questions[action.payload.question_id].submissions = action.payload.data
				}
			}),
		SET_BEST_SUBMISSION: (state,action) =>
			produce(state,draft=>{
				if(action.payload.question_id in draft.questions) {
					draft.questions[action.payload.question_id].best_submission = action.payload.data
				}
			}),
		SET_CURR_SUBMISSION: (state,action) =>
			produce(state,draft=>{
				if(action.payload.question_id in draft.questions) {
					draft.questions[action.payload.question_id].curr_submission = action.payload.data
				}
			}),
	},
	assessment
);

export default assessmentReducer;