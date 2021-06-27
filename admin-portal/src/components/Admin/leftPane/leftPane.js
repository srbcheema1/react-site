import React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon } from "antd";
import "./leftPane.scss";
import logo from "../../../assets/images/codehall-logo-dark.png";
const SubMenu = Menu.SubMenu;

class LeftPane extends React.Component {
	state = {
		showUser: false,
		catalogs: [],
		username: window.localStorage.getItem("username")
	};
	handleClick = e => {
		this.setState({
			current: e.key
		});
	};
	logoutHandler = () => {
		window.location.href = "/";
		window.localStorage.clear();
	};
	render() {
		return (
			<div styleName="leftPane">
				<Menu
					style={{ height: '100vh' }}
					theme="dark"
					onClick={this.handleClick}
					selectedKeys={[this.state.current]}
					mode="inline"
					onSelect={this.selectedMenItem}
				>
					<div styleName="leftPane__logo">
						<img src={logo} alt="logo" />
					</div>

					<SubMenu title={<span><Icon type="book" /> Tests</span>} >
						<Menu.Item key="active_test">
							<Link to="/admin/tests/">Active Tests</Link>
						</Menu.Item>
						<Menu.Item key="draft_test">
							<Link to="/admin/tests/">Draft Tests</Link>
						</Menu.Item>
						<Menu.Item key="archived_test">
							<Link to="/admin/tests/">Archived Tests</Link>
						</Menu.Item>
					</SubMenu>

					<SubMenu title={<span><Icon type="question-circle" /> Question Library</span>} >
						<Menu.Item key="create_question">
							<Link to="/admin/create-question/">Create Question</Link>
						</Menu.Item>
						<Menu.Item key="draft_questions">
							<Link to="/admin/draft-questions/">Draft Questions</Link>
						</Menu.Item>
						<Menu.Item key="default_questions">
							<Link to="/admin/my-questions/">Default Questions</Link>
						</Menu.Item>
						<Menu.Item key="my_questions">
							<Link to="/admin/my-questions/">My Questions</Link>
						</Menu.Item>
					</SubMenu>

					<Menu.Item key="reports">
						<Icon type="file" />
						<span><Link to="/admin/tests/">Reports</Link></span>
					</Menu.Item>

					<Menu.Item key="insights">
						<Icon type="line-chart" />
						<span><Link to="/admin/tests/">Insights</Link></span>
					</Menu.Item>

					<Menu.Item key="settings">
						<Icon type="setting" />
						<span><Link to="/admin/tests/">Settings</Link></span>
					</Menu.Item>


				</Menu>
			</div>
		);
	}
}

export default LeftPane;
