import React, { Component } from "react";
import AceEditor from 'react-ace';
import moment from 'moment';
import { Icon, notification, Tooltip } from 'antd';
import {acequire} from 'brace';

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

// most of the code here was copied from:
// https://stackoverflow.com/questions/39640328/how-to-make-multiple-chunk-of-lines-readonly-in-ace-editor

function set_readonly(editor,readonly_ranges) {
	var session  = editor.getSession()
	var Range    = acequire("ace/range").Range
	let ranges   = []

	function before(obj, method, wrapper) {
		var orig = obj[method];
		obj[method] = function() {
			var args = Array.prototype.slice.call(arguments);
			return wrapper.call(this, function(){
				return orig.apply(obj, args);
			}, args);
		}
		return obj[method];
	}

	function intersects(range) {
		return editor.getSelectionRange().intersects(range);
	}
	
	function intersectsRange(newRange) {
		for (let i=0;i<ranges.length;i++) {
			if(newRange.intersects(ranges[i])) {
				return true;
			}
		}
		return false;
	}

	function preventReadonly(next, args) {
		for(let i=0;i<ranges.length;i++){if (intersects(ranges[i])) return;}
		next();
	}

	function onEnd(position){
		var row = position["row"],column=position["column"];
		var new_range = new Range(row, column+1, row, column+1)
		for (let i=0;i<ranges.length;i++) {
			if(ranges[i].end["row"] === row && ranges[i].end["column"]===column && !intersectsRange(new_range)) {
				return true;
			}
		}
		return false;
	}

	function onEndOfEditableArea(position) {
		var row = position["row"],column=position["column"]; 
		var prev_line = new Range(Math.max(row-1,0), 0, Math.max(row-1,0), 0)
		var curr_line = new Range(row, 0, row, 0)
		var next_line = new Range(row+1, 0, row+1, 0)
		if (intersectsRange(curr_line) && !intersectsRange(prev_line)) {
			if (session.getLine(row).length === 0) {
				return true
			} else {
				return false;
			}
		} else if (intersectsRange(next_line)) {
			//on last line of editable area
			var eol_pos = Math.max(session.getLine(row).length, 0)
			if (column < eol_pos) {
				return false
			} else {
				return true
			}
		} else {
			//inside editable area but not on last line
			return false
		}
	}

	for(let i=0;i<readonly_ranges.length;i++){
		ranges.push(new Range(...readonly_ranges[i]));
	}

	let currMarkers = session.getMarkers()
	// console.log(currMarkers)
	for (var key in currMarkers) {
		if (currMarkers[key].clazz === "readonly-highlight") {
			// console.log("removing marker id: ", currMarkers[key].id)
			session.removeMarker(currMarkers[key].id)
		}
	}
	ranges.forEach(function(range){session.addMarker(range, "readonly-highlight");});
	// session.setMode("ace/mode/python");
	//console.log(Object.getOwnPropertyNames(editor.keyBinding).filter(item => typeof editor.keyBinding[item] === 'function'))
	
	if (window.ck_kb_handler) {
		editor.keyBinding.removeKeyboardHandler(window.ck_kb_handler)
	}
	editor.keyBinding.addKeyboardHandler({
		handleKeyboard : function(data, hash, keyString, keyCode, event) {
			if (Math.abs(keyCode) === 13 && onEnd(editor.getCursorPosition())){
				return false;
			}
			//handling backspace - allow all keys except backspace
			if (onEnd(editor.getCursorPosition()) && Math.abs(keyCode) !== 8){
				// handle delete as a special case
				if (onEndOfEditableArea(editor.getCursorPosition()) && Math.abs(keyCode) === 46){
					return {command:"null", passEvent:false};
				}
				return false;
			}
			// do not allow delete when on end of editable area
			if (onEndOfEditableArea(editor.getCursorPosition()) && Math.abs(keyCode) === 46){
				return {command:"null", passEvent:false};
			}
			if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) return false;
			for(let i=0;i<ranges.length;i++){
				if (intersects(ranges[i])) {
						return {command:"null", passEvent:false};
				}
			}
		}
	});
	window.ck_kb_handler = editor.keyBinding.getKeyboardHandler()
	//before(editor, 'onPaste', preventReadonly);
	before(editor, 'onCut',   preventReadonly);
}

function readonly_lines(editor, line_numbers) {
	var readonly_ranges=[];
	line_numbers.sort();
	for(let i=0;i<line_numbers.length;i++){
		readonly_ranges.push([line_numbers[i]-1,0,line_numbers[i],0]);
	}
	set_readonly(editor,readonly_ranges);
}

function make_read_only(editor) {
	let num_rows = editor.getSession().getLength()
	let lines = []
	for (let i=1; i<=num_rows; i++) {
		lines.push(i)
	}
	readonly_lines(editor, lines)
}

class Editor extends Component {

	componentDidMount() {
		let editor = this.refs.aceEditor.editor
		make_read_only(editor)
	}

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

	componentDidUpdate() {
		// it was shaking the scroll bar when changing submission
		// let editor = this.refs.aceEditor.editor
		// make_read_only(editor)
	}

	render() {
		return(
			<React.Fragment>
				<div styleName="editor__header">
					<div>
						Code
					</div>
					<div>Time: {moment(this.props.time).format("MMMM D[,] [at] hh:mm A")}</div>
					<div style={{fontSize:'1.2em'}}>
						<Tooltip title="Copy to clipboard">
							<i className="fa fa-copy" styleName="copy-to-clipboard" onClick={() => this.copy_to_clipboard(this.props.code)}/>
						</Tooltip>
						{this.props.full ? 
							<Icon type="fullscreen-exit" onClick={this.props.toggle}/> : 
							<Icon type="fullscreen" onClick={this.props.toggle}/>
						}
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
					height="500px"
					width = "100%"
					ref = "aceEditor"
					onLoad={editor => {
						window.setTimeout(function() { editor.getSession().getUndoManager().reset(); }, 700)
					}}
				/>
			</React.Fragment>
		)
	}
}


export default Editor;