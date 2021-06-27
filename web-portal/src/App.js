import React, { Component } from "react";
import * as actions from "./store/actions";
import { Router } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import './assets/css/antd.css';
import "./assets/scss/global.scss?raw";
import "./assets/scss/layout.scss?raw";
import "./App.scss";

import MainContainer from "./containers/MainContainer/MainContainer";
import Spinner from "./components/UI/Spinner/Spinner";
import ErrorHandler from "./HOC/ErrorHandler";
import { Modal } from 'antd'

// import "./assets/css/datepickerCustom.css?raw";


class App extends Component {

	componentWillMount() {
		if (
			localStorage.getItem("access-token") &&
			localStorage.getItem("refresh-token")
		) {
			this.props.onGetUserInfo();
		}
	}

	render() {
		let spinner = null;
		if (this.props.loading) {
			spinner = <Spinner />;
		}

		// https://stackoverflow.com/questions/44095744/react-router-4-history-listen-never-fires
		return (
			<div styleName="app">
				<Router history={this.props.history}>
					<ErrorHandler>
						<MainContainer />
						<Modal
							title={this.props.modal.title}
							visible={this.props.modal.visible}
						>
						{this.props.modal.content}
						</Modal>
						{spinner}
					</ErrorHandler>
				</Router>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		loading: state.global.loading,
		error: state.global.error,
		error_message: state.global.errorMessage,
		status: state.global.statusCode,
		modal: state.global.modal
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onGetUserInfo: () => dispatch(actions.getUserInfoRequest()),
		// hideModal: () => dispatch(actions.hideModal())
	};
};

App.propTypes = {
	loading: PropTypes.bool,
	error: PropTypes.bool,
	error_message: PropTypes.string,
	status: PropTypes.number,
	onGetUserInfo: PropTypes.func,
	history: PropTypes.object
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);

