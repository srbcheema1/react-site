import { createAction } from "redux-action";

export const showFlashMessage = createAction("SHOW_FLASH_MESSAGE");
export const hideFlashMessage = createAction("HIDE_FLASH_MESSAGE");

export const flash = (message, duration = 1500) => {
	return dispatch => {
		dispatch(showFlashMessage(message));
		setTimeout(() => dispatch(hideFlashMessage()), duration);
	};
};
