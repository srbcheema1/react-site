import React, { Component } from "react";
import PropTypes from "prop-types";
import { GoogleLogin } from "react-google-login";
// import FacebookLogin from "react-facebook-login";
// import Form from "../../UI/FormValidation/components/form";
// import Input from "../../UI/FormValidation/components/input";
// import { required, email } from "../../../helperFunctions";

import "./Login.scss";

class Login extends Component {
  state = {
    emailId: "",
    password: "",
    errorMessage: ""
  };
  onChangeHandler = (event, name) => {
    let stateElement = {};
    stateElement[name] = event.target.value;
    stateElement["errorMessage"] = "";
    this.setState(stateElement);
  };
  handleSubmit = event => {
    event.preventDefault();
    this.form.validateAll();
    if (!this.form.hasErrors()) {
      this.props.onLoginRequest({
        emailId: this.state.emailId,
        password: this.state.password,
        callback: this.props.callback
      });
    }
  };
  handleGoogleResponse = response => {
    const payload = {
      provider: "google",
      code: response.code,
      callback: this.props.callback
    };
    this.props.loginUsingGoogle(payload);
  };

  handleFacebookResponse = response => {
    const payload = {
      provider: "facebook",
      code: response.accessToken,
      callback: this.props.callback
    };
    this.props.loginUsingFacebook(payload);
  };
  render() {
    return (
      <div styleName="login-container" className="login-container" >
        <h2 className="sub-header-font-size-mid">Sign in using Google</h2>
        <div>{this.state.errorMessage}</div>
        <div styleName="o-auth-group">
          <GoogleLogin
            styleName="loginbtn loginbtn-google"
            clientId="783759025902-s6fl4j3ntpnaa4urs3tptkcdvg31tu5b.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            responseType="code"
            onSuccess={response => this.handleGoogleResponse(response)}
            onFailure={response => this.handleGoogleResponse(response)}
          />
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  innerWidth: PropTypes.number,
  loginUsingFacebook: PropTypes.func,
  loginUsingGoogle: PropTypes.func,
  onLoginRequest: PropTypes.func,
  callback: PropTypes.func,
  ShowSignUp: PropTypes.func,
  ShowResetPassword: PropTypes.func
};

export default Login;
