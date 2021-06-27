import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';
const FormItem = Form.Item;


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Signup extends React.Component {
  propTypes = {
    form: PropTypes,
    validate: PropTypes.oneOfType([
        PropTypes.func, PropTypes.bool,
      ])
  }
  componentWillMount() {
    this.userName = this.props.form.getFieldDecorator('userName', {
        initialValue: '',
              rules: [{
                required: true,
                message: 'Enter user name',
              }],
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        window.console.log('Received values of form: ', values);
        this.signupHandler(values);
      }
    });
  }

  signupHandler(values){
      axios.post("http://127.0.0.1:8000/api/signup/", {
          password: values.password,
          email: values.email
      })
        .then( response => {
            window.console.log(response.data)
        })
        .catch(function (error){
            window.console.log(error);
        })
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (

      <Form className="" onSubmit={this.handleSubmit}>
        <FormItem
          style={{"width": "400px"}}
          validateStatus={userNameError ? 'error' : ''}
          help={userNameError || ''}>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your Email!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem
          style={{"width": "400px"}}
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError || ''}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}>
            Signup
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedSignupForm = Form.create()(Signup);

export default WrappedSignupForm;