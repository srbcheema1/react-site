import axios from "axios";
import { get_service_endpoint } from "../../ServiceEndpoints.js";
import { createAction } from "redux-actions";
import { getAxiosCallError } from "./commonActions.js";

export const sendInviteLoading = createAction("ASSESSMENT_SENDINVITES_LOADING")
export const sendInvitesSuccess = createAction("ASSESSMENT_SENDINVITES_SUCCESS")
export const sendInvitesError = createAction("ASSESSMENT_SENDINVITES_ERROR")
export const sendInvitesShow = createAction("ASSESSMENT_SENDINVITES_SHOW")
export const sendInvitesHide = createAction("ASSESSMENT_SENDINVITES_HIDE")

export const uploadLoading = createAction("ASSESSMENT_UPLOAD_LOADING")
export const uploadSuccess = createAction("ASSESSMENT_UPLOAD_SUCCESS")
export const uploadError = createAction("ASSESSMENT_UPLOAD_ERROR")
export const setBulkReady = createAction("ASSESSMENT_SET_BULK_READY")

export const getEmailTemplatesSuccess = createAction("ASSESSMENT_GETEMAILTEMPLATES_SUCCESS");

export const sendInvites = (data,test_id) => {
	return dispatch => {
		dispatch(sendInviteLoading());
		let ep = get_service_endpoint("assessment");
		axios
		.post(`${ep}/api/tests/${test_id}/invites/`,
			data
		)
		.then(response => {
			dispatch(sendInvitesSuccess());
		})
		.catch(err => {
			dispatch(sendInvitesError({error:err}));
		});
	}
}

export const getEmailTemplates = () => {
	return dispatch => {
		let ep = get_service_endpoint("assessment");
		axios
		.get(`${ep}/api/email_templates/`)
		.then(response => {
			dispatch(getEmailTemplatesSuccess({
				email_templates: response.data,
			}));
		})
		.catch(err => {
			dispatch(getAxiosCallError(err));
		});
	};
}

export const uploadCSV = ({file,onSuccess,onError,onProgress}) => {
	return dispatch => {
		dispatch(uploadLoading());
		let ep = get_service_endpoint("assessment");
		let url = `${ep}/api/bulk_invite/`
		const formData = new FormData();
		formData.append('file',file)
		const config = {
			headers: { 'content-type': 'multipart/form-data' },
			onUploadProgress: e => {
				onProgress({ percent: (e.loaded / e.total) * 100 });
			},
		}
		axios.post(url,formData,config)
		.then(response => {
			dispatch(uploadSuccess());
			onSuccess(response.data)
		})
		.catch(err => {
			dispatch(uploadError({error:err}));
			onError(err)
		});
	}
}