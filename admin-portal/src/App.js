import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { message, notification } from "antd";
import "./App.scss";
import MainComponent from "./containers/MainComponent/MainComponent";
import { BrowserRouter } from "react-router-dom";
import Spinner from "./components/UI/Spinner/Spinner";
import "../node_modules/antd/dist/antd.css?raw";
import "./App.scss";

class App extends Component {
	componentDidUpdate(prevProps) {
		if (this.props.successMessage && this.props.successMessage !== prevProps.successMessage) {
			notification["success"]({
				message: this.props.successMessage
			});
		}
		if (this.props.error && this.props.error !== prevProps.error) {
			if (this.props.status === 403) {
				window.location.href = "/login/";
				window.localStorage.clear();
			} else {
				let messageDict = null;
				try {
					messageDict = JSON.parse(this.props.error_message);
				} catch (e) {
					messageDict = null;
				}
				messageDict
					? Object.keys(messageDict).map(key => message.error(`${key} : ${messageDict[key]}`))
					: message.error("Something Wrong in Server");
			}
		}
	}
	render() {
		let spinner = null;

		if (this.props.loading || this.props.loadingRequestCount > 0) {
			spinner = <Spinner />;
		}
		return (
			<div styleName="app">
				<BrowserRouter>
					<div>
						<MainComponent />
						{spinner}
					</div>
				</BrowserRouter>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		loading: state.global.loading,
		loadingRequestCount: state.global.loadingRequestCount,
		error: state.global.error,
		error_message: state.global.errorMessage,
		successMessage: state.global.successMessage,
		status: state.global.statusCode
	};
};

App.propTypes = {
	loading: PropTypes.bool,
	error: PropTypes.bool,
	error_message: PropTypes.string,
	loadingRequestCount: PropTypes.number,
	status: PropTypes.number,
	successMessage: PropTypes.string
};

/*export default withRouter(connect(mapStateToProps)(App));*/

export default connect(mapStateToProps)(App);
