import React, { Component } from "react";
import "./Header.scss"
import logo from "../../assets/images/codehall-logo-dark.png";
import { isLoggedIn } from "../../helperFunctions";
import { Progress, Button, Icon } from 'antd';
import Timer from 'react-compound-timer'


class Header extends Component {
	state = {
		showDrawer: false,
		search_keyword: "",
		suggestions: [],
		show_profile_and_login_option: false,
		show_profile_sidebar: false
	};

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.autocomplete !== this.props.autocomplete) {
			this.setState({
				suggestions: nextProps.autocomplete
			});
		}
	}

	drawerToggleHandler = () => {
		this.setState({ showDrawer: !this.state.showDrawer });
		if (isLoggedIn(this.props.user_detail.user_id)) {
			this.setState({ show_profile_sidebar: true });
		}
	};

	goToHomePage = () => {
		this.setState({ showDrawer: false });
		this.props.history.push("/home");
	};

	logoutHandler = () => {
		if (window.location.pathname.includes("/profile/")) {
			window.location.href = "/home";
		} else {
			window.location.reload();
		}

		this.props.logoutRequest();
		this.setState({ show_profile_and_login_option: false });
	};

	loginHandler = () => {
		this.setState({ showDrawer: !this.state.showDrawer });
		this.props.onToggleAuthModal("login");
	};
	hideHamburgerMenue = () => {
		this.setState({ showDrawer: false });
	};

	checkloggedin = () => {};

	showUserProfileAndLogoutOption = () => {
		this.setState({
			show_profile_and_login_option: !this.state.show_profile_and_login_option
		});
	};
	
	render() {
		let timer = null
		if (isNaN(this.props.remainingTime)) {
			timer = (<span></span>)
		} else if(this.props.remainingTime < 0) {
			timer = (<span>Expired</span>)
		} else {
			timer = (
				<Timer
					initialTime={this.props.remainingTime}
					direction="backward"
					formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}
					checkpoints = {[
						{
							time: 0*60*1000,
							callback: () => this.props.submitTest(this.props.assessmentId, true),
						},
						{
							time: 5*60*1000,
							callback: () => this.props.setTimerExpLevel("red")
						},
						{
							time: 10*60*1000,
							callback: () => this.props.setTimerExpLevel("yellow")
						}
					]}
				>
				{() => (
					<React.Fragment>
						<Timer.Hours /> : <Timer.Minutes /> : <Timer.Seconds />
					</React.Fragment>
				)}
				</Timer>
			)
		}
		return (
			<div styleName="l-header">
				<div styleName="c-logo">
					<img src={logo} 
						styleName="c-logo__image"
						alt="logo"
						onClick={this.goToHomePage}
					/>
				</div>
				<div styleName="c-problem-counter">
					<div styleName="c-problem-counter__progress_bar">
						<Progress
							percent={this.props.attemptedCount*100/this.props.totalCount}
							status="active"
							type="line"
							strokeColor="#fffff"
							strokeWidth={18}
							showInfo={false}
							strokeLinecap='square'
						/>
					</div>
					<p> {this.props.attemptedCount}/{this.props.totalCount} attempted </p>
				</div>
				<div styleName={`c-timer--${this.props.timerWarnLevel} c-timer`}>
					<Icon type="clock-circle" style={{fontSize:'2rem'}}/>
					<span>&nbsp;&nbsp;&nbsp;
						{timer}
					</span>
				</div>
				<Button
					type="primary" 
					size="large" 
					style={{backgroundColor:"#06c4ff", fontSize:"1.25rem"}}
					onClick={() => this.props.submitTest(this.props.assessmentId)}
				>
					Submit Test
				</Button>
			</div>
		)
	}
}

export default Header