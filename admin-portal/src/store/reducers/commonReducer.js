import { handleActions, combineActions } from "redux-actions";

import {
	getAxiosCallError,
	getAxiosCallRequest,
	getAxiosCallSuccess,
} from "../actions/commonActions";

import {
	getTestsDataSuccess,
	createTestSuccess,
} from "../actions/testActions";

import {
	getProblemDataSuccess,
	getProblemsDataSuccess,
	getProblemTagsDataSuccess,
} from "../actions/problemActions";

const commonstate = {
	loading: false,
	error: false,
	loadingRequestCount: 0,
	errorMessage: null,
	successMessage: null
};

const commonReducer = handleActions(
	{
		[combineActions(getAxiosCallRequest)](state) {
			return {
				...state,
				loading: true,
				errorMessage: null,
				loadingRequestCount: state.loadingRequestCount + 1,
				successMessage: null,
				error: false
			};
		},
		[combineActions(getAxiosCallSuccess)](state, action) {
			return {
				...state,
				loading: false,
				successMessage: action.payload && action.payload.successMessage
					? action.payload.successMessage
					: null,
				loadingRequestCount:
					state.loadingRequestCount < 1 ? 0 : state.loadingRequestCount - 1,
				error: false
			};
		},
		[combineActions(getAxiosCallError)](state, action) {
			if (action.payload.response) {
				return {
					...state,
					error: true,
					loading: false,
					successMessage: null,
					loadingRequestCount:
						state.loadingRequestCount < 1 ? 0 : state.loadingRequestCount - 1,
					errorMessage: action.payload.request.responseText
						? action.payload.request.responseText
						: '"Sorry":"Somethings Wrong"',
					statusCode: action.payload.response.status
				};
			} else {
				return {
					...state,
					error: true,
					loadingRequestCount:
						state.loadingRequestCount < 1 ? 0 : state.loadingRequestCount - 1,
					loading: false,
					statusCode: null,
					successMessage: null
				};
			}
		},

		[combineActions(
			getProblemDataSuccess,
			getProblemsDataSuccess,
			getTestsDataSuccess,
			getProblemTagsDataSuccess,
			createTestSuccess,
		)](state) {
			return {
				...state,
				loading: false,
				loadingRequestCount:
					state.loadingRequestCount < 1 ? 0 : state.loadingRequestCount - 1,
				successMessage: null,
				error: false
			};
		}
	},
	commonstate
);

export default commonReducer;
