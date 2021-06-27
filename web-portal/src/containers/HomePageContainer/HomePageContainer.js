import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { GoogleLogin } from "react-google-login";
import { isLoggedIn } from "../../helperFunctions";
import { Redirect } from "react-router-dom"

var style = {minHeight: "500px"}
class HomePageContainer extends Component {
	state = {
		news: []
	};

	componentDidMount() {
	}

	handleGoogleResponse = response => {
		const payload = {
			provider: "google",
			code: response.code,
			callback: this.props.callback
		};
		this.props.loginUsingGoogle(payload);
	};

	render() {
		return (
			<div className="home_page_container" style={style}>
			{isLoggedIn(this.props.user_detail.user_id) ?
				<Redirect to="/invite" /> 
				: (
					<GoogleLogin
						clientId="73660977592-m50kcgualicen86vokvsbg3vsh8h6c2e.apps.googleusercontent.com"
						buttonText="Sign in with Google"
						responseType="code"
						onSuccess={response => this.handleGoogleResponse(response)}
						onFailure={response => this.handleGoogleResponse(response)}
					/>
				)
			}
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		loginUsingGoogle: payload => dispatch(actions.loginUsingGoogle(payload))
	};
};

const mapStateToProps = state => {
	return {
		user_detail: state.auth,
	};
};

HomePageContainer.propTypes = {
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomePageContainer);
