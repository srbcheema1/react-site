import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Row, Col, Button, Icon } from 'antd';
import _ from 'underscore';

import * as actions from '../../../../store/actions';
import Editor from '../LanguageTab/Editor';
import TcTable from './TcTable';
import './ValidateTab.scss';

const lmap = {
	'c':'C', 'cpp':'C++', 'java7':'Java 7', 'java':'Java 8', 'python2':'Python 2', 'python3':'Python 3',
	'js':'JavaScript (Node.js)', 'php':'PHP', 'swift':'Swift', 'scala':'Scala', 'kotlin':'Kotlin',
}

class ValidateTab extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected:"",
		}
	}

	componentDidUpdate(prevProps) {
		if(this.state.selected==="" && !_.isEqual(prevProps.template_codes,this.props.template_codes)) {
			let avail = []
			Object.keys(this.props.template_codes).forEach(lang=>{
				let template = this.props.template_codes[lang]
				if(template.visible) avail.push(lang)
			})
			if(avail.length > 0) {
				this.selectLang(avail[0])
			}
		} else if (!_.isEqual(prevProps.editor_code,this.props.editor_code)) {
			this.selectLang(this.state.selected)
		}
	}

	selectLang = (lang) => {
		let code_map = {...this.props.editor_code};
		if(!(lang in code_map)) {
			let temp = this.props.template_codes[lang]
			let code = temp.header + '\n' + temp.body + '\n' + temp.tailer;
			this.props.setEditorCode(code,lang)
		}
		this.setState({selected:lang})
	}

	resetEditorCode = (lang) => {
		let temp = this.props.template_codes[lang]
		let code = temp.header + '\n' + temp.body + '\n' + temp.tailer;
		this.props.setEditorCode(code,lang)
	}

	selected = () => {
		if(this.state.selected in this.props.template_codes) return this.props.template_codes[this.state.selected];
		return {
			language:"",
			header:"",
			body:"",
			tailer:"",
			id:"",
			visible:false,
			dirty:false,
		};
	}

	finish = () => {
		this.props.finish()
	}

	render() {
		const temp = this.selected();
		let code = this.props.editor_code[temp.language]? this.props.editor_code[temp.language].code : ""
		let tcs = (this.props.editor_code[temp.language]? this.props.editor_code[temp.language].tc : []) || []
		return (
			<div styleName="vtab">
				<Row gutter={0} styleName="row" style={{margin:'0px'}}>
					<Col span={6} styleName="leftCol">
						<div styleName="title">
							Selected Languages
						</div>
						<div styleName="languages-selector">
							{Object.keys(this.props.template_codes).map((lang)=>{
								let template = this.props.template_codes[lang];
								let warning = false;
								if(!template.visible) return null;
								return (
									<div
										styleName="language-selector"
										key={lang}
										active={this.state.selected===lang ? 'true': 'false'}
										onClick={()=>this.selectLang(lang)}
									>
										<div>
											{this.state.selected===lang && <Icon type="caret-right" />}
											{lmap[lang]}
										</div>
										<div>
											{warning && <Icon type="exclamation-circle" style={{color:'red',marginRight:'10px'}} />}
										</div>
									</div>
								)
							})}
						</div>
					</Col>
					<Col span={2}></Col>
					<Col span={16} styleName="rightCol">
						<Editor
							code={code}
							height="500px"
							lang={temp.language}
							heading="Code"
							onChange={(code)=>this.props.setEditorCode(code,temp.language)}
							ref={this.editorRef}
						/>
						<div styleName="buttons">
							<Button styleName="form__button" onClick={() => this.resetEditorCode(temp.language)}> Clear </Button>
							<Button styleName="form__button" onClick={() => this.props.run(code,temp.language)}> Run </Button>
						</div>
					</Col>
				</Row>
				<div>
					<TcTable testcases={tcs}/>
				</div>
				<div styleName="buttons">
					<Button type="primary" styleName="form__button" onClick={this.finish}> Done </Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		editor_code: state.problem.editor_code,
		template_codes: state.problem.problem.template_codes || {},
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setEditorCode: (code,lang) => dispatch(actions.setEditorCode({code,lang})),
		clearLang: (lang) => dispatch(actions.deleteEditorCode({lang})),
		run: (code,lang) => dispatch(actions.runEditorCode(code,lang))
	};
};

export default withRouter(connect( mapStateToProps, mapDispatchToProps, null, {forwardRef:true} ) ( ValidateTab ));

