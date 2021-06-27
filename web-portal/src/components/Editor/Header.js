import React, { Component } from "react";
import "./Header.scss"
import 'font-awesome/css/font-awesome.min.css';

//allows the user to change language
class Header extends Component {

	render() {
		const langDescMap = {
			python3: 'Python 3',
			javascript: 'Javascript',
			cpp: 'C++',
			java: 'Java',
			c: 'C'
		}
		let options = this.props.languageList.map((l,index) => (<option key={index} value={l}>{langDescMap[l]}</option>))
		return(
			<div styleName="EditorHeader">
				<div styleName="headerLeft">Code Editor</div>
				<div styleName="headerRight">
					<select value={this.props.selectedLanguage} id="menuList" onChange={(e) => this.props.switchLanguage(e.target.value)} >
						{options}
					</select>
					<i className={this.props.editorExpand?"fa fa-compress":"fa fa-expand"}
						styleName="toggleExpandButton"
						onClick={()=> this.props.toggleExpand()}
						title={this.props.editorExpand?"Restore Editor":"Maximize Editor"}>
					</i>
				</div>
			</div>
		)
	}
}

export default Header;
