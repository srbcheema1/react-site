import React, { Component } from 'react';
import { Collapse, Row, Col, Tag } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from '../../../store/actions';
import './MyQuestions.scss';

const Panel = Collapse.Panel;

class MyQuestions extends Component {
	async componentWillMount() {
		await this.props.getProblemsData();
		await this.props.getProblemTagsData();
	}

	render() {
		return (
			<div styleName="search">
				<Collapse defaultActiveKey={ [ '0' ] }>
					{this.props.problems.map(item=> (
						<Panel
							key={item.id} 
							header={
								<Row>
									<Col span={12}>{item.title}</Col>
									<Col span={6}>
										Tags:
										{item.tags.map((pro, index)=>
											<React.Fragment key={index}>
												<Tag color="blue">{this.props.tags[ `${pro}` ]}</Tag>
											</React.Fragment>
										)}
									</Col>
								</Row>}
						>
							{item.description}
						</Panel>
					))}
				</Collapse>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		problems: state.problem.problems,
		tags: state.problem.tags
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getProblemsData: () => dispatch( actions.getProblemsData() ),
		getProblemTagsData: () => dispatch( actions.getProblemTagsData() )
	};
};

MyQuestions.propTypes = {
	problems: PropTypes.array,
	tags: PropTypes.object,
	getProblemsData: PropTypes.func,
	getProblemTagsData: PropTypes.func
};

export default connect( mapStateToProps, mapDispatchToProps )( MyQuestions );
