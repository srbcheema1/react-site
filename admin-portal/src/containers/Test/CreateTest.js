import React from "react";
import { Form, Input, Button, Select, Row, Col } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import './CreateTest.scss';

const FormItem = Form.Item;

class TestCreation extends React.Component {
	componentDidMount() {
		this.props.getProblemsData();
	}

	handleTestFormSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				values.problem_data = values.problem_data.map(problemId => ({ problem: problemId, problem_time: 1 }));
				this.props.createTest(values);
				this.props.form.resetFields();
			}
		});
	};

	handleReset = () => {
		this.props.form.resetFields();
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
				<div styleName="create-test">
					<Form styleName="create-test__form" onSubmit={this.handleTestFormSubmit}>
						<Row>
							<span>Test Title</span>
							<FormItem styleName="create-test__form-item">
								{getFieldDecorator("title", {
									initialValue: null,
									rules: [{ required: true, message: "Please enter test title!" }]
								})(<Input type="text" placeholder="Test title" />)}
							</FormItem>
						</Row>
						<Row gutter={10}>
							<Col span={12}>
								<span>Description</span>
								<FormItem styleName="create-test__form-item">
									{getFieldDecorator("description", {
										initialValue: null,
										rules: [{ required: true,	message: "please enter test description!" }]
									})(<Input type="text" placeholder="Description" />)}
								</FormItem>
							</Col>
							<Col span={12}>
								<span>Total Test Time</span>
								<FormItem styleName="create-test__form-item">
									{getFieldDecorator("total_time", {
										initialValue: null,
										rules: [
											{
												required: true,
												message: "Total time"
											}
										]
									})(<Input type="number" placeholder="Total Time" />)}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<span>Select Problems</span>
							<FormItem styleName="create-test__form-item">
								{getFieldDecorator("problem_data", {
									initialValue: [],
									rules: [
										{
											required: true,
											message: "Select problems"
										}
									]
								})(
									<Select mode="multiple" placeholder="Select problems" style={{ width: "100%" }}>
										{this.props.problems.map(item => (
											<Select.Option key={item.id}>{item.title}</Select.Option>
										))}
									</Select>
								)}
							</FormItem>
						</Row>

						<Button onClick={this.handleReset}>Reset</Button>
						<Button type="primary" htmlType="submit" style={{marginLeft:'10px'}}>Save</Button>
					</Form>
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
		getProblemsData: () => dispatch(actions.getProblemsData()),
		getProblemTagsData: () => dispatch(actions.getProblemTagsData()),
		createTest: data => dispatch(actions.createTest(data))
	};
};

const WrappedTestCreation = Form.create()(TestCreation);

TestCreation.propTypes = {
	getProblemsData: PropTypes.func,
	problems: PropTypes.array,
	getProblemTagsData: PropTypes.func,
	tags: PropTypes.object,
	form: PropTypes.object,
	validate: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
	// getFieldDecorator: PropTypes.func.isRequired,
	match: PropTypes.object
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WrappedTestCreation);
