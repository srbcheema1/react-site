import axios from "axios";
import { createAction } from "redux-actions";

import { get_service_endpoint } from "../../ServiceEndpoints.js";
import { getAxiosCallError, getAxiosCallRequest, getAxiosCallSuccess } from "./commonActions.js";

export const getProblemsDataSuccess = createAction("GET_PROBLEMS_DATA_SUCCESS");
export const getProblemDataSuccess = createAction("GET_PROBLEM_DATA_SUCCESS");
export const getProblemTagsDataSuccess = createAction("GET_TAGS_DATA_SUCCESS");

export const setProblemTestCases = createAction("SET_PROBLEM_TEST_CASES");
export const setProblemTemplates = createAction("SET_PROBLEM_TEMPLATES");
export const updateTemplate = createAction("UPDATE_TEMPLATE");
export const deleteTemplate = createAction("DELETE_TEMPLATE");
export const addTemplate = createAction("ADD_TEMPLATE");

export const setEditorCode = createAction("SET_EDITOR_CODE")
export const deleteEditorCode = createAction("DELETE_EDITOR_CODE")

export const getProblemsData = () => {
	return dispatch => {
		dispatch(getAxiosCallRequest());
		let ep = get_service_endpoint("copdg");
		let url = `${ep}/api/problems/`
		axios
			.get(url)
			.then(response => {
				dispatch(getProblemsDataSuccess({ problems: response.data }));
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
	};
};

export const getProblemData = (prob_id) => {
	return dispatch => {
		dispatch(getAxiosCallRequest());
		let ep = get_service_endpoint("copdg");
		let url = `${ep}/api/problems/${prob_id}/`
		axios
			.get(url)
			.then(response => {
				dispatch(getProblemDataSuccess({ problem: response.data }));
				dispatch(fetchTestCases(response.data.id));
				dispatch(getProblemTemplates(prob_id));
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
	};
};

export const getProblemTemplates = (prob_id) => {
	return dispatch => {
		dispatch(getAxiosCallRequest());
		let ep = get_service_endpoint("copdg");
		let url = `${ep}/api/problems/${prob_id}/templates/`
		axios
			.get(url)
			.then(response => {
				let data = {}
				response.data.forEach(t=>{
					data[t.language] =t;
				})
				dispatch(setProblemTemplates({templates:data}));
				dispatch(getAxiosCallSuccess());
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
	};
};

export const removeTemplate = (lang) => {
	return (dispatch,getState) => {
		let ep = get_service_endpoint("copdg");
		const templates = getState().problem.problem.template_codes;
		const prob_id = getState().problem.problem.id;
		if(templates[lang].id !=="") {
			let url = `${ep}/api/problems/${prob_id}/templates/${templates[lang].id}/`
			axios.delete(url)
			.then(response => {
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
		}
		dispatch(deleteTemplate({language:lang}))
	}
}

export const runEditorCode = (code, lang) => {
	return (dispatch,getState) => {
		let ep = get_service_endpoint("assessment");
		let url = `${ep}/api/codesubmissions/`;
		let data = {
			"code_body": code,
			"language":lang,
			"cs_source":"admin",
			"problem_id":getState().problem.problem.id,
		}
		axios.post(url,data)
		.then(response => {
			dispatch(fetchSubmissionData(response.data.id,lang))
		})
		.catch(err => {
			dispatch(getAxiosCallError(err));
		});
	}
}

const fetchSubmissionData = (id,lang) => {
	return (dispatch,getState) => {
		let ep = get_service_endpoint("assessment");
		let url = `${ep}/api/codesubmissions/${id}/tc_executions/`;
		axios.get(url)
		.then(response => {
			console.log('srb response',response.data)
			dispatch(setEditorCode({lang,tc:response.data}))
		})
		.catch(err => {
			dispatch(getAxiosCallError(err));
		});
	}
}

export const syncTemplate = (lang) => {
	// creates and updates
	return (dispatch,getState) => {
		const templates = getState().problem.problem.template_codes;
		const prob_id = getState().problem.problem.id;
		let ep = get_service_endpoint("copdg");
		let url = `${ep}/api/problems/${prob_id}/templates/`
		let data = {
			body: templates[lang].body,
			header: templates[lang].header,
			tailer: templates[lang].tailer,
			language: lang,
		}

		if(templates[lang].id !== "") {
			url = `${ep}/api/problems/${prob_id}/templates/${templates[lang].id}/`
			axios.patch(url,data)
			.then(response => {
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
		} else {
			url = `${ep}/api/problems/${prob_id}/templates/`
			axios.post(url,data)
			.then(response => {
				dispatch(updateTemplate({language:lang,key:"id",value:response.data.id}))
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
		}
	}
}

export const fetchTestCases = (prob_id) => {
	return dispatch => {
		dispatch(getAxiosCallRequest());
		let ep = get_service_endpoint("copdg");
		let url = `${ep}/api/problems/${prob_id}/test_cases/`
		axios
			.get(url)
			.then(response => {
				dispatch(setProblemTestCases({test_cases:response.data}));
				dispatch(getAxiosCallSuccess());
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
	};
}

export const updateTestCase = (prob_id,tc_id,data) => {
	return dispatch => {
		let ep = get_service_endpoint("copdg");
		let url = `${ep}/api/problems/${prob_id}/test_cases/${tc_id}/`
		axios
			.patch(url,data)
			.then(response => {
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
	};
}

export const deleteTestCase = (prob_id,tc_id,data) => {
	return dispatch => {
		let ep = get_service_endpoint("copdg");
		let url = `${ep}/api/problems/${prob_id}/test_cases/${tc_id}/`
		axios
			.delete(url,data)
			.then(response => {
				dispatch(fetchTestCases(prob_id));
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
	};
}

export const createQuestion = (values,callback) => {
	return dispatch => {
		let ep = get_service_endpoint("copdg");
		axios
		.post(
			`${ep}/api/problems/`,
			values
		)
		.then(response => {
			dispatch(getProblemData(response.data.id));
			callback(response.data.id);
		})
		.catch(err => {
			dispatch(getAxiosCallError(err));
		});
	};
}

export const updateQuestion = (prob_id,values,callback) => {
	return dispatch => {
		let ep = get_service_endpoint("copdg");
		axios
		.patch(
			`${ep}/api/problems/${prob_id}/`,
			values
		)
		.then(response => {
			callback();
		})
		.catch(err => {
			dispatch(getAxiosCallError(err));
		});
	};
}

export const getProblemTagsData = () => {
	return dispatch => {
		dispatch(getAxiosCallRequest());
		let ep = get_service_endpoint("copdg");
		axios
			.get(`${ep}/api/tags/`)
			.then((response) => {
				dispatch(getProblemTagsDataSuccess({ tags: response.data }));
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
	};
};