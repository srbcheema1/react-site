import React from "react";
import "./Backdrop.scss";
import PropTypes from "prop-types";

const backdrop = props => {
    return props.show ? (
        <div styleName="backdrop" onClick={props.onClick} />
    ) : null;
};

backdrop.propTypes = {
    show: PropTypes.bool,
    onClick: PropTypes.func
};

export default backdrop;
