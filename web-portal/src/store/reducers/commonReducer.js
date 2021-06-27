import { handleActions } from "redux-actions";

const commonstate = {
	loading: false,
	error: false,
	errorType: null,
	errorHeading: null,
	errorMessage: null,
	showAuthModal: "",
	modal: {
		visible: false,
		title: "",
		content: ""
	},
	MessageContent: [],
	search_result_loading: false,
	entity_id: "",
	entity_type: "",
	notFound: false
};

const commonReducer = handleActions(
	{
		REQUEST_API: (state, action) => {
			return {
				...state,
				loading: action.payload
			};
		},

		AXIOS_CALL_REQUEST: state => {
			return { ...state, loading: true };
		},

		AXIOS_CALL_ERROR: (state, action) => {
			return {
				...state,
				error: true,
				loading: false,
				errorMessage: action.payload.message
				//statusCode: action.payload.response.status
			};
		},

		AXIOS_CALL_SUCCESS: state => {
			return { ...state, loading: false };
		},

		
		ON_LOAD_MODAL: (state, action) => {
			return {
				...state,
				modal: {
					showModal: action.payload.showModal,
					modalType: action.payload.modalType,
					modalContent: action.payload.modalContent
				}
			};
		},

		ON_TOGGLE_AUTH_MODAL: (state, action) => {
			return {
				...state,
				showAuthModal: action.payload
			};
		},

		SHOW_FLASH_MESSAGE: (state, action) => {
			return {
				...state,
				MessageContent: [...state.MessageContent, action.payload]
			};
		},
		HIDE_FLASH_MESSAGE: state => {
			return {
				...state,
				MessageContent: state.MessageContent.slice(1)
			};
		},
		
		PAGE_NOT_FOUND: (state, action) => {
			return {
				...state,
				notFound: action.payload.pageNotFound,
				errorType:action.payload.errorType,
				errorHeading:action.payload.errorHeading,
				errorMessage:action.payload.errorMessage
			}
		},

		SHOW_ERROR_PAGE: (state, action) => {
			return {
				...state,
				errorType:action.payload.errorType,
				errorHeading:action.payload.errorHeading,
				errorMessage:action.payload.errorMessage
			}
		},
	},
	commonstate
);

export default commonReducer;
