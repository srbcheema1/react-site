// import ReactDOM from "react-dom";
// import React from "react";

// import AuthContainer from "./containers/AuthContainer/AuthContainer";
import validator from "validator";
import PropTypes from "prop-types";
import moment from "moment";

export const mobMaxWidth = 576;
export const tabMaxWidth = 992;

export const isMobile = innerWidth => {
	if (innerWidth <= mobMaxWidth) {
		return true;
	} else return false;
};

export const isTablet = innerWidth => {
	if (innerWidth > mobMaxWidth && innerWidth <= tabMaxWidth) {
		return true;
	} else return false;
};

export const isDesktop = innerWidth => {
	if (innerWidth > tabMaxWidth) {
		return true;
	} else return false;
};

export const notIn = (element, array) => {
	let flag = true;
	array.forEach(elem => {
		if (elem === element) {
			flag = false;
		}
	});
	return flag;
};
export const onKeyPressEscExit = (event, Callback) => {
	if (event.keycode === 27 || event.which === 27) {
		Callback();
	}
};

export const isLoggedIn = user_id => {
	if (user_id === "") {
		return false;
	} else return true;
};

let AuthObj = null;

export const assignAuthObj = elem => {
	AuthObj = elem;
};

export const authenticate = (callback, fallback) => {
	if (
		localStorage.getItem("access-token") &&
		localStorage.getItem("refresh-token")
	) {
		callback();
	} else {
		if (!fallback) {
			if (AuthObj)
				AuthObj._reactInternalFiber.child.stateNode.onLoadLoginModal(callback);
		} else {
			fallback();
		}
	}
};

// export const authenticate = function (_this) {
// 	if (
// 		!localStorage.getItem("access-token") &&
// 		!localStorage.getItem("refresh-token")
// 	) {
// 		_this.return
// 	}
// }

/*export const required = value => {
	if (!value.toString().trim().length) {
		// We can return string or jsx as the 'error' prop for the validated Component
		return <span style={style}>*This is a require field</span>;
	}
};*/

export const required = (value, props) => {
	if (!value || (props && (props.isCheckable && !props.checked))) {
		return "Required";
	}
};
required.propTypes = {
	isCheckable: PropTypes.bool,
	checked: PropTypes.bool
};
export const number = value => {
	if (!Number(value)) {
		return "Provide a valid number";
	}
};
export const integer = value => {
	if (!parseInt(value, 10)) {
		return "Provide a valid number";
	}
};

export const maxLength = (value, maxLength) => {
	if (value.length > maxLength) {
		return `Can't have more than ${maxLength} characters`;
	}
};

export const minLength = (value, minLength) => {
	if (value.length < minLength) {
		return `Must have atleast ${minLength} characters`;
	}
};

export const exactLength = (value, length) => {
	if (value.length !== length) {
		return `Must have ${length} characters only`;
	}
};

export const email = value => {
	if (!validator.isEmail(value)) {
		return "This is not a valid email";
	}
};

export const validAge = value => {
	if (parseInt(value) < 6 || parseInt(value) > 100) {
		return "Provide a valid age";
	}
};
export const passingYear = value => {
	if (
		moment(new Date()).format("YYYY") < value ||
		moment(new Date()).format("YYYY") - 100 > value
	) {
		return "Provide a valid Passing Year";
	}
};

export const CGPA = value => {
	if (value < 0 || value > 10) {
		return "Provide a valid CGPA";
	}
};

export const percent = value => {
	if (value < 0 || value > 100) {
		return "Provide a valid Percent";
	}
};
