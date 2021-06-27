import axios from "axios";
import { createAction } from "redux-action";
import { get_service_endpoint } from "../../ServiceEndpoints.js";

//let ep = get_service_endpoint("cs-auth");

// let ep = "http://127.0.0.1:8000";

const errorType="404";

let fsep = get_service_endpoint("cs-fileupload");

export const AxiosCallRequest = createAction("AXIOS_CALL_REQUEST");

export const AxiosCallError = createAction("AXIOS_CALL_ERROR");

export const AxiosCallSuccess = createAction("AXIOS_CALL_SUCCESS");

export const onLoadModal = createAction("ON_LOAD_MODAL");

export const requestApi = createAction("REQUEST_API");

export const onToggleAuthModal = createAction("ON_TOGGLE_AUTH_MODAL");

export const onLocationChange = createAction("@@react-router/LOCATION_CHANGE");

export const Download = createAction("DOWNLOAD");

export const resetEntityTypeAndID = createAction("RESET_ENTITY_TYPE_AND_ID");

export const showErrorPage = createAction("SHOW_ERROR_PAGE")

export const deleteFileFromServer = payload => {
	return () => {
		axios.delete(`${fsep}/api/files/${payload.fileId}/`);
	};
};


export const attemptToDownloadFile = payload => dispatch =>
	dispatch(Download({ type: "DOWNLOAD_ATTEMPT", data: payload }));

export const downloadFile = payload => dispatch =>
	dispatch(Download({ type: "DOWNLOAD_SUCCESS", data: payload }));

export const pageNotFound = createAction("PAGE_NOT_FOUND")

export const resetPageNotFound = () => {
	return dispatch => {
		dispatch(pageNotFound(false));
	}
}

export const setPageNotFound = (errorHeading,errorMessage) => {
	return dispatch => {
		dispatch(pageNotFound({pageNotFound:true,errorHeading,errorMessage,errorType}));
	}
}
