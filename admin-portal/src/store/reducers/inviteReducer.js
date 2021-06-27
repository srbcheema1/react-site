import { handleActions } from "redux-actions";
import produce from "immer"

const inviteState = {
	emailTemplates: [],
	inviteModal: {
		loading:false,
		visible:false,
		success:false,
		error:"",

		bulk_ready:false,
	}
};

const inviteReducer = handleActions(
	{
		ASSESSMENT_SENDINVITES_SUCCESS: (state, action) =>
			produce(state, draft => {
				draft.inviteModal.success = true
				draft.inviteModal.loading = false
			}),
		ASSESSMENT_SENDINVITES_LOADING: (state, action) =>
			produce(state, draft => {
				draft.inviteModal.loading = true
			}),
		ASSESSMENT_SENDINVITES_ERROR: (state, action) =>
			produce(state, draft => {
				draft.inviteModal.loading = false
				draft.inviteModal.error = action.payload.error
			}),
		ASSESSMENT_SENDINVITES_SHOW: (state, action) =>
			produce(state, draft => {
				draft.inviteModal.visible=true;
				draft.inviteModal.success = false;
				draft.inviteModal.error = "";
				draft.inviteModal.loading=false;
				draft.inviteModal.bulk_ready=false;
			}),
		ASSESSMENT_SENDINVITES_HIDE: (state, action) =>
			produce(state, draft => {
				draft.inviteModal.visible=false;
			}),

		ASSESSMENT_UPLOAD_SUCCESS: (state, action) =>
			produce(state, draft => {
				draft.inviteModal.loading = false
			}),
		ASSESSMENT_UPLOAD_LOADING: (state, action) =>
			produce(state, draft => {
				draft.inviteModal.loading = true
			}),
		ASSESSMENT_UPLOAD_ERROR: (state, action) =>
			produce(state, draft => {
				draft.inviteModal.error = action.payload.error
			}),
		ASSESSMENT_SET_BULK_READY: (state, action) =>
			produce(state, draft => {
				draft.inviteModal.bulk_ready = action.payload.status;
			}),

		ASSESSMENT_GETEMAILTEMPLATES_SUCCESS: (state, action) => {
			return {
				...state,
				email_templates: action.payload.email_templates
			};
		}
	},
	inviteState
);

export default inviteReducer;
