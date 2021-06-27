import React, { Component } from "react";
import { Icon, Menu } from 'antd';
import "./AdminHeader.scss";

class AdminHeader extends Component {
	state = {
		username: window.localStorage.getItem("username")
	};

	handleClick = e => {
		if (e.key === "Logout") {
			this.logoutHandler();
		}
	};

	logoutHandler = () => {
		// implement invalidate token
		this.setState({username:null});
		window.localStorage.clear();
		window.location.href = "/";
	};
	
	render() {
		return (
			<div styleName="l-header">
				<div styleName="l-header__left">
						<Icon styleName="l-header__icon" type="menu" />
				</div>
				<div styleName="l-header__center">
				</div>
				<div styleName="l-header__right">
					<Menu
						style={{ height: 50 }}
						theme="light"
						onClick={this.handleClick}
						mode="horizontal"
					>
						<Menu.Item key="search">
							<Icon styleName="l-header__icon" type="search" />
						</Menu.Item>
						<Menu.Item key="bell">
							<Icon styleName="l-header__icon" type="bell" />
						</Menu.Item>
						<Menu.SubMenu
							title={
								<span styleName="l-header__user">
									<Icon styleName="l-header__usericon circle-icon" type="user" />
									<b>{this.state.username}</b>
								</span>
							}
						>
							<Menu.ItemGroup>
								<Menu.Item key="Logout">
									<Icon type="logout" /> Logout
								</Menu.Item>
							</Menu.ItemGroup>
						</Menu.SubMenu>
					</Menu>
				</div>
			</div>
		);
	}
}

export default AdminHeader;