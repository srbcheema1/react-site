import React from "react";
import PropTypes from "prop-types";
import "./FlashMessage.scss";
import SuccessImage from "../../../assets/images/FlashMessages/checked.svg";
import ErrorImage from "../../../assets/images/FlashMessages/error.svg";

const FlashMessage = props => {
  return (
    <React.Fragment>
      <div className="flash-message__container">
        <img
          className="flash-message__icon"
          alt={props.type === "success" ? "SuccessImage" : "ErrorImage"}
          src={props.type === "success" ? SuccessImage : ErrorImage}
        />
        <div className="flash-message__message">{props.message}</div>
      </div>
    </React.Fragment>
  );
};

FlashMessage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  type: PropTypes.string
};
export default FlashMessage;
