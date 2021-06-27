import React, { Component } from "react";
import { Modal, Button, Tabs, Form, Select, Input, Icon, Table } from "antd";
import moment from "moment";
import { connect } from 'react-redux';

import UploadBox from './UploadBox';
import * as actions from '../../store/actions';
import './InviteModal.scss';

class InviteModal extends Component {
	state = {
		test_id:null,
	}

	init = (test_id) => {
		// to be called by parent component
		this.props.sendInvitesShow()
		this.setState({test_id});
	}

	handleCancel = () => {
		this.props.sendInvitesHide()
	};
	
	render() {
		return (
			<React.Fragment>
				<Modal styleName="c-invite"
					title={this.props.success?"":(<b>Send Invites</b>)}
					onCancel={this.handleCancel}
					visible={this.props.visible}
					footer={null}
					width='460px'
				>
					{this.props.success?(
						<div styleName="c-success">
							<div styleName="c-success__message">
								<p>The invites have been successfully sent</p>
								<Button onClick={this.handleCancel}>Close</Button>
							</div>
						</div>
					):(
						<Tabs defaultActiveKey="1">
							<Tabs.TabPane tab="Single" key="1">
								<WrappedSingleInvite
									handleCancel={this.handleCancel}
									email_templates={this.props.email_templates}
									invite={this.props.invite}
									test_id={this.state.test_id}
									loading={this.props.loading}
								/>
							</Tabs.TabPane>
							<Tabs.TabPane tab="Bulk" key="2">
								<WrappedBulkInvite
									handleCancel={this.handleCancel}
									email_templates={this.props.email_templates}
									invite={this.props.invite}
									test_id={this.state.test_id}
									loading={this.props.loading}
									uploadCSV={this.props.uploadCSV}
									bulk_ready={this.props.bulk_ready}
									setBulkReady={this.props.setBulkReady}
								/>
							</Tabs.TabPane>
						</Tabs>
					)}
				</Modal>
			</React.Fragment>
		);
	}
}


class SingleInvite extends Component {
	state = {
		name:"",
		email:"",
		template:"",
		expiry_time:"60",
	}

	componentDidMount() {
		// To disabled submit button at the beginning.
		// highly important
		this.props.form.validateFields();
		this.props.form.setFieldsValue({
			expiry:this.state.expiry_time,
		})
	}
	
	hasErrors = fieldsError => {
		return Object.keys(fieldsError).some(field => fieldsError[field]);
	}

	handleChange = (e) => {
		const name = e.target.name;
		this.setState({
			[name]: e.target.value
		});
	}

	selectTemplate = t => {
		this.setState({template:t})
	}

	setExpiry = e => {
		this.setState({expiry_time:e.target.value})
	}

	sendInvite = () => {
		let invitedata = {
			full_name: this.state.name,
			email_id: this.state.email,
			expiry_datetime: moment().add(this.state.expiry_time,'minutes').format(),
			email_template: this.state.template
		}
		this.props.invite([invitedata],this.props.test_id);
	}

	render() {
		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
		const usernameError = isFieldTouched('username') && getFieldError('username');
		const emailError = isFieldTouched('email') && getFieldError('email');
		const templateError = isFieldTouched('email_template') && getFieldError('email_template');
		const expiryError = isFieldTouched('expiry') && getFieldError('expiry');
		return (
			<Form styleName="c-singleinvite">
				<Form.Item label="Full Name" validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
					{getFieldDecorator('username', {
						rules: [{ required: true, message: 'Please input your username!' }],
					})( <Input name="name" onChange={this.handleChange}/> )}
				</Form.Item>
				<Form.Item label="E-mail" validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
					{getFieldDecorator('email', {
						rules: [
							{
								type: 'email',
								message: 'The input is not valid E-mail!',
							},
							{
								required: true,
								message: 'Please input your E-mail!',
							},
						],
					})(<Input name="email" onChange={this.handleChange}/>)}
				</Form.Item>
				<Form.Item
					validateStatus={expiryError ? "error" : ""}
					help={expiryError || ""}
					label="Expiry Time (mins)"
				>
					{getFieldDecorator("expiry", {
						rules: [{ required: true, message: "Please input expiry time in minutes" }]
					})(
						<Input
							type="number"
							onChange={this.setExpiry}
						/>
					)}
				</Form.Item>
				<Form.Item label="Select Email Template : " validateStatus={templateError ? 'error' : ''} help={templateError || ''}>
					{getFieldDecorator('email_template', {
						rules: [{
								required: true,
								message: 'Please select a template for email!',
						}]
					})(
						<Select styleName="" name="template" onChange={this.selectTemplate}>
							{this.props.email_templates.map(t => (
								<Select.Option key={t.id} value={t.id}>{t.subject}</Select.Option>
							))}
						</Select>
					)}
				</Form.Item>
				<Form.Item>
					<div styleName="c-singleinvite__footer">
						<Button onClick={this.props.handleCancel}>Cancel</Button>
						<Button style={{marginLeft:'10px'}} type="primary" onClick={this.sendInvite} disabled={this.hasErrors(getFieldsError())}>
							{this.props.loading && <Icon type="loading" />} Send
						</Button>
					</div>
				</Form.Item>
			</Form>
		);
	}
}

const WrappedSingleInvite = Form.create({ name: 'single_invite' })(SingleInvite);




class BulkInvite extends Component {
	state={
		users:[],
		selected:[],
		template:"",
		expiry_time:"60",

		invalid:0,
		total:0,
		invalid_url:"",
	}

	componentDidMount() {
		// To disabled submit button at the beginning.
		// highly important
		this.props.form.validateFields();
	}

	componentDidUpdate(prevProps) {
		if(prevProps.bulk_ready !== this.props.bulk_ready) {
			this.props.form.validateFields();
			this.props.form.setFieldsValue({
				expiry:this.state.expiry_time,
			})
		}
	}

	uploaded = (res) => {
		this.props.setBulkReady(true)
		this.setState({
			users:res.valid_entities,
			invalid:res.invalid_count,
			total:res.total_count,
			invalid_url:res.invalid_entites_url
		})
	}

	downloadInvalid = () => {
		window.location.href = this.state.invalid_url;
	}

	hasErrors = fieldsError => {
		if(this.state.selected.length===0) return true;
		return Object.keys(fieldsError).some(field => fieldsError[field]);
	}

	selectTemplate = t => {
		this.setState({template:t})
	}

	setExpiry = e => {
		this.setState({expiry_time:e.target.value})
	}

	sendInvite = () => {
		let invitedata = this.state.selected.map(data=>({
			full_name: data.name,
			email_id: data.email,
			expiry_datetime: moment().add(this.state.expiry_time,'minutes').format(),
			email_template: this.state.template
		}))
		this.props.invite(invitedata,this.props.test_id);
	}

	columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			className: 'table-name',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			className: 'table-email',
		},
	]

	render() {
		let index=-1;
		const data = this.state.users.map(function(data) {
			index++;
			return {index,key:index, ...data}
		})
		
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({selected:selectedRows})
			},
			getCheckboxProps: record => ({
				// disabled: record.full_name === 'Sarbjit Singh', // we wont be able to select such row
				index: record.index,
			}),
			selectedRowKeys: this.state.selected.map(s=>s.key),
		};

		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
		const templateError = isFieldTouched('email_template') && getFieldError('email_template');
		const expiryError = isFieldTouched('expiry') && getFieldError('expiry');
		return (
			<Form>
				{this.props.bulk_ready ? (
					<React.Fragment>
						<Form.Item>
							<Table
								styleName="bulk-table"
								columns={this.columns}
								dataSource={data}
								pagination={false}
								rowSelection={rowSelection}
							/>
						</Form.Item>
						{this.state.invalid > 0 && (
							<Form.Item>
								<div styleName="invalid-entities">
									<div>
										<i>
											{this.state.invalid} of {this.state.total} records in the uploaded file
											are invalid. You can download the invalid records.
										</i>
									</div>
									<Button onClick={this.downloadInvalid}>Download CSV</Button>
								</div>
							</Form.Item>
						)}
						<Form.Item
							validateStatus={expiryError ? "error" : ""}
							help={expiryError || ""}
							label="Expiry Time (mins)"
						>
							{getFieldDecorator("expiry", {
								rules: [{ required: true, message: "Please input expiry time in minutes" }]
							})(
								<Input
									type="number"
									onChange={this.setExpiry}
								/>
							)}
						</Form.Item>
						<Form.Item label="Select Email Template : " validateStatus={templateError ? 'error' : ''} help={templateError || ''}>
							{getFieldDecorator('email_template', {
								rules: [{
										required: true,
										message: 'Please select a template for email!',
								}]
							})(
								<Select styleName="" name="template" onChange={this.selectTemplate}>
									{this.props.email_templates.map(t => (
										<Select.Option key={t.id} value={t.id}>{t.subject}</Select.Option>
									))}
								</Select>
							)}
						</Form.Item>
						<Form.Item>
							<div styleName="c-bulkinvite__footer">
								<div styleName="c-bulkinvite__footer-left">
									{this.state.selected.length} of {data.length} selected
								</div>
								<div styleName="c-bulkinvite__footer-right">
									<Button onClick={this.props.handleCancel}>Cancel</Button>
									<Button style={{marginLeft:'10px'}} type="primary" onClick={this.sendInvite} disabled={this.hasErrors(getFieldsError())}>
										{this.props.loading && <Icon type="loading" />} Send
									</Button>
								</div>
							</div>
						</Form.Item>
					</React.Fragment>
				):(
					<UploadBox
						uploadCSV={this.props.uploadCSV}
						loading={this.props.loading}
						onSuccess={this.uploaded}
						onError={(err)=>{console.log(err)}}
					/>
				)}
			</Form>
		);
	}
}

const WrappedBulkInvite = Form.create({ name: 'bulk_invite' })(BulkInvite);

const mapStateToProps = state => {
	return {
		email_templates: state.invite.email_templates,
		loading: state.invite.inviteModal.loading,
		visible: state.invite.inviteModal.visible,
		success: state.invite.inviteModal.success,
		error: state.invite.inviteModal.error,
		bulk_ready: state.invite.inviteModal.bulk_ready,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		invite: (invitesdata,test_id) => dispatch(actions.sendInvites(invitesdata,test_id)),
		sendInvitesShow: ()=>dispatch(actions.sendInvitesShow()),
		sendInvitesHide: ()=>dispatch(actions.sendInvitesHide()),
		uploadCSV: (obj) => dispatch(actions.uploadCSV(obj)),
		setBulkReady: (status) => dispatch(actions.setBulkReady({status}))
	};
};

InviteModal.propTypes = {
};

export default connect( mapStateToProps, mapDispatchToProps, null ,{forwardRef:true} )( InviteModal );