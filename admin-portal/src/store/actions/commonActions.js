import {createAction} from "redux-actions";

export const getAxiosCallError = createAction('AXIOS_GETREQUEST_ERROR')
export const getAxiosCallRequest = createAction('AXIOS_GETCALL_REQUEST')
export const getAxiosCallSuccess = createAction('AXIOS_GETCALL_SUCCESS')
