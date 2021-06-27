import React from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import "./Login.scss";
import * as actions from "../../store/actions";
import { connect } from "react-redux";
const FormItem = Form.Item;

function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Login extends React.Component {

	componentDidMount() {
		// To disabled submit button at the beginning.
		this.props.form.validateFields();
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.props.loginHandler(values);
			}
		});
	};

	render() {
		const {
			getFieldDecorator,
			getFieldsError,
			getFieldError,
			isFieldTouched
		} = this.props.form;

		// Only show error after a field is touched.
		const userNameError =
			isFieldTouched("userName") && getFieldError("userName");
		const passwordError =
			isFieldTouched("password") && getFieldError("password");
		return (
			<Form styleName="form" onSubmit={this.handleSubmit}>
				<FormItem
					validateStatus={userNameError ? "error" : ""}
					help={userNameError || ""}
				>
					{getFieldDecorator("email", {
						rules: [{ required: true, message: "Please input your Email!" }]
					})(
						<Input
							prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
							placeholder="Username"
						/>
					)}
				</FormItem>
				<FormItem
					validateStatus={passwordError ? "error" : ""}
					help={passwordError || ""}
				>
					{getFieldDecorator("password", {
						rules: [{ required: true, message: "Please input your Password!" }]
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
							type="password"
							placeholder="Password"
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('remember', {
						valuePropName: 'checked',
						initialValue: true,
					})(<Checkbox>Keep me signed</Checkbox>)}
					<Link styleName="form__forgot" to="">
						Forgot Password?
					</Link>
					<Button type="primary" htmlType="submit" styleName="form__button" disabled={hasErrors(getFieldsError())}>
						Log in
					</Button>
				</FormItem>
			</Form>
		);
	}
}

const mapStateToProps = () => {
	return {
	};
};

const mapDispatchToProps = dispatch => {
	return {
		loginHandler: values => dispatch(actions.loginHandler(values)),
	};
};

Login.propTypes = {
	form: PropTypes.object,
	validate: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
	getFieldDecorator: PropTypes.func,
	loginHandler: PropTypes.func,
};


const WrappedLoginForm = Form.create()(Login);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedLoginForm);
