import React, { Component } from "react";
import PropTypes from "prop-types";
import { onKeyPressEscExit } from "../../../helperFunctions";

import Backdrop from "../Backdrop/Backdrop";

import "./Modal.scss";

class Modal extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPressEsc);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPressEsc);
  }

  handleKeyPressEsc = event => {
    onKeyPressEscExit(event, this.props.onClickHandler);
  };
  render() {
    return (
      <div
        ref={elem => (this.nv = elem)}
        onKeyPress={event =>
          onKeyPressEscExit(event, this.props.onClickHandler)
        }
      >
        <Backdrop
          show={this.props.showModal}
          onClick={this.props.onClickHandler}
        />
        <div styleName="modal-container" onClick={this.props.onClickHandler}>
          <div
            styleName="modal-default"
            className="modal-default"
            onClick={event => event.stopPropagation()}
          >
            <button
              styleName="modal-default__close-button"
              onClick={this.props.onClickHandler}
            />
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  showModal: PropTypes.bool,
  onClickHandler: PropTypes.func,
  children: PropTypes.object
};

export default Modal;
