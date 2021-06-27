import React, { Component } from "react";
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/mode/python';
import 'brace/theme/monokai';
import {acequire} from 'brace'
import "./Editor.css?raw";


const mode = {
	python3: "python",
	javascript: "javascript",
	c: "c_cpp",
	cpp: "c_cpp",
	java: "java"
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

	// function outSideRange(position){
	// 	var row = position["row"],column=position["column"];
	// 	for (let i=0;i<ranges.length;i++){
	// 		if(ranges[i].start["row"]< row && ranges[i].end["row"]>row)
	// 			return false;
	// 		if(ranges[i].start["row"]===row && ranges[i].start["column"]<column){
	// 			if(ranges[i].end["row"] !== row || ranges[i].end["column"]>column)
	// 				return false;
	// 		}
	// 		else if(ranges[i].end["row"] === row&&ranges[i].end["column"]>column){
	// 			return false;
	// 		}
	// 	}
	// 	return true; 
	// }

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

	// need to examine the code thats commented out below
	// and see how it needs to be changed right now things are
	// functional..

	// for(let i=0;i<ranges.length;i++){
	// 	ranges[i].start  = session.doc.createAnchor(ranges[i].start);
	// 	ranges[i].end    = session.doc.createAnchor(ranges[i].end);
	// 	ranges[i].end.$insertRight = true;
	// }

	// var old$tryReplace = editor.$tryReplace;
	// editor.$tryReplace = function(range, replacement) {
	// 	return intersectsRange(range)?null:old$tryReplace.apply(this, arguments);                        
	// }
	// var session = editor.getSession();
	// var oldInsert = session.insert;
	// session.insert = function(position, text) {
	// 	return oldInsert.apply(this, [position, outSideRange(position)?text:""]);
	// }
	// var oldRemove = session.remove;
	// session.remove = function(range) {
	// 	return intersectsRange(range)?false:oldRemove.apply(this, arguments);                        
	// }
	// var oldMoveText = session.moveText;
	// session.moveText = function(fromRange, toPosition, copy) {
	// 	if (intersectsRange(fromRange) || !outSideRange(toPosition)) return fromRange;
	// 	return oldMoveText.apply(this, arguments);
	// }

}

function refresheditor(editor,readonly) {
	set_readonly(editor,readonly);
}

function readonly_lines(editor, line_numbers) {
	var readonly_ranges=[];
	line_numbers.sort();
	for(let i=0;i<line_numbers.length;i++){
		readonly_ranges.push([line_numbers[i]-1,0,line_numbers[i],0]);
	}
	refresheditor(editor,readonly_ranges);
}

function make_read_only(editor, num_hl, num_fl) {
	let num_rows = editor.getSession().getLength()
	let lines = []
	for (let i=1; i<=num_hl; i++) {
		lines.push(i)
	}
	for (let i=0; i<num_fl; i++) {
		lines.push(num_rows - i)
	}
	readonly_lines(editor, lines)
}

//readonly_lines("myeditor",content,[5,7,9]);

class Editor extends Component {

	componentDidMount() {
		let editor = this.refs.aceEditor.editor
		make_read_only(editor, this.props.headerSize, this.props.footerSize)
		this.resizeEditor()
	}

	componentDidUpdate() {
		let editor = this.refs.aceEditor.editor
		make_read_only(editor, this.props.headerSize, this.props.footerSize)
		this.resizeEditor()
	}

	onCodeInEditorChange = (code) =>  {
		let editor = this.refs.aceEditor.editor
		make_read_only(editor, this.props.headerSize, this.props.footerSize)
		// let editorDiv = document.getElementById("brace-editor")
		// let parentHeight = editorDiv.parentNode.offsetHeight
		// editorDiv.style.height = parentHeight + "px"
		// editor.resize();
		this.props.updateCode(code)
	}

	resizeEditor = () => {
		let editor = this.refs.aceEditor.editor
		let editorDiv = document.getElementById("brace-editor")
		let parentHeight = editorDiv.parentNode.offsetHeight
		editorDiv.style.height = parentHeight + "px"
		editor.resize();
	}

	render() {
		return(
			<AceEditor
				mode = { mode[this.props.lang] }
				theme = "monokai"
				onChange = { this.onCodeInEditorChange }
				editorProps = {{ 
					$blockScrolling: true 
				}}
				setOptions = {{
					highlightActiveLine: false,
					dragEnabled: false,
					showPrintMargin: false
				}}
				value = { this.props.code }
				height = "200px"
				width = "100%"
				fontSize = "14px"
				ref = "aceEditor"
				onLoad={editor => {
					window.aceEditor = editor
					window.setTimeout(function() { editor.getSession().getUndoManager().reset(); }, 700)
				}}
			/>
		)
	}
}


export default Editor;
