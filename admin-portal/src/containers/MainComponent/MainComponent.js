import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Layout } from "antd";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CreateTest from "../../containers/Test/CreateTest";
import TestsView from "../../containers/Test/TestsView";

import TestView from "../../containers/TestView/TestView";
import WrappedLoginForm from "../../containers/Login/Login";

import LeftPane from "../../components/Admin/leftPane/leftPane";
import AdminFooter from "../../components/Admin/AdminFooter/AdminFooter";
import AdminHeader from "../../components/Admin/AdminHeader/AdminHeader";

import Questions from "../../containers/Questions/Questions";


import * as actions from '../../store/actions';

import logo from "../../assets/images/codehall-logo-light.png";

import "./MainComponent.scss";


const { Header, Content, Footer, Sider } = Layout;

class MainComponent extends Component {
	state = {
		token: window.localStorage.getItem("access-token")
	};

	componentWillMount() {
		if (this.isLoggedIn()) {
			this.props.getTestsData();
			this.props.getEmailTemplates();
		}
	}

	isLoggedIn() {
		return window.localStorage.getItem("access-token") !== null;
	}

	render() {
		if (this.isLoggedIn()) {
			return this.renderWhenLoggedIn();
		}
		return this.renderWhenLoggedOut();
	}

	renderWhenLoggedIn() {
		return (
			<React.Fragment>
				<Layout>
					<Sider>
						<LeftPane />
					</Sider>
					<Layout styleName="adminPannel">
						<Header>
							<AdminHeader/>
						</Header>
						<Content>
							<Switch>
								<Redirect exact from="/" to="/admin/" />
								<Redirect exact from="/login/" to="/admin/" />
								<Redirect exact from="/admin/" to="/admin/tests/" />

								<Route path="/admin/tests/" exact component={TestsView} />
								<Route path="/admin/create/" exact component={CreateTest} />

								<Route path="/admin/create-question/" exact component={Questions} />
								<Route path="/admin/create-question/:prob_id/" exact component={Questions} />
								<Route path="/admin/draft-questions/" exact component={Questions} />
								<Route path="/admin/my-questions/" exact component={Questions} />
								
								<Route
									path="/admin/test/:test_id/"
									exact
									component={TestView}
								/>
								<Route
									path="/admin/test/:test_id/assessment/:assessment_id/"
									exact
									component={TestView}
								/>
							</Switch>
						</Content>
						<Footer style={{padding:'0px'}}>
							<AdminFooter />
						</Footer>
					</Layout>
				</Layout>
			</React.Fragment>
		);
	}

	renderWhenLoggedOut() {
		return (
			<Layout styleName="login">
				<Content styleName="login__content">
					<div styleName="login__form">
						<div styleName="login__logo">
							<img src={logo} alt="logo" style={{width:'100%'}} />
						</div>
						<WrappedLoginForm />
					</div>
				</Content>
				<Footer style={{padding:'0px'}}>
					<AdminFooter />
				</Footer>
			</Layout>
		);
	}
}

const mapStateToProps = state => {
	return {
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getTestsData: () => dispatch(actions.getTestsData()),
		getEmailTemplates: () => dispatch (actions.getEmailTemplates()),
	};
};

MainComponent.propTypes = {
	getTestsData: PropTypes.func,
	getEmailTemplates: PropTypes.func,
};

export default connect( mapStateToProps, mapDispatchToProps )( MainComponent );
