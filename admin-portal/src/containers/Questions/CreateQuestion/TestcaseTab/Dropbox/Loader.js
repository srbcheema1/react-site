import React from 'react';
import { Icon } from 'antd';

import './Loader.scss'
import './Loader.css'

const Loader = (props) =>{
	if(props.task === "empty") {
		return (
			<div styleName="Loader container">
				<Icon style={{fontSize:'30px',marginBottom:'10px'}} type="file-zip" />
				<p>Upload {props.type} Testcase</p>
			</div>
		)
	}
	if(props.task==="verfying") {
		return(
			<div styleName="Loader container">
				<div className="loader"></div>
			</div>
		)
	}
	return <h3>Wrong parameter</h3>
}

export default Loader;