import { handleActions } from "redux-actions";

export const InviteStatus = Object.freeze({
	ACTIVE: "ACTIVE",
	EXPIRED: "EXPIRED",
	INVALID: "INVALID"
});

export const AssessmentStatus = Object.freeze({
	InProgress: "InProgress",
	Completed: "Completed"
})

const AssessmentStatusMap = {
	PG: AssessmentStatus.InProgress,
	CM: AssessmentStatus.Completed
}

const initialState = {
	invite_id: "",
	assessment_id: "",
	status: "",
	assessment_status: "",
	test_id: ""
};


const InviteReducer = handleActions(
	{
		VALIDATE_INVITE_SUCCESS: (state, action) => {
			return {
				...state,
				status: action.payload.status,
				test_id: action.payload.test_id,
				invite_id: action.payload.invite_id,
				test_title: action.payload.test_title,
				test_description: action.payload.test_description,
				test_time: action.payload.test_time,
				test_num_problems: action.payload.test_num_problems
			};
		},

		VALIDATE_INVITE_FAILURE: (state, action) => {
			return {
				...state,
				status: InviteStatus.INVALID,
			};
		},

		SET_ASSESSMENT: (state, action) => {
			return {
				...state,
				assessment_id: action.payload.id,
				assessment_status: AssessmentStatusMap[action.payload.status]
			}
		}
	},
	initialState
);

export default InviteReducer;
