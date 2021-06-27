import { createAction } from "redux-action";
import axios from "axios";
import { get_service_endpoint } from "../../ServiceEndpoints.js";
import { AxiosCallError, requestApi } from "./commonActions";
import { onLoadModal } from "./commonActions";
import { flash } from "./NotificationActions";

let ep = get_service_endpoint("cs-auth");
let catalog_ep = get_service_endpoint("cs-course-catalog");
//let ep = "http://127.0.0.1:8000";

export const loginSuccess = createAction("LOGIN_SUCCESS");

export const signUpSuccess = createAction("SIGNUP_SUCCESS");

export const getUserInfoSuccess = createAction("GET_USER_INFO_SUCCESS");

export const getMatchingCitiesSuccess = createAction("GET_MATCHING_CITIES");

export const getAllStatesSuccess = createAction("GET_ALL_STATES");

export const FilterLocationsSuccess = createAction("FILTER_LOCATIONS");

export const getUserInfoRequest = () => {
	let axiosConfig = {
		headers: {
			"X-Access-Token": localStorage.getItem("access-token"),
			"X-Refresh-Token": localStorage.getItem("refresh-token")
		}
	};
	return dispatch => {
		axios.get(
			`${ep}/api/self/`, axiosConfig
		).then(response => {
			if (response.success) {
				dispatch(getUserInfoSuccess(response.data));
			}
			dispatch(requestApi(false));
		}).catch(error => {
			dispatch(AxiosCallError(error));
		});
	};
};

export const loginRequest = payload => {
	return dispatch => {
		dispatch(requestApi(true));
		axios.post(
			`${ep}/api/login/`, 
			{
				email: payload.emailId,
				password: payload.password
			}
		).then(response => {
			if (response.success) {
				localStorage.setItem("access-token", response.data["access_token"]);
				localStorage.setItem("refresh-token", response.data["refresh_token"]);
				axios.defaults.headers.common["X-Access-Token"] = response.data["access_token"];
				axios.defaults.headers.common["X-Refresh-Token"] = response.data["refresh_token"];
				dispatch(loginSuccess(response.data));
				dispatch(onLoadModal({ modalType: "", modalContent: "", showModal: false }));
				if (payload.callback) payload.callback();
			} else {
				dispatch(flash(
					{ message: "Invalid Username/Password", type: "failure" },
					2500
				));
			}
			dispatch(requestApi(false));
		}).catch(error => {
			dispatch(AxiosCallError(error));
		});
	};
};

export const loginUsingFacebook = payload => {
	return dispatch => {
		dispatch(requestApi(true));
		axios.post(`${ep}/api/social_login/`, payload)
		.then(response => {
			if (response.success) {
				localStorage.setItem("access-token", response.data["access_token"]);
				localStorage.setItem("refresh-token", response.data["refresh_token"]);
				axios.defaults.headers.common["X-Access-Token"] = response.data["access_token"];
				axios.defaults.headers.common["X-Refresh-Token"] = response.data["refresh_token"];
				dispatch(loginSuccess(response.data));
				dispatch(onLoadModal({ modalType: "", modalContent: "", showModal: false }));
				if (payload.callback) payload.callback();
			}
			dispatch(requestApi(false));
		}).catch(err => {
			dispatch(AxiosCallError(err));
		});
	};
};

export const loginUsingGoogle = payload => {
	return dispatch => {
		dispatch(requestApi(true));
		axios.post(`${ep}/api/social_login/`, payload)
		.then(response => {
			if (response.success) {
				localStorage.setItem("access-token", response.data["access_token"]);
				localStorage.setItem("refresh-token", response.data["refresh_token"]);
				axios.defaults.headers.common["X-Access-Token"] = response.data["access_token"];
				axios.defaults.headers.common["X-Refresh-Token"] = response.data["refresh_token"];
				dispatch(loginSuccess(response.data));
				dispatch(onLoadModal({ modalType: "", modalContent: "", showModal: false }));
				if (payload.callback) payload.callback();
			}
			dispatch(requestApi(false));
		}).catch(err => {
			dispatch(AxiosCallError(err));
		});
	};
};

export const getMatchingCities = search_keyword => {
	return dispatch => {
		axios.get(
			`${catalog_ep}/api/catalogs/search_nodes/?node_type=2&search_query=${search_keyword}`
		).then(response => {
			dispatch(getMatchingCitiesSuccess({ response: response.data }));
		});
	};
};

export const getAllStates = () => {
	return dispatch => {
		axios.get(`${catalog_ep}/api/catalogs/`)
		.then(response => {
			response.data.forEach(data => {
				if (data.name.toString() === "Region Catalog") {
					axios.get(
						`${catalog_ep}/api/catalogs/${data.id}/nodes/?inc_child_node=NO`
					).then(response => {
						dispatch(getAllStatesSuccess({
							states: response.data
						}));
					}).catch(err => {
						dispatch(AxiosCallError(err));
					});
				}
			});
		}).catch(err => {
			dispatch(AxiosCallError(err));
		});
	};
};

export const FilterLocation = search_keyword => {
	return dispatch => {
		axios.get(`${catalog_ep}/api/location_suggest/?city_prefix=${search_keyword}`)
		.then(response => {
			dispatch(FilterLocationsSuccess({ locations: response.data }));
		});
	};
};

export const signupRequest = payload => {
	return dispatch => {
		axios.post(`${ep}/api/signup/`, payload).then(response => {
			if (response.success) {
				dispatch(
					onLoadModal({ modalType: "", modalContent: "", showModal: false })
				);
				dispatch(flash(
					{
						message:
							"Account created. Please check your email to activate your account",
						type: "success"
					},
					2500
				));
				dispatch(signUpSuccess());
			} else {
				let message = "";
				Object.keys(response.data).forEach(key => {
					message = response.data[key][0];
				});

				dispatch(flash({ message: message, type: "failure" }, 2500));
			}
		});
	};
};

export const SetPassword = (activation_key, payload) => {
	return dispatch => {
		axios
			.patch(`${ep}/api/activate/${activation_key}/`, payload)
			.then(response => {
				if (response.success) {
					window.location.href = "/home";
					dispatch(flash(
						{ message: "Password set successfully", type: "success" },
						2500
					));
				} else {
					dispatch(flash(
						{ message: "Problems setting password", type: "failure" },
						2500
					));
				}
			});
	};
};

export const resetPassword = payload => {
	return dispatch => {
		axios
			.post(`${ep}/api/password_reset/forgot_password/`, payload)
			.then(response => {
				if (response.success) {
					dispatch(flash(
						{
							message: "Reset password link sent to your email",
							type: "success"
						},
						2500
					));
					dispatch(
						onLoadModal({ modalType: "", modalContent: "", showModal: false })
					);
				} else {
					dispatch(flash(
						{
							message: "Email provied is not registered with College Connect",
							type: "failure"
						},
						2500
					));
				}
			});
	};
};

export const changePassword = payload => {
	return dispatch => {
		axios.post(`${ep}/api/password_reset/change_password/`, payload)
		.then(response => {
			if (response.success) {
				dispatch(flash(
					{
						title: "Password changed successfully",
						type: "success"
					},
					2500
				));
			} else {
				dispatch(flash(
					{
						title: "Problem while changing password.",
						type: "failure"
					},
					2500
				));
			}
		});
	};
};

export const logoutRequest = () => dispatch => {
	localStorage.clear();
	delete axios.defaults.headers.common["X-Access-Token"];
	delete axios.defaults.headers.common["X-Refresh-Token"];
};
