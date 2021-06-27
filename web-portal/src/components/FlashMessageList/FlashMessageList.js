import React, { Component } from "react";
import FlashMessage from "./../UI/FlashMessage/FlashMessage";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import "./FlashMessageList.scss";
class FlashMessageList extends Component {
  render() {
    return (
      <div className="flash-message-list__container">
        {this.props.MessageContent.map((flash, index) => (
          <FlashMessage
            key={index}
            title={flash.title}
            message={flash.message}
            type={flash.type}
          />
        ))}
      </div>
    );
  }
}

FlashMessageList.propTypes = {
  MessageContent: PropTypes.array
};

const mapStateToProps = state => {
  return {
    MessageContent: state.global.MessageContent
  };
};

export default connect(
  mapStateToProps,
  null
)(FlashMessageList);
