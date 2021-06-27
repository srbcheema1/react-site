import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Icon, Menu } from 'antd';
import _ from 'underscore';

import * as actions from '../../../../../store/actions';
import './TestcaseForm.scss';

class TestcaseForm extends Component {
	componentDidMount = () => {
		this.props.form.setFieldsValue({
			name: this.props.tc.description,
			difficulty: this.props.tc.difficulty,
			points: this.props.tc.points,
			visibility: this.props.tc.visible?"true":"false",
		});
	}

	// called with ref by parent
	update_tc = () => {
		let val = this.props.form.getFieldsValue();
		let old = {
			description: this.props.tc.description,
			difficulty: this.props.tc.difficulty,
			points: this.props.tc.points,
			visible: this.props.tc.visible,
		}
		let new_vals = {
			description: val.name,
			difficulty: val.difficulty,
			points: val.points,
			visible: val.visibility==="true" ? true : false,
		}
		if(!_.isEqual(old,new_vals)) {
			this.props.updateTestCase(this.props.p_id,this.props.tc.id,new_vals);
		}
	}
	
	delete = () => {
		this.props.deleteTestCase(this.props.p_id,this.props.tc.id);
	}

	file_download = (data,file_name) => {
		// Convert the text to BLOB.
		const textToBLOB = new Blob([data], { type: 'text/plain' });
		const sFileName = file_name;	   // The file to save the data.

		let newLink = document.createElement("a");
		newLink.download = sFileName;
		if (window.webkitURL != null) {
			newLink.href = window.webkitURL.createObjectURL(textToBLOB);
		} else {
			newLink.href = window.URL.createObjectURL(textToBLOB);
			newLink.style.display = "none";
			document.body.appendChild(newLink);
		}
		newLink.click(); 
	}

	download = () => {
		this.file_download(this.props.tc.stdin,'stdin.txt')
		this.file_download(this.props.tc.stdin,'stdout.txt')
	}

	view_on_new_tab = () => {
		var data = this.props.tc.stdin;
		let newwin = window.open();
		newwin.document.write(data)
		newwin.focus()
	}

	render() {
		const {
			getFieldDecorator,
			getFieldError,
			isFieldTouched
		} = this.props.form;

		// Only show error after a field is touched.
		const nameError = isFieldTouched("name") && getFieldError("name");
		const difficultyError = isFieldTouched("difficulty") && getFieldError("difficulty");
		const pointsError = isFieldTouched("points") && getFieldError("points");
		const visibilityError = isFieldTouched("visibility") && getFieldError("visibility");

		return (
			<div styleName="c-form">
				<Form styleName="form" layout="inline" onSubmit={this.handleSubmit}>
					<Form.Item
						label="Name"
						validateStatus={nameError ? "error" : ""}
						help={nameError || ""}
					>
						{getFieldDecorator("name", { rules: [{ required: false, message: "Please provide a name" }] })(
							<Input type="text"/>
						)}
					</Form.Item>
					<Form.Item
						label="Difficulty"
						validateStatus={difficultyError ? "error" : ""}
						help={difficultyError || ""}
					>
						{getFieldDecorator("difficulty", { rules: [{ required: false, message: "Please select a difficulty" }] })(
							<Select styleName="difficulty-select" onChange={this.handleDiffSelect}>
								<Select.Option value="EZ">Easy</Select.Option>
								<Select.Option value="MD">Medium</Select.Option>
								<Select.Option value="HD">Hard</Select.Option>
							</Select>
						)}
					</Form.Item>
					<Form.Item
						label="Points"
						validateStatus={pointsError ? "error" : ""}
						help={pointsError || ""}
					>
						{getFieldDecorator("points", { rules: [{ required: true, message: "Please provide points" }] })(
							<Input type="number" onChange={this.setPoints} styleName="points-input" />
						)}
					</Form.Item>
					<Form.Item
						label="Visibility"
						validateStatus={visibilityError ? "error" : ""}
						help={visibilityError || ""}
					>
						{getFieldDecorator("visibility", { rules: [{ required: false, message: "Please select visibility" }] })(
							<Select styleName="visibility-select" onChange={this.visibilitySelect}>
								<Select.Option value="true">True</Select.Option>
								<Select.Option value="false">False</Select.Option>
							</Select>
						)}
					</Form.Item>
				</Form>
				<div styleName="actions">
					<Icon type="download" onClick={this.download}/>
					<Icon type="delete" onClick={this.delete} />
					<Menu mode="horizontal" theme="light">
						<Menu.SubMenu title={<Icon type="eye"/>}>
							<Menu.ItemGroup>
								<Menu.Item key="input" onClick={()=>this.view_on_new_tab(this.props.tc.stdin)}> Input </Menu.Item>
								<Menu.Item key="output" onClick={()=>this.view_on_new_tab(this.props.tc.stdout)}> Output </Menu.Item>
							</Menu.ItemGroup>
						</Menu.SubMenu>
					</Menu>
					<Icon type="more" />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateTestCase: (p_id,tc_id,data) => dispatch(actions.updateTestCase(p_id,tc_id,data)),
		deleteTestCase: (p_id,tc_id) => dispatch(actions.deleteTestCase(p_id,tc_id)),
	};
};

const WrappedForm = Form.create()( TestcaseForm );

export default connect( mapStateToProps, mapDispatchToProps, null ,{forwardRef:true} ) ( WrappedForm );
