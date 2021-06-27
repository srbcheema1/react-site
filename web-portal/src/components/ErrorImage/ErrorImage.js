import React, { Component } from "react";
import error from "../../assets/images/Error-image.png";
import PropTypes from "prop-types";
import "./ErrorImage.scss"
import { Alert } from 'antd'


class ErrorImage extends Component {
	render(){
		return(
			<div styleName="container">
				{this.props.errorMessage && (
					<div styleName="container__message">
						<Alert
							message={this.props.errorHeading}
							description={this.props.errorMessage}
							type="error"
							showIcon
						/>
					</div>
				)}
				<img src={error} alt="error" styleName="container__image"/>
			</div>
		)
	}
}


ErrorImage.propTypes = {
	errorHeading: PropTypes.string,
	errorMessage: PropTypes.string,
	errorType: PropTypes.string,
};


export default ErrorImage;