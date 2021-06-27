import React, { Component } from "react";
import "./Wrapper.scss"

class Wrapper extends Component {

  render() {
    return (
      <div styleName="l-wrapper">
        <div styleName="c-container">
        {this.props.children}
        </div>
      </div>
    )
  }
}

export default Wrapper;