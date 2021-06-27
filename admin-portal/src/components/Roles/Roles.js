import React from 'react';
import { Table, Form, Input, Button } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import {get_service_endpoint} from '../../ServiceEndpoints.js';
import './Roles.scss';

const ep = get_service_endpoint('cs-auth') 
const FormItem = Form.Item;

const columns = [ 
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    key: 'description'
  }
]

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Roles extends React.Component {
  state = {
    roles: []
  }

  propTypes = {
    form: PropTypes,
    validate: PropTypes.oneOfType([
        PropTypes.func, PropTypes.bool,
      ]),
    getFieldDecorator: PropTypes.isRequired
  }

  componentWillMount() {
    this.loadRoles();
  }

  loadRoles() {
    axios.get(`${ep}/api/roles/`)
    .then(response=>{
        this.setState({
          roles: response.data.items
        })
    })
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    window.console.log(this.props.form.validateFields)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        window.console.log('Received values of form: ', values);
        this.addRoleHandler(values);
      }
    });
  }

  addRoleHandler = (values) => {
      axios.post(`${ep}/api/roles/`, {
          name: values.name,
          description: values.description
      })
        .then( response => {
            window.console.log(response.data)
            let prev_roles = [...this.state.roles]
            this.setState({
              roles: [...prev_roles, response.data]
            })
            if(response.data.name === values.name){
              this.props.form.resetFields();
            }
        }) 
        .catch(function (error){
            window.console.log(error);
        })
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const nameError = isFieldTouched('name') && getFieldError('name');
    const descriptionError = isFieldTouched('description') && getFieldError('description');
    return(
      <div>
      <div styleName="">
        <div styleName="create-role-div">
        <h4> CREATE ROLE:</h4>
        <Form styleName="create-role-form" onSubmit={this.handleSubmit}>
                <FormItem
                  style={{"width": "400px"}}
                    validateStatus={nameError ? 'error' : ''}
                    help={nameError || ''}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please enter role name!' }],
                  })(
                    <Input placeholder="Role Name" />
                  )}
                </FormItem>
                <FormItem
                style={{"width": "400px"}}
                  validateStatus={descriptionError ? 'error' : ''}
                  help={descriptionError || ''}>
                  {getFieldDecorator('description', {
                    rules: [{ required: true, message: 'Please enter role description!' }],
                  })(
                    <Input placeholder="Role Description" />
                  )}
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}>
                    Add Role
                  </Button>
                </FormItem>
          </Form>
          </div>
          {(this.state.roles[0] !== null) ?
            <Table 
              styleName="table-roles" 
              columns={columns} 
              pagination={false}
              dataSource={this.state.roles}/> : null
          }
          </div>
      </div>
      );
  }
}

const WrappedRolesForm = Form.create()(Roles);

export default WrappedRolesForm;