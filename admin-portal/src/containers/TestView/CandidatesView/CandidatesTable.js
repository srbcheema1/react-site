import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table, Avatar } from 'antd';
import moment from 'moment';

import * as actions from '../../../store/actions';
import WrappedCandidateSearch from './CandidatesSearch';

import './CandidatesTable.scss';

const candidate_status_map = {
	FL:"Failed",
	PS:"Pass",
	INV:"Invited",
	CM:"To Evaluate",
}

class CandidatesTable extends Component {

	onTableChange = (pagination) => {
		let pager = { ...this.props.pagination };
		pager.current = pagination.current;
		this.props.fetchCandidates(pager);
	}

	openAssessment = (record) => {
		if(!record.assessment_id) return;
		this.props.assessmentSetBase(record);
		let test_id = this.props.curr_test.id;
		this.props.fetchAssessment(test_id,record.assessment_id,false)
		let assessment_id = record.assessment_id;
		this.props.history.push(`/admin/test/${test_id}/assessment/${assessment_id}`);
	}

	render() {
		let index=-1;
		const data = this.props.data.map(function(item) {
			index++;
			return {
				index,
				key:index,
				score:0,
				...item,
			}
		})

		const columns = [
			{
				title: 'Candidate',
				key: 'candidate',
				className: 'l-candidatetable__title',
				render: (text,record) => (
					<div styleName="l-candidatetable__title" onClick={()=>this.openAssessment(record)}>
						<div styleName="l-candidatetable__avatar">
							<Avatar>U</Avatar>
						</div>
						<div styleName="l-candidatetable__fullname">
							<div>{record.full_name || record.name}</div>
							<div>{record.email_id}</div>
						</div>
					</div>
				)
			},
			{
				title: 'Status',
				key: 'status',
				dataIndex: 'status',
				className: 'l-candidatetable__status',
				render: (text,record) => (
					candidate_status_map[text]
				),
			},
			{
				title: 'Score',
				key: 'score',
				dataIndex: 'score',
				className: 'l-candidatetable__score',
				sorter: (a, b) => a.score - b.score,
			},
			{
				title: 'Invited By',
				key: 'invitedby',
				className: 'l-candidatetable__invitedby',
				dataIndex: 'invited_by',
			},
			{
				title: 'Completion Date',
				key: 'completion_time',
				className: 'l-candidatetable__completiontime',
				dataIndex: 'completion_time',
				render: (text,record) => {
					if(record.status==="INV") return "";
					return moment(text).format("DD-MM-YYYY")
				}
					
			},
		]
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.props.setState({selected:selectedRows})
			},
			getCheckboxProps: record => ({
				// disabled: record.full_name === 'Sarbjit Singh', // we wont be able to select such row
				index: record.index,
			}),
			selectedRowKeys: this.props.selected.map(s=>s.key),
		};
		return (
			<div styleName="c-candidate" style={{...this.props.style}}>
				<WrappedCandidateSearch
					wrappedComponentRef={(inst) => this.filterRef = inst}
				/>

				<Table
					styleName="c-candidatetable"
					rowSelection={rowSelection}
					columns={columns}
					dataSource={data}
					pagination={this.props.pagination}
					loading={this.props.loading}
					onChange={this.onTableChange}
				/>
			</div>
		)
	}
}



const mapStateToProps = state => {
	return {
		curr_test: state.test.curr_test,
		data: state.candidates.data,
		loading: state.candidates.loading,
		selected: state.candidates.selected,
		pagination: state.candidates.pagination,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		assessmentSetBase: (assessment) => dispatch(actions.assessmentSetBase(assessment)),
		evaluate: (assessments,action,callback) => dispatch(actions.evaluate(assessments,action,callback)),
		fetchAssessment: (test_id,assessment_id,setBase) => dispatch(actions.fetchAssessment(test_id,assessment_id,setBase)),
		fetchCandidates: (test_id,params) => dispatch(actions.fetchCandidates(test_id,params)),
		setState: (state) => dispatch(actions.candidatesSetState(state)),
	};
};

export default withRouter(connect( mapStateToProps, mapDispatchToProps, null, {forwardRef:true} )( CandidatesTable ));

