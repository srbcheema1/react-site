import React, { Component } from "react";
import AceEditor from 'react-ace';
import { notification, Tooltip } from 'antd';

import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/mode/python';
import 'brace/theme/xcode';
import 'font-awesome/css/font-awesome.min.css';

import "./Editor.scss";



const mode_fun = (mode) => {
	// we need to send default mode to prevent warning
	// https://github.com/securingsincity/react-ace/issues/360#issuecomment-531945270
	switch(mode) {
		case "python3":
			return "python";
		case "javascript":
			return "javascript";
		case "c":
			return "c_cpp";
		case "cpp":
			return "c_cpp";
		case "java":
			return "java";
		default:
			return "python";
	}
}

class Editor extends Component {

	copy_to_clipboard = (text) => {
		navigator.clipboard.writeText(text);
		notification.open({
			style:{
				marginLeft:'100px',
				width:'250px'
			},
			message: 'Code Copied to Clipboard',
			duration: 2,
			icon: <i className="fa fa-copy"/>
		});
	}

	render() {
		return(
			<div styleName="editor">
				<div styleName="editor__header">
					<div>
						{this.props.heading}
					</div>
					<div style={{fontSize:'1.2em'}}>
						<Tooltip title="Copy to clipboard">
							<i className="fa fa-copy" styleName="copy-to-clipboard" onClick={() => this.copy_to_clipboard(this.props.code)}/>
						</Tooltip>
					</div>
				</div>
				<AceEditor
					mode = { mode_fun(this.props.lang) }
					theme = "xcode"
					editorProps = {{ 
						$blockScrolling: true 
					}}
					setOptions = {{
						highlightActiveLine: false,
						dragEnabled: false,
						showPrintMargin: false
					}}
					value = { this.props.code }
					height= { this.props.height || '100px' }
					width = "100%"
					ref = "aceEditor"
					onChange={this.props.onChange}
					onLoad={editor => {
						window.setTimeout(function() { editor.getSession().getUndoManager().reset(); }, 700)
					}}
				/>
			</div>
		)
	}
}


export default Editor;