import { handleActions } from "redux-actions";

const initialState = {
	username: "",
	user_id: "",
	firstName: "",
	lastName: "",
	fullName: "",
	cities: [],
	states: [],
	filteredStates: [],
	locations: []
};

const AuthReducer = handleActions(
	{
		LOGIN_SUCCESS: (state, action) => {
			return {
				...state,
				username: action.payload.username,
				user_id: action.payload.user_id,
				firstName: action.payload.first_name,
				lastName: action.payload.last_name,
				fullName: action.payload.full_name
			};
		},
		GET_USER_INFO_SUCCESS: (state, action) => {
			return {
				...state,
				user_id: action.payload.user_id,
				firstName: action.payload.first_name,
				lastName: action.payload.last_name,
				fullName: action.payload.full_name
			};
		},
		GET_MATCHING_CITIES: (state, action) => {
			return {
				...state,
				cities: action.payload.response
			};
		},
		GET_ALL_STATES: (state, action) => {
			return {
				...state,
				states: action.payload.states,
				filteredStates: action.payload.states
			};
		},
		FILTER_LOCATIONS: (state, action) => {
			return {
				...state,
				locations: action.payload.locations
			};
		}
	},
	initialState
);

export default AuthReducer;
