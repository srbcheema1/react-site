import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Select, Input, Button } from 'antd';

import * as actions from '../../../store/actions';

import './CandidatesTable.scss';

const { Search } = Input;
const { Option } = Select;

class CandidateSearch extends Component {

	updateSearch = (value) => {
		this.props.setState({search:value})
	}

	updateStatus = (value) => {
		this.props.setState({status:value})
		this.fetchCandidates()
	}

	fetchCandidates = () => {
		let pager = {...this.props.pagination}
		pager.current = 1;
		this.props.fetchCandidates(pager)
	}

	refresh = () => {
		this.props.fetchCandidates({...this.props.pagination})
	}

	takeAction = (e) => {
		let assessments = this.props.selected.map(s=>s.assessment_id)
		if(e==="Re-Invite") {

		}
		if(e==="Delete") {

		}
		if(e==="Pass") {
			this.props.evaluate(assessments,"pass",this.refresh)
		}
		if(e==="Fail") {
			this.props.evaluate(assessments,"fail",this.refresh)
		}
	}

	render() {
		let invited = this.props.selected.filter(x=> x.status==="INV").length
		let to_eval = this.props.selected.filter(x=> x.status==="CM").length
		let total = this.props.selected.length
		return (
			<Form styleName="c-candidatesearch" layout="inline" >
				<Form.Item>
					<Search
						placeholder="Search Candidate"
						onSearch={this.fetchCandidates}
						value={this.props.search}
						onChange={e=>this.updateSearch(e.target.value)}
						styleName="c-candidatesearch__searchcandidate"
					/>
				</Form.Item>
				<Form.Item label="Candidate Status : ">
					<Select value={this.props.status} styleName="c-candidatesearch__status" onChange={e=>this.updateStatus(e)}>
						<Option value="CM">To Evaluate</Option>
						<Option value="PS">Pass</Option>
						<Option value="FL">Fail</Option>
						<Option value="INV">Invited</Option>
						<Option value="ALL">All</Option>
					</Select>
				</Form.Item>
				<Form.Item>
					<Select 
						styleName="c-candidatesearch__actions"
						value="Action"
						disabled={total===0}
						onChange={e=>this.takeAction(e)}
					>
						{to_eval===0 && <Option value="Re-Invite">Re-Invite</Option>}
						<Option value="Delete">Delete</Option>
						{invited===0 && <Option value="Pass">Pass</Option>}
						{invited===0 && <Option value="Fail">Fail</Option>}
					</Select>
				</Form.Item>
				<Form.Item styleName="c-candidatesearch__filters">
					<Button>
						Advanced Filters
					</Button>
				</Form.Item>
			</Form>
		);
	}
}

const WrappedCandidateSearch = Form.create({ name: 'candidate_search' })(CandidateSearch);

const mapStateToProps = state => {
	return {
		search: state.candidates.search,
		status: state.candidates.status,
		selected: state.candidates.selected,
		pagination: state.candidates.pagination,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setState: (state) => dispatch(actions.candidatesSetState(state)),
		fetchCandidates: (pager) => dispatch(actions.fetchCandidates(pager)),
		evaluate: (assessments,action,callback) => dispatch(actions.evaluate(assessments,action,callback))
	};
};

export default connect( mapStateToProps, mapDispatchToProps, null, {forwardRef:true} )( WrappedCandidateSearch );