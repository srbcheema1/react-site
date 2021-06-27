import React, { Component } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import "./Footer.scss";

class Footer extends Component {
	searchResult = degree => {
		if (degree.payload) {
			this.props.setPayloads(degree.payload);
		}
		if (degree.search_url) {
			window.scrollTo(0, 0);
			return setTimeout(() => {
				this.props.history.push(degree.search_url);
			}, 5);
		}
	};
	render() {
		return (
			<div styleName="c-footer">
				<div styleName="c-footer__terms">
					<p>
						Copyright © 2019 CodeHall Technology Pvt Ltd. All rights reserved.
					</p>
				</div>
			</div>
		);
	}
}

Footer.propTypes = {
	configurations: PropTypes.array,
	history: PropTypes.object,
	setPayloads: PropTypes.func,
	innerWidth: PropTypes.number,
};

export default withRouter(Footer);