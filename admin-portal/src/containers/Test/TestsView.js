import React, { Component } from 'react';
import { Input, Select, Form, Button, Table, Icon } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InviteModal from '../Invite/InviteModal';
import * as actions from '../../store/actions';
import './TestsView.scss';
import { Link } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

class TestsView extends Component {

	constructor(props) {
		super(props);
		this.inviteRef = React.createRef();
	}

	componentDidMount() {
	}

	sendInvite = (test_id) => {
		this.inviteRef.current.init(test_id);
	}

	openTest = (test) => {
		this.props.setCurrTest(test)
		this.props.fetchCandidates({...this.props.pagination})
		this.props.history.push(`/admin/test/${test.id}`)
	}

	render() {
		let index=-1;
		const data = this.props.tests.map(function(data) {
			index++;
			let na = (data.summary ? data.summary.not_attempted: null)
			let te = (data.summary ? data.summary.completed: null)
			let prg = (data.summary ? data.summary.in_progress: null)
			let evaluate = (data.summary ? data.summary.evaluated: null)
			return {
				index,
				key:index,
				...data,
				na,
				te,
				prg,
				evaluate,
			}
		})
		const columns = [
			{
				title: 'Tests',
				key: 'title',
				className: 'l-test__title',
				render: (text,record) => (
					<React.Fragment>
						<h3 style={{cursor:'pointer'}} onClick={()=>this.openTest(record)}>{record.title}</h3>
						<p>{record.description}, {record.experience?record.experience:'0-10'} years</p>
						<span styleName="l-test__test-desc">
							<Icon type="user"/> {record.creator?record.creator:'admin'} &nbsp;&nbsp;&nbsp;&nbsp;
							<Icon type="clock-circle"/> &nbsp;{record.total_time} &nbsp;&nbsp;&nbsp;&nbsp;
							<Icon type="menu"/> &nbsp;5
						</span>
					</React.Fragment>
				)
			},
			{
				title: 'Not Attempted',
				key: 'not-attempted',
				dataIndex: 'na',
				className: 'l-test__not-attempted',
				sorter: (a, b) => a.na - b.na,
			},
			{
				title: 'In Progress',
				key: 'prg',
				dataIndex: 'prg',
				className: 'l-test__progress',
				sorter: (a, b) => a.prg - b.prg,
			},
			{
				title: 'To Evaluate',
				key: 'te',
				dataIndex: 'te',
				className: 'l-test__to-evaluate',
				sorter: (a, b) => a.te - b.te,
			},
			{
				title: '',
				key: 'send-invite',
				className: 'l-test__send-invite',
				render: (text,record) => (
					<React.Fragment>
						<div styleName="c-test__sendInvite" onClick={() => this.sendInvite(record.id)}>
							<Icon type="mail"/> Send Invite
						</div>
					</React.Fragment>
				)
			},
		]
		return (
			<div styleName="c-test">
				<div styleName="l-test-header">
					<div styleName="l-test-header__left">
						<Button type="primary">
							<Link to={ `/admin/create` }>Create New Test</Link>
						</Button>
					</div>
					<div styleName="l-test-header__center"/>
					<div styleName="l-test-header__right">
						<WrappedTestSearch/>
					</div>
				</div>
				<div styleName="l-test-table">
					<Table
						styleName="c-test-table"
						columns={columns}
						dataSource={data}
						pagination={false}
					/>
				</div>
				<InviteModal
					ref={this.inviteRef}
				/>
			</div>
		);
	}
}

class TestSearch extends Component {
	componentDidMount() {
		// To disabled submit button at the beginning.
		this.props.form.validateFields();
	}
	
	hasErrors = fieldsError => {
		return Object.keys(fieldsError).some(field => fieldsError[field]);
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				// console.log('Received values of form: ', values);
			}
		});
	};

	render() {
		return (
			<Form styleName="c-testsearch" layout="inline" onSubmit={this.handleSubmit}>
				<Form.Item>
					<h4 styleName="c-testsearch__heading"><b>Filter By:</b></h4>
				</Form.Item>
				<Form.Item label="Rules : ">
					<Select defaultValue="all" styleName="c-testsearch__rules">
						<Option value="all">All</Option>
						<Option value="dev">dev</Option>
					</Select>
				</Form.Item>
				<Form.Item label="Experience : ">
					<Select defaultValue="3-5" styleName="c-testsearch__experience">
						<Option value="3-5">3-5</Option>
						<Option value="0-2">0-2</Option>
					</Select>
				</Form.Item>
				<Form.Item>
					<Search
						placeholder="search test"
						onSearch={value => {}}
						styleName="c-testsearch__searchtest"
					/>
				</Form.Item>
			</Form>
		);
	}
}

const WrappedTestSearch = Form.create({ name: 'test_search' })(TestSearch);

const mapStateToProps = state => {
	return {
		pagination: state.candidates.pagination,
		tests: state.test.tests,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		createTest: (data) => dispatch(actions.createTest(data)),
		fetchCandidates: (pager) => dispatch(actions.fetchCandidates(pager)),
		setCurrTest: (test) => dispatch(actions.setCurrTest({test})),
	};
};

TestsView.propTypes = {
	problems: PropTypes.array,
	createTest: PropTypes.func,
};

export default connect( mapStateToProps, mapDispatchToProps )( TestsView );
