import React, { Component } from "react";
import Form from "../../UI/FormValidation/components/form";
import Input from "../../UI/FormValidation/components/input";
import { required, email } from "../../../helperFunctions";
import PropTypes from "prop-types";
import "./ResetPassword.scss";

class ResetPassword extends Component {
  state = {
    email: ""
  };
  handleSubmit = event => {
    event.preventDefault();
    this.form.validateAll();
    if (!this.form.hasErrors()) {
      const payload = {
        email: this.state.email
      };
      this.props.resetPassword(payload);
    }
  };
  onChangeHandler = event => {
    this.setState({ email: event.target.value });
  };
  render() {
    return (
      <div styleName="reset-password-container">
        <h2 styleName="reset-password-container__reset-password-header">
          Password Reset
        </h2>
        <div styleName="reset">
          <p styleName="help-text">
            Enter your username or email to reset your password. You will
            receive an email with instructions on how to reset your password.
          </p>
          <Form
            ref={c => {
              this.form = c;
            }}
            styleName="reset-form"
            onSubmit={this.handleSubmit.bind(this)}
          >
            <Input
              type="text"
              placeholder="Enter your registered email"
              validations={[required, email]}
              name="fullname"
              onChange={this.onChangeHandler.bind(this)}
            />
            <button
              className="btn-normal btn-orange"
              styleName="send-reset-link"
              type="submit"
            >
              Send Reset Link
            </button>

            <span onClick={this.props.ShowLogin}>
              Remember the password? Sign In.
            </span>
            <span onClick={this.props.ShowSignUp}>
              Already a user? Sign Up.
            </span>
          </Form>
        </div>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  ShowLogin: PropTypes.func,
  ShowSignUp: PropTypes.func,
  resetPassword: PropTypes.func
};
export default ResetPassword;
