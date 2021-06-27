import { createAction } from "redux-action";

export const updateCode = createAction("EDITOR_UPDATE_CODE");

export const updateLang = createAction("EDITOR_UPDATE_LANG");

export const setInput= createAction("EDITOR_SET_INPUT");

export const setStdout= createAction("EDITOR_SET_STDOUT");