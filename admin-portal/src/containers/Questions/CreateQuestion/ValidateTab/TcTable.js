import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Progress, Table } from 'antd';
import 'font-awesome/css/font-awesome.min.css';

import './TcTable.scss';

const LogoFaMap={
	'NA':'fa fa-question', //nologo yet
	'UA':'fa fa-exclamation-circle', //unattempted
	'AC':"fa fa-check", // correct
	'LOAD':'fa fa-refresh fa-spin fa-fw', //do not have the results yet, call sent to server
	'TLE':'fa fa-clock-o', // failed, time limit exceeded
	'WA':'fa fa-times', // failed, output did not match input
	'CE':'fa fa-stack-overflow', //compiler error
	'RE':'fa fa-stack-overflow', //runtime error
}

const LogoStyleMap={
	'NA':'dfault', //nologo yet
	'UA':'dfault', //unattempted
	'AC':'grn', // correct
	'LOAD':'dfault', //do not have the results yet, call sent to server
	'TLE':'orng', // failed, time limit exceeded
	'WA':'dangr', // failed, output did not match input
	'CE':'orng', //compiler
	'RE':'orng', // runtime error
}

const LogoVerdictMap={
	'NA':'', //nologo yet
	'UA':' Not Attempted', //unattempted
	'AC':' Success', // correct
	'LOAD':'', //do not have the results yet, call sent to server
	'TLE':' Time Limit Exceeded', // failed, time limit exceeded
	'WA':' Failed', // failed, output did not match input
	'CE':' Compilation Failed', //compiler
	'RE':' Runtime Error', // runtime error
}

const difficultyColorMap={
	'EZ':'#4E957F',
	'MD':'#ffb933',
	'HD':'#D63321',
}

const difficultyPercentMap={
	'EZ':30,
	'MD':50,
	'HD':90,
}

class TcTable extends Component {
	render() {
		let index=-1;
		const data = this.props.testcases.map(function(data) {
			index++;
			return {index,key:index, ...data}
		})
		const columns = [
			{
				title: 'Case No',
				dataIndex: 'index',
				key: 'index',
				className: 'verdict-index',
			},
			{
				title: 'Difficulty',
				dataIndex: 'difficulty',
				key: 'difficulty',
				className: 'verdict-difficulty',
				render: data => (
					<React.Fragment>
						<Progress percent={difficultyPercentMap[data]} strokeColor={difficultyColorMap[data]} showInfo={false} strokeWidth={6}/>
					</React.Fragment>
				)
			},
			{
				title: 'Points',
				dataIndex: 'points',
				key: 'points',
				className: 'verdict-points',
			},
			{
				title: 'Status',
				dataIndex: 'status',
				key: 'status',
				className: 'verdict-logo',
				render: status => (
					<React.Fragment>
						<i styleName={ LogoStyleMap[status] } className={ LogoFaMap[status] }></i>
						{	LogoVerdictMap[status] }
					</React.Fragment>
				)
			},
		]

		console.log('srb tctable',this.props.testcases)

		return (
			<Table
				styleName="verdict-table"
				columns={columns}
				dataSource={data}
				pagination={false}
			/>
		)
	}
}

const mapStateToProps = state => {
	return {
		assessment: state.assessment,
	};
};

const mapDispatchToProps = dispatch => {
	return {
	};
};

export default withRouter(connect( mapStateToProps, mapDispatchToProps, null, {forwardRef:true} )( TcTable ));