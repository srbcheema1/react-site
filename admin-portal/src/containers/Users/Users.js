import React, { Component } from "react";
import { Button, Table, AutoComplete, Select } from "antd";
import "./Users.scss";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { Form, Row, Col, Switch } from "antd";
import { withRouter } from "react-router";
/*import { Link } from "react-router-dom";*/
const FormItem = Form.Item;
const Option = Select.Option;

class UserSearch extends Component {
  state = {
    expandedRowKeys: [],
    isSuperUser: window.localStorage
      .getItem("user_role")
      .includes("super-admin"),
    currentPage: 1,
    currentUser: {}
  };

  columns = [
    {
      title: "USER NAME",
      className: "column-heading",
      dataIndex: "username",
      colSpan: 1,
      key: "username"
    },
    {
      title: "EMAIL",
      className: "column-heading",
      dataIndex: "email",
      colSpan: 1,
      key: "email"
    },
    {
      title: "Is Active",
      dataIndex: "action",
      className: "column-heading",
      key: "action",
      render: (text, record) => (
        <span>
          <Switch
            key={record.id}
            checked={record.is_active}
            checkedChildren="Deactivate" unCheckedChildren="Activate"
            onChange={checked =>
              this.props.updateUserActivationStatus(
                record.id,
                checked,
                this.props.searchData,
                this.state.limit,
                this.state.offset
              )
            }
          />
        </span>
      )
    }
  ];
  componentDidMount() {
    window.localStorage.getItem("user_role").includes("super-admin")
      ? this.props.getUsersData({})
      : this.props.getUsersData(
          { user_id: window.localStorage.getItem("user_id") },
          null,
          null
        );

    this.props.getRoles();
  }

  loadData = (pageNum, pageSize) => {
    pageNum = pageNum || 1;
    pageSize = pageSize || 25;
    let offset = (pageNum - 1) * pageSize;
    let limit = pageSize;
    this.props.getUsersData(this.props.searchData, limit, offset);
    this.setState({ currentPage: pageNum, limit: limit, offset: offset });
  };

  onUserRowExpand = (expanded, record) => {
    if (expanded) {
      this.setState({ currentUser: record });
      this.props.getaUserDetails(record.key);
    }
  };

  handleRoleChange = (role_id, checked) => {
    checked
      ? this.props.assignRoleToUser(this.state.currentUser.key, role_id)
      : this.props.deleteRoleofUser(this.state.currentUser.key, role_id);
  };

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.getUsersData(values, null, null);
    });
    this.setState({ currentPage: 1 });
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({ currentPage: 1 });
  };

  handleRolePage = role_id => {
    let role = this.props.userRoles.filter(role => role.role === role_id);
    this.props.history.push(
      `/admin/${role[0].role_type}/${role[0].role_name}/${role[0].id}`
    );
  };

  // To generate mock Form.Item
  getFields() {
    const { getFieldDecorator } = this.props.form;
    const roles = [];
    roles.push(
      <Option key="ALL" value={null}>
        ALL
      </Option>
    );

    this.props.roles.map(role => {
      roles.push(<Option key={role.id}>{role.name}</Option>);
      return null;
    });

    let children = this.state.isSuperUser ? (
      <div styleName="search-box-div">
        <Row>
          <Col span={21} />
          <Col span={3}>
            <Button
              onClick={() =>
                this.props.getUsersData(
                  { user_id: window.localStorage.getItem("user_id") },
                  null,
                  null
                )
              }
            >
              Your Role Profile
            </Button>
          </Col>
        </Row>
        <Row styleName="search-title">
          <h2>
            <center>Manage User and Roles</center>
          </h2>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <span>
              {" "}
              <b>Email </b>
            </span>
            <FormItem>
              {getFieldDecorator("email")(
                <AutoComplete size="large" placeholder="Email" />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <span>
              {" "}
              <b>Roles</b>{" "}
            </span>
            <FormItem>
              {getFieldDecorator("role_id")(
                <Select
                  size="large"
                  placeholder="Users Roles"
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  showSearch
                >
                  {roles}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <FormItem>
              {getFieldDecorator("username")(
                <AutoComplete size="large" placeholder="User Name" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <Button
              styleName="search-btn"
              type="primary"
              size="large"
              icon="search"
              htmlType="submit"
            >
              Search
            </Button>
          </Col>
          <Col span={2}>
            <Button
              styleName="reset-btn"
              size="large"
              type="primary"
              onClick={this.handleReset}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </div>
    ) : null;
    return children;
  }

  render() {
    const roleOptions = [];

    this.props.currentUser &&
    this.props.currentUser === this.state.currentUser.key
      ? this.props.roles.map(role => {
          this.props.role_ids.includes(role.id)
            ? roleOptions.push(
                <Row key={role.id} span={24} gutter={100}>
                  <Col span={8} style={{ marginBottom: 10 }}>
                    <b>{role.name.toUpperCase()}</b>
                  </Col>
                  <Col span={8} style={{ marginBottom: 10 }}>
                    <Switch
                      key={role.id}
                      checked={true}
                      onChange={checked =>
                        this.handleRoleChange(role.id, checked)
                      }
                    />
                  </Col>
                  <Col span={8} style={{ marginBottom: 10 }}>
                    <Button onClick={() => this.handleRolePage(role.id)}>
                      More Action
                    </Button>
                  </Col>
                </Row>
              )
            : this.state.isSuperUser
              ? roleOptions.push(
                  <Row key={role.id} span={24} gutter={100}>
                    <Col span={8} style={{ marginBottom: 10 }}>
                      <b>{role.name.toUpperCase()}</b>
                    </Col>
                    <Col span={4} style={{ marginBottom: 10 }}>
                      <Switch
                        key={role.id}
                        checked={false}
                        onChange={checked =>
                          this.handleRoleChange(role.id, checked)
                        }
                      />
                    </Col>
                  </Row>
                )
              : null;
        })
      : null;
    let userDetails = (
      <div styleName="display-box-div">
        <h3 styleName="search-title">
          <b>
            <center>
              Manage Roles for{" "}
              {this.state.currentUser
                ? this.state.currentUser.username
                : "Current User"}
            </center>
          </b>
        </h3>
        <Row style={{ margin: 20 }}>
          <Col span={16} style={{ marginBottom: 20 }}>
            <b>Role</b>
          </Col>
          <Col span={4} style={{ marginBottom: 20 }}>
            <b>
              <center>User Role Status</center>
            </b>
          </Col>
          {roleOptions}
        </Row>
      </div>
    );

    let searchData = (
      <div>
        <Table
          size="middle"
          styleName="search-table"
          columns={this.columns}
          dataSource={this.props.users}
          onExpand={this.onUserRowExpand}
          expandedRowRender={() => userDetails}
          expandedRowKeys={
            this.state.currentUser ? [this.state.currentUser.key] : []
          }
          expandedIconColumnIndex={0}
          pagination={{
            defaultPageSize: 10,
            current: this.state.currentPage,
            total: this.props.total,
            onChange: this.loadData,
            showTotal: (total, range) =>
              `${range[1] ? range[0] : 0} to ${range[1]} of ${total} Users`,
            position: "top"
          }}
          expandIconAsCell={false}
        />
      </div>
    );

    let inputData = (
      <div styleName="search-table">
        <Form styleName="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>{this.getFields()}</Row>
          <Row />
        </Form>
      </div>
    );

    return (
      <div styleName="main-div">
        {inputData}
        {searchData}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.user.users,
    pageSize: state.user.pageSize,
    total: state.user.totalUsers,
    roles: state.user.roles,
    searchData: state.user.searchData,
    userRoles: state.user.userRoles,
    role_ids: state.user.role_ids,
    currentUser: state.user.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getRoles: () => dispatch(actions.getRoles()),
    getUsersData: (searchData, limit, offset) =>
      dispatch(actions.getUsersData(searchData, limit, offset)),
    getChoiceMapping: () => dispatch(actions.getChoiceMapping()),
    getaUserDetails: user_id => dispatch(actions.getaUserDetails(user_id)),
    assignRoleToUser: (user_id, role_id) =>
      dispatch(actions.assignRoleToUser(user_id, role_id)),
    deleteRoleofUser: (user_id, role_id) =>
      dispatch(actions.deleteRoleofUser(user_id, role_id)),
    updateUserActivationStatus: (user_id, status, searchData, limit, offset) =>
      dispatch(
        actions.updateUserActivationStatus(
          user_id,
          status,
          searchData,
          limit,
          offset
        )
      )
  };
};

const WrappedUserSearchForm = Form.create()(UserSearch);

UserSearch.propTypes = {
  getUsersData: PropTypes.func,
  getRoles: PropTypes.func,
  getaUserDetails: PropTypes.func,
  assignRoleToUser: PropTypes.func,
  deleteRoleofUser: PropTypes.func,
  users: PropTypes.array,
  roles: PropTypes.array,
  userRoles: PropTypes.array,
  role_ids: PropTypes.array,
  currentUser: PropTypes.string,
  pageSize: PropTypes.number,
  total: PropTypes.number,
  searchData: PropTypes.object,
  expandedRowKeys: PropTypes.string,
  form: PropTypes.object,
  resetFields: PropTypes.func,
  updateUserActivationStatus: PropTypes.func,
  // getFieldDecorator: PropTypes.isRequired,
  history: PropTypes.object
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(WrappedUserSearchForm)
);
