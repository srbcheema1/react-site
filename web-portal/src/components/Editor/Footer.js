import React, { Component } from "react";
import './Footer.scss';
import { Button } from 'antd'


//hosts the button to run the code
// dispatches action which submits the code via API

class Footer extends Component {

	render() {
		return (
			<div styleName="c-footer">
				<Button type="primary" disabled={this.props.disabled} onClick={()=>this.props.submitCode()} style={{backgroundColor:"#848484", borderColor:"#848484"}}>Submit Code</Button>
			</div>
		);
	}
}

export default Footer;
