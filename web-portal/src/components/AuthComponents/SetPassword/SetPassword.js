import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as actions from "../../../store/actions";
import logo from "../../../assets/images/logo/Logo-02.png";
import "./SetPassword.scss";

class SetPassword extends Component {
    state = {
        password: "",
        confirm_password: "",
        passwords_matched: false,
        error_message: "",
        enter_password_error: "",
        confirm_pasword_error: "",
        password_length_error: ""
    };
    onChangeEnterPassword = e => {
        this.setState({ password: e.target.value });
        if (e.target.value) {
            this.setState({ enter_password_error: "" });
        } else {
            this.setState({
                enter_password_error: "* This is a required field",
                password_length_error: ""
            });
        }
        if (e.target.value.length < 8 && e.target.value !== "") {
            this.setState({
                password_length_error:
                    "* Password must be at least 8 characters long"
            });
        } else {
            this.setState({ password_length_error: "" });
        }
    };
    onChangeConfirmPassword = e => {
        this.setState({ confirm_password: e.target.value });
        if (this.state.password !== e.target.value) {
            this.setState({ error_message: "* Two passwords doesn't match" });
        } else {
            this.setState({ error_message: "", passwords_matched: true });
        }

        if (e.target.value) {
            this.setState({ confirm_pasword_error: "" });
        } else {
            this.setState({
                confirm_pasword_error: "* This is a required field",
                error_message: ""
            });
        }
    };

    SetPassword = () => {
        if (this.state.password === "") {
            this.setState({
                enter_password_error: "* This is a required field"
            });
        }

        if (this.state.confirm_password === "") {
            this.setState({
                confirm_pasword_error: "* This is a required field"
            });
        }

        if (this.state.passwords_matched && this.state.password.length >= 8) {
            const activation_key = this.props.match.params.activation_key;
            const payload = {
                password: this.state.password
            };

            this.props.SetPassword(activation_key, payload);
        }
    };

    render() {
        return (
            <div styleName="set-password-container">
                <div styleName="set-password-header">
                    <img src={logo} alt="logo" />
                </div>
                <div styleName="set-password">
                    {window.location.pathname.includes("/reset_password/") ? (
                        <React.Fragment>
                            <span styleName="set-password__tag">
                                Reset your password
                            </span>
                            <span>
                                You are one step away from reseting your password
                            </span>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <span styleName="set-password__tag">
                                Set your password
                            </span>
                            <span>
                                You are one step away from activating your
                                account
                            </span>
                        </React.Fragment>
                    )}

                    <div styleName="enter-password-and-description">
                        <div styleName="enter-and-conform-password">
                            <span>Enter Password</span>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                onChange={this.onChangeEnterPassword.bind(this)}
                            />
                            {this.state.enter_password_error ? (
                                <span styleName="error-message">
                                    {this.state.enter_password_error}
                                </span>
                            ) : null}
                            {this.state.password_length_error ? (
                                <span styleName="error-message">
                                    {this.state.password_length_error}
                                </span>
                            ) : null}
                            <span styleName="enter-and-conform-password__confirm">
                                Confirm Password
                            </span>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                onChange={this.onChangeConfirmPassword.bind(
                                    this
                                )}
                            />
                            {this.state.error_message ? (
                                <span styleName="error-message">
                                    {this.state.error_message}
                                </span>
                            ) : null}
                            {this.state.confirm_pasword_error ? (
                                <span styleName="error-message">
                                    {this.state.confirm_pasword_error}
                                </span>
                            ) : null}
                        </div>
                        <p>
                            Passwords must have a good and strong rating.
                            Passwords must be at least 8 characters long. Good
                            Passwords contain either a combination of uppercase
                            letters or a combination of letters and one digit.
                            Strong passwords contain either a combination pf
                            letters and more then one digit or special
                            characters.
                        </p>
                    </div>
                    <button styleName="confirm-btn" onClick={this.SetPassword}>
                        Confirm
                    </button>
                </div>
            </div>
        );
    }
}

SetPassword.propTypes = {
    SetPassword: PropTypes.func,
    match: PropTypes.object
};
const mapDispatchToProps = dispatch => {
    return {
        SetPassword: (activation_key, payload) =>
            dispatch(actions.SetPassword(activation_key, payload))
    };
};

export default connect(null, mapDispatchToProps)(SetPassword);
