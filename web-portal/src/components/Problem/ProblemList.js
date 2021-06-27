import React, { Component } from "react"
import { Table, Button, Icon } from "antd"
import './ProblemList.scss'


// This component makes call to start the test. Dispatches actions to store the assesment_id and problems
// problems is a nested structre with testcases and templates
// this component should check if there is already an assessment in progress
// based on the invite_id , test_id in state, if there is just fetch the assessment in progress
// Renders the problems in the state. 
// when user selects a problem to solve, sets the current problem in state and
// takes user to link /problem/:id, which causes the Router to render ProblemDetailContainer

class ProblemList extends Component {

	render() {
		const columns = [
			{
				title: 'Question Title',
				dataIndex: 'title',
				key: 'title',
				className:'pt_title'
			},
			{
				title: 'Type',
				dataIndex: 'type',
				key: 'type',
				className:'pt_type'
			},
			{
				title: 'Points',
				dataIndex: 'points',
				key: 'points',
				className:'pt_points'
			},
			{
				title: 'Status',
				key: 'status',
				dataIndex: 'status',
				className:'pt_status',
				render: (text, record) => {
					let icon = null
					switch(text) {
						case 'ALL_PASS':
							icon = (<Icon type="check-circle" theme="" style={{fontSize:"30px", color:"#52c41a"}}/>)
							break
						case 'ALL_FAIL':
							icon = (<Icon type="close-circle" theme="" style={{fontSize:"30px", color:"red"}}/>)
							break
						case 'SOME_PASS':
							icon = (<Icon type="check-circle" theme="" style={{fontSize:"30px", color:"#fcba03"}}/>)
							break
						default:
							icon = (<span className="unattempted"></span>)
					}
					return record.attempted?(
						icon
					):(
						<span className="unattempted"></span>
					)
				}
			},
			{
				title: '',
				key: 'action',
				className: 'pt_action',
				render: (text, record) => (
					record.attempted ? (
						<span className="reattempt" onClick={() => this.props.selectProblem(record.id)}>
							Reattempt Question
						</span>
					):(
						<Button onClick={() => this.props.selectProblem(record.id)} style={{backgroundColor:"#848484", borderColor:"#848484"}} type='primary' size='large'>
							Solve Question
						</Button>
					)
				)
			}
		];
		return(
			<div styleName="c-problem-list">
				<Table
					rowKey='id'
					columns={columns}
					dataSource={this.props.problems}
					pagination={false}
				/>
			</div>
		)
	}
}

export default ProblemList;
