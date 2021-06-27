import React, { Component } from "react";
import { Progress, Table } from "antd";
import './Output.scss'
import './Output.css'
import 'font-awesome/css/font-awesome.min.css';

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

class OutPut extends Component {
	render() {
		let index=-1;
		const data = this.props.testcases.map(function(data) {
			index++;
			return {index,key:index, ...data}
		})

		const columns = [
			{
				title: 'Sample Case',
				dataIndex: 'index',
				key: 'index',
				className: 'verdict-index',
			},
			{
				title: 'Difficulty Level',
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
				dataIndex: 'logo',
				key: 'status',
				className: 'verdict-logo',
				render: logo => (
					<React.Fragment>
						<i styleName={ LogoStyleMap[logo] } className={ LogoFaMap[logo] }></i>
						{	LogoVerdictMap[logo] }
					</React.Fragment>
				)
			},
		]

		let passCases = this.props.testcases.filter(tc => tc.logo === 'AC').length
		let totalCases = this.props.testcases.length
		let leftCases = totalCases - passCases
		let message = leftCases + " out of " + totalCases + " testcases do not pass. "
			+ "You can use the Custom Input tab, to test your code against custom input."
		if (this.props.probStatus === "ALL_PASS") {
			if (this.props.leftCount > 0) {
				message = "Congratulations, all test cases pass for this problem. You still have "
				+ this.props.leftCount
				+ " problems left which need work."
			} else {
				message = "Congratulations, all test cases pass for this problem. You have completed all problems. "
				+ "hit the submit test button on top right to complete and submit the test."
			}
		} else if (this.props.probStatus === "NA") {
			message = "Write code in the editor on right and then hit Submit Code button to evaluate the test cases."
			+ "You can also use the Custom Input tab, to test your code against custom input."
		}

		return(
			<div styleName="results-tab">
				<p>
					<em>{message}</em>
				</p>
				<h3> Output </h3>
				<Table
					styleName="verdict-table"
					columns={columns}
					dataSource={data}
					pagination={false}
				/>
			</div>
		)
	}
}



export default OutPut;
