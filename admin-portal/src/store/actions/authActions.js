import axios from "axios";
import { get_service_endpoint } from "../../ServiceEndpoints.js";
import { getAxiosCallError, getAxiosCallRequest, getAxiosCallSuccess } from "./commonActions.js";

export const fetchUsers = async users_array => {
	let ep = get_service_endpoint("cs-auth");
	let url = `${ep}/api/fetch_users/`
	const response = await axios
		.post(url, users_array);
	return response.data;
}

export const loginHandler = values => {
	return dispatch => {
		dispatch(getAxiosCallRequest());
		let ep = get_service_endpoint("cs-auth");
		axios
		.post(`${ep}/api/login/`, {
			password: values.password,
			email: values.email,
			admin_login: true
		})
		.then(response => {
			window.localStorage.setItem("access-token", response.data["access_token"]);
			window.localStorage.setItem("refresh-token", response.data["refresh_token"]);
			window.localStorage.setItem("username", response.data["username"]);
			window.localStorage.setItem("user_role", response.data["user_role"]);
			window.localStorage.setItem("user_id", response.data["user_id"]);

			axios.defaults.headers.common["X-Access-Token"] = response.data["access_token"];
			axios.defaults.headers.common["X-Refresh-Token"] = response.data["refresh_token"];

			window.location.href = "/admin/";
			dispatch(getAxiosCallSuccess());
		})
		.catch(err => {
			dispatch(getAxiosCallError(err));
		});
	};
};
