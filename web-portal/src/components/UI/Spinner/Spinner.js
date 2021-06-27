import React from "react";
import BackDrop from "../Backdrop/Backdrop";
import "./Spinner.scss";

const Spinner = () => (
  <div>
    <BackDrop show={true} />
    <div styleName="lds-spinner">
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default Spinner;
