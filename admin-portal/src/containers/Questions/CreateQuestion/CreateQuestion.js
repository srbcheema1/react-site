import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';

import ProblemTab from './ProblemTab/ProblemTab';
import TestcaseTab from './TestcaseTab/TestcaseTab';
import LanguageTab from './LanguageTab/LanguageTab';
import ValidateTab from './ValidateTab/ValidateTab';

import * as actions from '../../../store/actions';
import './CreateQuestion.scss';

class CreateQuestion extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab:1,
			max_tab:1,
		}
	}

	async componentWillMount() {
		if(Object.keys(this.props.tags).length === 0) {
			await this.props.getProblemTagsData();
		}
	}

	componentDidMount() {
		if(this.props.match.params.prob_id) {
			// fetch problem data
			this.props.getProblemData(this.props.match.params.prob_id)
			this.setState({max_tab:4,tab:1});
		}
	}

	setTab = (key) => {
		if(key <= this.state.max_tab) this.setState({tab:key})
	}

	next = () => {
		this.setTab(this.state.tab+1);
	}

	created_test = (prob_id) => {
		this.props.history.push(`/admin/create-question/${prob_id}/`);
		this.setState({max_tab:4,tab:2});
	}

	finish = () => {
		this.props.history.push(`/admin/my-questions/`);
	}

	render() {
		return (
			<div styleName="c-cques">
				<div styleName="c-cques__header">
					<div styleName="c-cques__tabs">
						<div styleName="tab-btn" active={this.state.tab===1?"true":"false"} onClick={()=>this.setTab(1)}>
							<Icon type="question-circle" /> Problem
						</div>
						<div styleName="tabline"><hr width="70px"/></div>
						<div styleName="tab-btn" active={this.state.tab===2?"true":"false"} onClick={()=>this.setTab(2)}>
							<Icon type="file" /> Test Cases
						</div>
						<div styleName="tabline"><hr width="70px"/></div>
						<div styleName="tab-btn" active={this.state.tab===3?"true":"false"} onClick={()=>this.setTab(3)}>
							<Icon type="form" /> Languages
						</div>
						<div styleName="tabline"><hr width="70px"/></div>
						<div styleName="tab-btn" active={this.state.tab===4?"true":"false"} onClick={()=>this.setTab(4)}>
							<Icon type="file-done" /> Validate
						</div>
					</div>
				</div>
				<div styleName="tabdiv" style={{display:this.state.tab===1?'block':'none'}}><ProblemTab created_test={this.created_test} next={this.next}/></div>
				<div styleName="tabdiv" style={{display:this.state.tab===2?'block':'none'}}><TestcaseTab next={this.next}/></div>
				<div styleName="tabdiv" style={{display:this.state.tab===3?'block':'none'}}><LanguageTab next={this.next}/></div>
				<div styleName="tabdiv" style={{display:this.state.tab===4?'block':'none'}}><ValidateTab finish={this.finish}/></div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		tags: state.problem.tags
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getProblemTagsData: () => dispatch( actions.getProblemTagsData() ),
		getProblemData: (prob_id) => dispatch(actions.getProblemData(prob_id)),
	};
};

export default connect( mapStateToProps, mapDispatchToProps )( CreateQuestion );
