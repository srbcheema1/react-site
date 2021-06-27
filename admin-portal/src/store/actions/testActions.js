import axios from "axios";
import { createAction } from "redux-actions";

import { get_service_endpoint } from "../../ServiceEndpoints.js";
import { getAxiosCallError, getAxiosCallRequest, getAxiosCallSuccess } from "./commonActions.js";
import { fetchUsers } from "./authActions";


export const getTestsDataSuccess = createAction("GET_TESTS_DATA_SUCCESS");
export const setTestCreator = createAction("SET_TEST_CREATOR")
export const setTestSummary = createAction("SET_TEST_SUMMARY")

export const setCurrTest = createAction("SET_CURR_TEST")
export const resetCurrTest = createAction("RESET_CURR_TEST")

export const createTestSuccess = createAction("CREATE_TEST_SUCCESS")


export const getTestsData = () => {
	return dispatch => {
		dispatch(getAxiosCallRequest());
		let ep = get_service_endpoint("copdg");
		let url = `${ep}/api/tests/`
		axios
			.get(url)
			.then(response => {
				dispatch(getTestsDataSuccess({ tests: response.data }));
				let user_ids = response.data.map(test=>test.creator_id)
				let unique_user_ids =  [...new Set(user_ids)]; 
				fetchUsers(unique_user_ids)
					.then(users=> {
						let users_map = {}
						users.forEach(user=>{
							users_map[user.id] = user.full_name
						})
						dispatch(setTestCreator({users:users_map}));
					})
					.catch(err => {
						dispatch(getAxiosCallError(err));
					});
				response.data.forEach(test => {
					dispatch(fetchTestStats(test));
				})
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
	};
};

export const fetchTest = test_id => {
	return dispatch => {
		dispatch(getAxiosCallRequest());
		let ep = get_service_endpoint("copdg");
		let url = `${ep}/api/tests/${test_id}/`
		axios
			.get(url)
			.then(response => {
				dispatch(setCurrTest({test:response.data}))
				dispatch(getAxiosCallSuccess())
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
	};
}


const fetchTestStats = test => {
	return dispatch => {
		let ep = get_service_endpoint("assessment");
		let url = `${ep}/api/tests/${test.id}/stats_summary/`
		axios
		.get(url)
		.then(response => {
			dispatch(setTestSummary({ id:test.id,summary:response.data }));
		})
		.catch(err => {
			dispatch(getAxiosCallError(err));
		});
	};
}

export const createTest = data => {
	return dispatch => {
		dispatch(getAxiosCallRequest());
		let ep = get_service_endpoint("copdg");
		axios
			.post(`${ep}/api/tests/`, data)
			.then((response) => {
				dispatch(createTestSuccess({ test: response.data }));
				dispatch(getAxiosCallSuccess({
					successMessage: "Test Created successfully"
				}));
			})
			.catch(err => {
				dispatch(getAxiosCallError(err));
			});
	};
};
