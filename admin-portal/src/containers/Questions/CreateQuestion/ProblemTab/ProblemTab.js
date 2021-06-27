import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MarkDown from 'react-markdown';
import { Form, Input, Button, Select, TimePicker, Switch } from "antd";
import moment from 'moment';

import * as actions from '../../../../store/actions';
import './ProblemTab.scss';

const FormItem = Form.Item;
const { Option } = Select;

function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ProblemForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			description: "",
			md: false,
			tags:{},
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.tags !== prevProps.tags) {
			this.setState({tags:this.props.tags});
		}
		if (this.props.problem !== prevProps.problem) {
			this.setState({description:this.props.problem.description});
			this.props.form.setFieldsValue({
				statement: this.props.problem.description,
				title: this.props.problem.title,
				taglist: this.props.problem.tags,
			});
		}
	}

	componentDidMount() {
		// To disabled submit button at the beginning.
		this.props.form.validateFields();
		this.setState({tags:this.props.tags,description:this.props.problem.description})
		this.props.form.setFieldsValue({
			statement: this.props.problem.description,
			title: this.props.problem.title,
			taglist: this.props.problem.tags,
		});
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let val = {
					title:values.title,
					description:values.statement,
					tags:values.taglist || [],
				}
				if(this.props.match.params.prob_id) {
					this.props.updateQuestion(this.props.match.params.prob_id,val,this.props.next);
				} else {
					this.props.createQuestion(val,this.props.created_test);
				}
			}
		});
	};

	mdSwitch = (checked) => {
		this.setState({md:checked});
		this.props.form.setFieldsValue({
			statement: this.state.description,
		});
	}

	render() {
		const {
			getFieldDecorator,
			getFieldsError,
			getFieldError,
			isFieldTouched
		} = this.props.form;

		// Only show error after a field is touched.
		const roleError = isFieldTouched("role") && getFieldError("role");
		const expError = isFieldTouched("exp") && getFieldError("exp");
		const difficultyError = isFieldTouched("difficulty") && getFieldError("difficulty");
		const durationError = isFieldTouched("duration") && getFieldError("duration");

		const titleError = isFieldTouched("title") && getFieldError("title");
		const statementError = isFieldTouched("statement") && getFieldError("statement");


		const taglist = [];
		Object.keys(this.state.tags).forEach(e=>{
			taglist.push(<Option key={e}>{this.state.tags[e]}</Option>);
		})

		return (
			<Form styleName="form" layout="inline" onSubmit={this.handleSubmit}>
				<FormItem
					label="Role/Profile"
					validateStatus={roleError ? "error" : ""}
					help={roleError || ""}
				>
					{getFieldDecorator("role", { rules: [{ required: false, message: "Please Select one role" }] })(
						<Select styleName="role-select" onChange={this.handleRoleSelect}>
							<Option value="student">student</Option>
							<Option value="admin">admin</Option>
						</Select>
					)}
				</FormItem>
				<FormItem
					label="Experience"
					validateStatus={expError ? "error" : ""}
					help={expError || ""}
				>
					{getFieldDecorator("exp", { rules: [{ required: false, message: "Please Select Experience" }] })(
						<Select styleName="exp-select" onChange={this.handleExpSelect}>
							<Option value="0yr">0 yr</Option>
							<Option value="5yr">5 yr</Option>
						</Select>
					)}
				</FormItem>
				<FormItem
					label="Difficulty"
					validateStatus={difficultyError ? "error" : ""}
					help={difficultyError || ""}
				>
					{getFieldDecorator("difficulty", { rules: [{ required: false, message: "Please Select Difficulty" }] })(
						<Select styleName="difficulty-select" onChange={this.handleExpSelect}>
							<Option value="0">0</Option>
							<Option value="5">5</Option>
						</Select>
					)}
				</FormItem>
				<FormItem
					label="Duration"
					validateStatus={durationError ? "error" : ""}
					help={durationError || ""}
				>
					<Input.Group compact>
						{getFieldDecorator("duration", { initialValue:moment('2:00','HH:mm'), rules: [{ required: false, message: "Please Select Duration" }] })(
							<TimePicker format={'HH:mm'} />
						)}
					</Input.Group>
				</FormItem>
				
				<FormItem
					label="Problem Title"
					validateStatus={titleError ? "error" : ""}
					help={titleError || ""}
					styleName="p-title"
					{...{ wrapperCol: {span:24}}}
				>
					{getFieldDecorator("title", { rules: [{ required: true, message: "Please provide a title for problem" }] })(
						<Input type="text"/>
					)}
				</FormItem>

				<FormItem
					label={
							<div styleName="label-div">
								<div styleName="label-subdiv">
									<span>Problem Statement :</span>
									<span>Markdown Live Preview <Switch size="small" onChange={this.mdSwitch} /></span>
								</div>
							</div>
						}
					validateStatus={statementError ? "error" : ""}
					help={statementError || ""}
					styleName="p-statement"
					{...{ wrapperCol: {span:24}}}
				>
					<div styleName="markdown-box" className="ant-input" style={{display:this.state.md?'block':'none', height: '300px'}}>
						<MarkDown unwrapDisallowed={true} source={this.state.description} escapeHtml={false} />
					</div>
					{getFieldDecorator("statement", { rules: [{ required: true, message: "Please provide a problem statement" }] })(
						<Input.TextArea rows={10} type="text" 
							onChange={(e)=>{this.setState({description:e.target.value})}}
							style={{display:this.state.md?'none':'block', height: '300px'}}
						/>
					)}
				</FormItem>

				<FormItem
					styleName="p-tags"
					label="Tags"
					{...{ wrapperCol: {span:24}}}
				>
					{getFieldDecorator("taglist", { rules: [] })(
						<Select mode="multiple" onChange={this.handleTags}>
							{taglist}
						</Select>
					)}
				</FormItem>

				<FormItem
					styleName="form-buttons"
					{...{ wrapperCol: {span:10, offset:14}}}
				>
					<Button type="primary" htmlType="submit" styleName="form__button" disabled={hasErrors(getFieldsError())}> Next </Button>
					<Button htmlType="submit" styleName="form__button"> Cancel </Button>
				</FormItem>
			</Form>
		);
	}
}

const WrappedForm = Form.create()( ProblemForm );

class ProblemTab extends React.Component {
	render() {
		return (
			<div styleName="ptab" className="ptab">
				<WrappedForm {...this.props}/>
			</div>
		);
	}
}


const mapStateToProps = state => {
	return {
		tags: state.problem.tags,
		problem: state.problem.problem,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		createQuestion: (values,callback) => dispatch(actions.createQuestion(values,callback)),
		updateQuestion: (prob_id,values,callback) => dispatch(actions.updateQuestion(prob_id,values,callback)),
	};
};

export default withRouter(connect( mapStateToProps, mapDispatchToProps ) ( ProblemTab ));

