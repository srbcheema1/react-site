import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import ErrorImage from "../../components/ErrorImage/ErrorImage"


class ErrorContainer extends Component {

    render() {
        return (
            <ErrorImage
                errorType={this.props.errorType}
                errorHeading={this.props.errorHeading}
                errorMessage={this.props.errorMessage}
            />
        )
    }

}


const mapStateToProps = state => {
  return {
    errorType:state.global.errorType,
    errorHeading:state.global.errorHeading,
    errorMessage:state.global.errorMessage,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ErrorContainer)
);