import React, { Component } from 'react';
import { Icon, Table } from 'antd';
import { Link } from 'react-router-dom';

import './QuestionsTable.scss';

class QuestionsTable extends Component {
	render() {
		let index=-1;
		const data = this.props.problems.map(function(data) {
			index++;
			return {
				index,
				key:index,
				...data,
				difficulty: "Easy",
			}
		})
		const columns = [
			{
				title: 'Questions',
				key: 'questions',
				className: 'l-question__title',
				dataIndex: 'title',
				render: (text,record) => (
					<React.Fragment>
						<Link to={""} >
							<h3>{record.index+1 + ")"} {text}</h3>
						</Link>
					</React.Fragment>
				)
			},
			{
				title: 'Difficulty',
				key: 'difficulty',
				dataIndex: 'difficulty',
				className: 'l-question__difficulty',
				//sorter: (a, b) => a.na - b.na,// implement sorter fxn
			},
			{
				title: 'Points',
				key: 'points',
				dataIndex: 'points',
				className: 'l-question__points',
				sorter: (a, b) => a.points - b.points,
			},
			{
				title: 'Actions',
				key: 'actions',
				className: 'l-question__actions',
				render: (text,record) => (
					<Link to="" style={{}}>
						Try Question
					</Link>
				)
			},
			{
				title: '',
				key: 'delete',
				className: 'l-question__delete',
				render: (text,record) => (
					<React.Fragment>
						<div styleName="c-question__delete-question" onClick={() => {console.log('srb yet to implement to delete question')}}>
							<Icon type="delete"/>
						</div>
					</React.Fragment>
				)
			},
		]
		return (
			<div style={{...this.props.style}}>
				<div styleName="c-questiontableheader">
					<div styleName="c-questiontableheader__title">{this.props.curr_test.title}</div>
					<div styleName="c-questiontableheader__add">+ Add from library</div>
					<div styleName="c-questiontableheader__setting"> 
						<Icon type="setting" /> Settings
					</div>
				</div>
				<Table
					styleName="c-question"
					columns={columns}
					dataSource={data}
					pagination={false}
				/>
			</div>
		)
	}
}

export default QuestionsTable;