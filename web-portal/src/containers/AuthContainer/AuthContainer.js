import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import * as actions from "../../store/actions";
import { isDesktop } from "../../helperFunctions";

import Login from "../../components/AuthComponents/Login/Login";
// import Signup from "../../components/AuthComponents/Signup/Signup";
// import ResetPassword from "../../components/AuthComponents/ResetPassword/ResetPassword";

import "./AuthContainer.scss";

class AuthContainer extends Component {
  state = {
    showResetPassword: false,
    formMode: "LOGIN"
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      (prevProps.showAuthModal !== this.props.showAuthModal ||
        prevProps.states !== this.props.states ||
        prevProps.filteredStates !== this.props.filteredStates ||
        prevProps.innerWidth !== this.props.innerWidth ||
        prevProps.filteredLocations !== this.props.filteredLocations ||
        prevState.showResetPassword !== this.state.showResetPassword) &&
      this.props.showAuthModal
    ) {
      switch (this.props.showAuthModal) {
        case "login":
          this.onLoadLoginModal();
          break;
        case "signup":
          this.onLoadSignupModal();
          break;
        case "resetPassword":
          this.onLoadResetPasswordModal();
          break;
        case "newPassword":
          this.onLoadNewPasswordModal();
          break;
      }
    }
    if (!prevProps.showAuthModal && this.props.showAuthModal) {
      this.setState({ showResetPassword: false });
    }
    if (prevState.formMode !== this.state.formMode) {
      this.forceUpdate();
      this.onLoadLoginModal(this.updateModalCallback);
    }
  }

  ShowAuthForm = formType => {
    this.setState({ formMode: formType });
  };

  onCloseModal = () => {
    this.props.onToggleAuthModal("");
    this.props.onLoadModal({
      showModal: false,
      modalType: "",
      modalContent: null
    });
  };

  renderAuthContent = callback => {
    switch (this.state.formMode) {
      case "RESET_PASSWORD":
        return (
          <ResetPassword
            ShowLogin={() => this.ShowAuthForm("LOGIN")}
            ShowSignUp={() => this.ShowAuthForm("SIGN_UP")}
            resetPassword={payload => this.props.resetPassword(payload)}
          />
        );
      case "LOGIN":
        return (
          <Login
            onTriggerModalHandler={this.onCloseModal}
            loginUsingFacebook={this.props.loginUsingFacebook}
            loginUsingGoogle={this.props.loginUsingGoogle}
            innerWidth={this.props.innerWidth}
            onLoginRequest={this.props.onLoginRequest}
            ShowResetPassword={() => this.ShowAuthForm("RESET_PASSWORD")}
            ShowSignUp={() => this.ShowAuthForm("SIGN_UP")}
            callback={callback}
          />
        );
      case "SIGN_UP":
        return (
          <Signup
            ShowLogin={() => this.ShowAuthForm("LOGIN")}
            ShowResetPassword={() => this.ShowAuthForm("RESET_PASSWORD")}
            getMatchingCities={search_keyword =>
              this.props.getMatchingCities(search_keyword)
            }
            getAllStates={() => this.props.getAllStates()}
            FilterLocation={keywords => this.props.FilterLocation(keywords)}
            states={this.props.states}
            filteredLocations={this.props.filteredLocations}
            signUp={payload => this.props.signup(payload)}
          />
        );
    }
  };

  onLoadLoginModal = callback => {
    this.updateModalCallback = callback;
    if (isDesktop(innerWidth)) {
      this.props.onLoadModal({
        showModal: true,
        modalType: "LoginModal",
        modalContent: (
          <div styleName="auth-modal" className="auth-modal">
            {this.renderAuthContent(callback)}
          </div>
        )
      });
    } else {
      this.props.onLoadModal({
        showModal: true,
        modalType: "LoginModal",
        modalContent: (
          <div styleName="auth-modal" className="auth-modal">
            {this.renderAuthContent(callback)}
          </div>
        )
      });
    }
  };
  onLoadSignupModal = () => {};
  onLoadResetPasswordModal = () => {};
  onLoadNewPasswordModal = () => {};
  render() {
    return <div style={{ display: "none" }} />;
  }
}

AuthContainer.propTypes = {
  showAuthModal: PropTypes.string,
  innerWidth: PropTypes.number,
  loginUsingFacebook: PropTypes.func,
  loginUsingGoogle: PropTypes.func,
  onToggleAuthModal: PropTypes.func,
  onLoginRequest: PropTypes.func,
  onLoadModal: PropTypes.func,
  getMatchingCities: PropTypes.func,
  getAllStates: PropTypes.func,
  states: PropTypes.array,
  FilterLocation: PropTypes.func,
  filteredStates: PropTypes.array,
  filteredLocations: PropTypes.array,
  signup: PropTypes.func,
  resetPassword: PropTypes.func
};

const mapStateToProps = state => {
  return {
    showAuthModal: state.global.showAuthModal,
    states: state.auth.states,
    filteredStates: state.auth.filteredStates,
    filteredLocations: state.auth.locations
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadModal: modal => dispatch(actions.onLoadModal(modal)),
    onToggleAuthModal: showAuthModal =>
      dispatch(actions.onToggleAuthModal(showAuthModal)),
    onLoginRequest: payload => dispatch(actions.loginRequest(payload)),
    loginUsingFacebook: payload =>
      dispatch(actions.loginUsingFacebook(payload)),
    loginUsingGoogle: payload => dispatch(actions.loginUsingGoogle(payload)),
    getMatchingCities: search_keyword =>
      dispatch(actions.getMatchingCities(search_keyword)),
    getAllStates: () => dispatch(actions.getAllStates()),
    FilterLocation: (name, keywords) =>
      dispatch(actions.FilterLocation(name, keywords)),
    signup: payload => dispatch(actions.signupRequest(payload)),
    resetPassword: payload => dispatch(actions.resetPassword(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer);
