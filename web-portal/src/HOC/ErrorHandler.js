import React, { Component } from "react";
import PropTypes from "prop-types";
import ErrorImage from "../components/ErrorImage/ErrorImage";

class ErrorHandler extends Component {
  state = {
    hasError: false
  };
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    window.console.error("ERROR:", error + "\nInfo:", info);
    if (this.props.errorHandler) {
      this.props.errorHandler(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorImage errorType="Javascript" errorHeading="Javascript error" errorMessage="An error occured" />;
    }
    return this.props.children;
  }
}

ErrorHandler.propTypes = {
  children: PropTypes.array,
  errorHandler: PropTypes.func
};

export default ErrorHandler;
