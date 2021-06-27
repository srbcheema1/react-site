import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Checkbox, Row, Col, Button, Icon } from 'antd';
import _ from 'underscore';

import * as actions from '../../../../store/actions';
import Editor from './Editor';
import './LanguageTab.scss';

const lmap = {
	'c':'C', 'cpp':'C++', 'java7':'Java 7', 'java':'Java 8', 'python2':'Python 2', 'python3':'Python 3',
	'js':'JavaScript (Node.js)', 'php':'PHP', 'swift':'Swift', 'scala':'Scala', 'kotlin':'Kotlin',
}

class LanguageTab extends React.Component {
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
			if(avail.length > 0) this.setState({selected:avail[0]})
		}
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

	update_template = (lang,type,code) => {
		this.props.updateTemplate(lang,type,code)
	}

	delete_template = (lang) => {
		if(this.state.selected === lang) {
			this.setState({selected:""},()=>{
				this.props.removeTemplate(lang)
			})
		} else {
			this.props.removeTemplate(lang)
		}
	}

	onChange = (langs) => {
		langs.forEach(lang=>{
			if(!(lang in this.props.template_codes)) {
				this.props.addTemplate(lang)
			} else if(!this.props.template_codes[lang].visible) {
				this.props.addTemplate(lang)
			}
		})
		const lang_set = new Set(langs)
		Object.keys(this.props.template_codes).forEach(lang => {
			if(!lang_set.has(lang)) {
				this.delete_template(lang);
			}
		})
	}

	next = () => {
		Object.keys(this.props.template_codes).forEach(lang=>{
			if(this.props.template_codes[lang].dirty) {
				this.props.syncTemplate(lang)
			}
		})
		this.props.next();
	}

	render() {
		const options = [
			{ label: lmap['c'], value: 'c' },
			{ label: lmap['cpp'], value: 'cpp' },
			{ label: lmap['java7'], value: 'java7' },
			{ label: lmap['java'], value: 'java' },
			{ label: lmap['python2'], value: 'python2' },
			{ label: lmap['python3'], value: 'python3' },
			{ label: lmap['js'], value: 'js', disabled:true },
			{ label: lmap['php'], value: 'php', disabled:true },
			{ label: lmap['swift'], value: 'swift', disabled:true },
			{ label: lmap['scala'], value: 'scala', disabled:true },
			{ label: lmap['kotlin'], value: 'kotlin', disabled:true },
		];
		const temp = this.selected();
		const checked_list = []
		Object.keys(this.props.template_codes).forEach(lang=>{
			if(this.props.template_codes[lang].visible) checked_list.push(lang)
		})
		return (
			<div styleName="ltab">
				<div styleName="title">
					Choose Languages
				</div>
				<Checkbox.Group options={options} value={checked_list} onChange={this.onChange} />
				<div>
					<Row gutter={0} styleName="row" style={{margin:'0px'}}>
						<Col span={6} styleName="leftCol">
							<div styleName="title">
								Selected Languages
							</div>
							<div styleName="languages-selector">
								{Object.keys(this.props.template_codes).map((lang)=>{
									let template = this.props.template_codes[lang];
									let warning = false;
									if(template.header.length === 0 || template.body.length===0 || template.tailer.length===0 ) warning = true;
									if(!template.visible) return null;
									return (
										<div
											styleName="language-selector"
											key={lang}
											active={this.state.selected===lang ? 'true': 'false'}
											onClick={()=>this.setState({selected:lang})}
										>
											<div>
												{this.state.selected===lang && <Icon type="caret-right" />}
												{lmap[lang]}
											</div>
											<div>
												{warning && <Icon type="exclamation-circle" style={{color:'red',marginRight:'10px'}} />}
												<Icon type="close" onClick={(e)=>{e.stopPropagation(); this.delete_template(lang)}}/>
											</div>
										</div>
									)
								})}
							</div>
						</Col>
						<Col span={2}></Col>
						{temp.visible && <Col span={16} styleName="rightCol">
							<div styleName="header">
								<div styleName="title">
									Set Header, Footer & Body
								</div>
								<div styleName="">
									{lmap[temp.language]}
								</div>
								<Button onClick={()=>this.props.syncTemplate(temp.language)} disabled={!temp.dirty}> Set </Button>
							</div>
							<div>
								<Editor
									code={temp.header}
									lang={temp.language}
									heading="Header"
									onChange={(code)=>this.update_template(temp.language,"header",code)}
								/>
								<Editor
									code={temp.tailer}
									lang={temp.language}
									heading="Footer"
									height="150px"
									onChange={(code)=>this.update_template(temp.language,"tailer",code)}
								/>
								<Editor
									code={temp.body}
									lang={temp.language}
									heading="Body"
									onChange={(code)=>this.update_template(temp.language,"body",code)}
								/>
							</div>
						</Col>}
					</Row>
				</div>
				<div styleName="buttons">
					<Button styleName="form__button"> Cancel </Button>
					<Button type="primary" styleName="form__button" onClick={this.next}> Next </Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		template_codes: state.problem.problem.template_codes || {},
	};
};

const mapDispatchToProps = dispatch => {
	return {
		addTemplate: (language)=> dispatch(actions.addTemplate({language})),
		removeTemplate: (language)=> dispatch(actions.removeTemplate(language)),
		syncTemplate: (language)=> dispatch(actions.syncTemplate(language)),
		updateTemplate: (language,type,code)=> dispatch(actions.updateTemplate({language,key:type,value:code})),
	};
};

export default withRouter(connect( mapStateToProps, mapDispatchToProps ) ( LanguageTab ));

