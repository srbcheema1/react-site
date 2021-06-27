import React from "react";
import { Button, Modal, Select, Form, Row, Col, AutoComplete } from "antd";
import { Table, Menu, Divider, Icon, Input, Popconfirm } from "antd";
import PropTypes from "prop-types";
import * as actions from "../../store/actions";
import "./Users.scss";
import { connect } from "react-redux";
const Option = Select.Option;
const FormItem = Form.Item;
/*const MenuItemGroup = Menu.ItemGroup;
*/
class ManageRole extends React.Component {
  state = {
    current: "1",
    modalVisible: false,
    isSuperUser: false,
    ManageRoledata: {},
    editText: "",
    currentWorker: null,
    currentEntity: ""
  };

  workersColumns = [
    {
      title: "Worker Name",
      className: "column-heading",
      dataIndex: "user_name",
      key: "user_name"
    },
    {
      title: "Worker Email",
      className: "column-heading",
      dataIndex: "user_email",
      colSpan: 1,
      key: "user_email"
    },
    {
      title: "Role",
      dataIndex: "role_name",
      colSpan: 1,
      className: "column-heading",
      key: "role_name"
    },
    {
      title: "Action",
      dataIndex: "action",
      colSpan: 1,
      className: "column-heading",
      key: "action",
      render: (text, record) => (
        <span>
          <Popconfirm
            title="Are you sure to free this workers ?"
            onConfirm={() =>
              this.props.updateUserRoleInfo(record.supervisor, record.id, null)
            }
            okText="Yes"
            cancelText="No"
          >
            <Icon type="delete" />
          </Popconfirm>

          <Divider type="vertical" />
          <Icon
            style={{ cursor: "pointer" }}
            onClick={() => this.editRoleAttributeHandler(record)}
            type="edit"
          />
        </span>
      )
    }
  ];

  attrColumns = [
    {
      title: "Related Entity Type",
      className: "column-heading",
      dataIndex: "entity_type",
      key: "entity_type"
    },
    {
      title: "Entity Name",
      className: "column-heading",
      dataIndex: "attr_name",
      colSpan: 1,
      key: "attr_name"
    },
    {
      title: "Description",
      dataIndex: "attr_value",
      colSpan: 1,
      className: "column-heading",
      key: "attr_value"
    },
    {
      title: "Action",
      dataIndex: "action",
      colSpan: 1,
      className: "column-heading",
      key: "action",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure delete this user attribute ?"
          onConfirm={() =>
            this.props.deleteAttrForRoleUser(record.user_role, record.attr_id)
          }
          okText="Yes"
          cancelText="No"
        >
          <Icon type="delete" />
        </Popconfirm>
      )
    }
  ];

  roleColumns = [
    {
      title: "Worker Name",
      className: "column-heading",
      dataIndex: "user_name",
      key: "user_name"
    },
    {
      title: "Worker Email",
      className: "column-heading",
      dataIndex: "user_email",
      colSpan: 1,
      key: "user_email"
    },
    {
      title: "Role",
      dataIndex: "role_name",
      colSpan: 1,
      className: "column-heading",
      key: "role_name"
    },
    {
      title: "Action",
      dataIndex: "action",
      colSpan: 1,
      className: "column-heading",
      key: "action",
      render: (text, record) => (
        <span>
          <Popconfirm
            title="Are you sure to add this workers?"
            onConfirm={() =>
              this.props.updateUserRoleInfo(
                this.props.match.params.role_id,
                record.id,
                this.props.match.params.role_id
              )
            }
            okText="Yes"
            cancelText="No"
          >
            <Button> Add </Button>
          </Popconfirm>
        </span>
      )
    }
  ];

  componentDidMount() {
    this.setState({
      isSuperUser: window.localStorage
        .getItem("user_role")
        .includes("super-admin")
    });

    this.props.match.params.role_id
      ? this.props.getUserRoleInfo(this.props.match.params.role_id)
      : null;
  }

  handleClick = e => {
    e.key === "3"
      ? this.props.getUsersWithSpecificRole(this.props.match.params.role_name)
      : null;
    this.setState({
      current: e.key
    });
  };

  handleRoleAttributeSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {
          entity_type: values.entity_type,
          entity_id: values.entity_id.split("|")[0],
          attr_value: values.attr_value,
          attr_name: values.entity_id.split("|")[1].substring(0, 49)
          // att_name have only support of 50 charactors
        };
        this.props.attachAttrWithRoleUser(this.state.currentWorker, data);
      }
    });
  };

  editRoleAttributeHandler = record => {
    this.setState({ currentWorker: record.id, modalVisible: true });
    this.props.updateUserRoleAttrs(record.attrs);
  };
  searchEntityHandler = value => {
    if (this.state.currentEntity === "region") {
      this.props.searchCityWithState(value);
    } else {
      if (this.state.currentEntity === "college") {
        this.props.searchInstitutions(value);
      }
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    let attrType = [];
    attrType.push(<Option key="region">Region</Option>);
    attrType.push(<Option key="college">College</Option>);

    const cityOptions = [];
    this.props.cityStateList && this.state.currentEntity === "region"
      ? this.props.cityStateList.map(city => {
          cityOptions.push(
            <Option key={`${city.city_id}|${city.city}`}>{`${city.city}-${
              city.state
            }`}</Option>
          );
          return null;
        })
      : null;
    this.props.institutionDataList && this.state.currentEntity === "college"
      ? this.props.institutionDataList.map(item => {
          cityOptions.push(
            <Option key={`${item.id}|${item.name}`}>{`${item.name}-${
              item.city
            }, ${item.state}`}</Option>
          );
          return null;
        })
      : null;

    let attributeForm = this.state.modalVisible ? (
      <Form onSubmit={this.handleRoleAttributeSubmit}>
        <Row gutter={24}>
          <b>
            <center>Add Attribute</center>
          </b>
          <Col span={7}>
            <span>
              <b>Entity Type</b>
            </span>
            <FormItem>
              {getFieldDecorator("entity_type", {
                initialValue: this.state.attributes
                  ? `${this.state.attributes.entity_type}`
                  : null,
                rules: [
                  {
                    required: true,
                    message: "please mention Degree"
                  }
                ]
              })(
                <Select
                  onChange={value => this.setState({ currentEntity: value })}
                  placeholder="Role Related Entity Type"
                >
                  {attrType}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={16}>
            <span>
              <b>Entity</b>
            </span>
            <FormItem>
              {getFieldDecorator("entity_id")(
                <AutoComplete
                  placeholder={this.state.currentEntity}
                  onSearch={value => this.searchEntityHandler(value)}
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                >
                  {cityOptions}
                </AutoComplete>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={23}>
            <span>
              <b>Description</b>
            </span>
            <FormItem>
              {getFieldDecorator("attr_value", {
                rules: [
                  {
                    required: false,
                    message: "please mention Degree"
                  }
                ]
              })(<Input type="text" placeholder="Description" />)}
            </FormItem>
          </Col>
        </Row>
        <Button type="primary" htmlType="submit" style={{ marginTop: 20 }}>
          Save
        </Button>
      </Form>
    ) : null;
    let attrsEditModal = (
      <Modal
        width={1000}
        footer={null}
        title={`Add Attribute Entity`}
        visible={this.state.modalVisible}
        onCancel={() => this.setState({ modalVisible: false })}
      >
        <Table
          bordered
          size="middle"
          rowKey={record => record.attr_id}
          columns={
            this.state.isSuperUser ? this.attrColumns : ManageRole.attrColumns
          }
          dataSource={this.props.userRoleAttrs}
          expandedRowKeys={
            this.state.expandedRowKeys ? this.state.expandedRowKeys : []
          }
          expandedIconColumnIndex={0}
          expandIconAsCell={false}
        />
        {attributeForm}
      </Modal>
    );
    let currentPage = null;
    let filteredWorkers = [];

    if (
      this.props.usersWithSpecificRole &&
      this.props.userRoleInfo.child_roles
    ) {
      let currentUsers = [];
      this.props.userRoleInfo.child_roles.map(item => {
        currentUsers.push(item.id);
      });

      this.props.usersWithSpecificRole.map(user => {
        if (!currentUsers.includes(user.id)) {
          filteredWorkers.push(user);
        }
      });
    }
    if (filteredWorkers && this.props.userRoleInfo)
      // state.current is being set to "1" by default
      switch (this.state.current) {
        case "1": {
          currentPage = this.props.userRoleInfo ? (
            <React.Fragment>
              <Table
                bordered
                size="middle"
                rowKey={record => record.attr_id}
                columns={
                  this.state.isSuperUser
                    ? this.attrColumns
                    : ManageRole.attrColumns
                }
                dataSource={this.props.userRoleAttrs}
                expandedRowKeys={
                  this.state.expandedRowKeys ? this.state.expandedRowKeys : []
                }
                expandedIconColumnIndex={0}
                expandIconAsCell={false}
              />
              {this.state.isSuperUser ? (
                <Button
                  onClick={() =>
                    this.editRoleAttributeHandler(this.props.userRoleInfo)
                  }
                  style={{ marginTop: 20 }}
                >
                  Update Attribute
                </Button>
              ) : null}
            </React.Fragment>
          ) : null;
          break;
        }
        case "2": {
          currentPage = this.props.userRoleInfo ? (
            <React.Fragment>
              <Table
                bordered
                size="middle"
                rowKey={record => record.id}
                columns={
                  this.state.isSuperUser
                    ? this.workersColumns
                    : ManageRole.workersColumns
                }
                dataSource={this.props.userRoleInfo.child_roles}
                expandedRowKeys={
                  this.state.expandedRowKeys ? this.state.expandedRowKeys : []
                }
                expandedIconColumnIndex={0}
                expandIconAsCell={false}
              />
            </React.Fragment>
          ) : null;
          break;
        }
        case "3": {
          currentPage = filteredWorkers ? (
            <div>
              <h4>
                <center>Available Workers</center>
              </h4>

              <Table
                bordered
                size="middle"
                rowKey={record => record.id}
                columns={
                  this.state.isSuperUser
                    ? this.roleColumns
                    : ManageRole.roleColumns
                }
                dataSource={filteredWorkers}
                expandedRowKeys={
                  this.state.expandedRowKeys ? this.state.expandedRowKeys : []
                }
                expandedIconColumnIndex={0}
                expandIconAsCell={false}
              />
            </div>
          ) : null;
          break;
        }
      }

    return (
      <div styleName="main-form-div">
        <h3>
          <b>
            <center>
              {this.props.userRoleInfo
                ? `${this.props.userRoleInfo.user_email} with role ${
                    this.props.userRoleInfo.role_name
                  }`
                : null}
            </center>
          </b>
        </h3>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          onSelect={this.selectedMenItem}
        >
          <Menu.Item key="1">Role Profile</Menu.Item>
          {this.props.match.params.role_type === "super_role" ? (
            <Menu.Item key="2">Your Workers</Menu.Item>
          ) : null}
          {this.props.match.params.role_type === "super_role" ? (
            <Menu.Item key="3">Available Workers</Menu.Item>
          ) : null}
        </Menu>
        {currentPage}
        {attrsEditModal}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userRoleInfo: state.user.userRoleInfo,
    usersWithSpecificRole: state.user.usersWithSpecificRole,
    cityStateList: state.catalog.cityStateList,
    userRoleAttrs: state.user.userRoleAttrs,
    institutionDataList: state.user.institutionDataList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserRoleInfo: user_role_id =>
      dispatch(actions.getUserRoleInfo(user_role_id)),
    updateUserRoleAttrs: attrsData =>
      dispatch(actions.updateUserRoleAttrs(attrsData)),
    updateUserRoleInfo: (parent_role_id, user_role_id, parentSuperRole) =>
      dispatch(
        actions.updateUserRoleInfo(
          parent_role_id,
          user_role_id,
          parentSuperRole
        )
      ),
    attachAttrWithRoleUser: (user_role_id, attrsData) =>
      dispatch(actions.attachAttrWithRoleUser(user_role_id, attrsData)),
    getUsersWithSpecificRole: role_name =>
      dispatch(actions.getUsersWithSpecificRole(role_name)),
    deleteAttrForRoleUser: (user_role_id, attr_id) =>
      dispatch(actions.deleteAttrForRoleUser(user_role_id, attr_id)),
    searchCityWithState: city_prefix =>
      dispatch(actions.searchCityWithState(city_prefix)),
    searchInstitutions: institution_name =>
      dispatch(actions.searchInstitutions(institution_name))
  };
};
ManageRole.workersColumns = [
  {
    title: "Worker Name",
    className: "column-heading",
    dataIndex: "user_name",
    key: "user_name"
  },
  {
    title: "Worker Email",
    className: "column-heading",
    dataIndex: "user_email",
    colSpan: 1,
    key: "user_email"
  },
  {
    title: "Role",
    dataIndex: "role_name",
    colSpan: 1,
    className: "column-heading",
    key: "role_name"
  }
];

ManageRole.attrColumns = [
  {
    title: "Related Entity Type",
    className: "column-heading",
    dataIndex: "entity_type",
    key: "entity_type"
  },
  {
    title: "Entity Name",
    className: "column-heading",
    dataIndex: "attr_name",
    colSpan: 1,
    key: "attr_name"
  },
  {
    title: "Description",
    dataIndex: "attr_value",
    colSpan: 1,
    className: "column-heading",
    key: "attr_value"
  }
];

ManageRole.roleColumns = [
  {
    title: "Worker Name",
    className: "column-heading",
    dataIndex: "user_name",
    key: "user_name"
  },
  {
    title: "Worker Email",
    className: "column-heading",
    dataIndex: "user_email",
    colSpan: 1,
    key: "user_email"
  },
  {
    title: "Role",
    dataIndex: "role_name",
    colSpan: 1,
    className: "column-heading",
    key: "role_name"
  }
];

const WrappedManageRole = Form.create()(ManageRole);

ManageRole.propTypes = {
  getUserRoleInfo: PropTypes.func,
  updateUserRoleInfo: PropTypes.func,
  getUsersWithSpecificRole: PropTypes.func,
  attachAttrWithRoleUser: PropTypes.func,
  updateUserRoleAttrs: PropTypes.func,
  deleteAttrForRoleUser: PropTypes.func,
  searchInstitutions: PropTypes.func,
  usersWithSpecificRole: PropTypes.array,
  searchCityWithState: PropTypes.func,
  cityStateList: PropTypes.array,
  institutionDataList: PropTypes.array,
  userRoleInfo: PropTypes.object,
  userRoleAttrs: PropTypes.array,
  form: PropTypes.object,
  getFieldDecorator: PropTypes.func,
  history: PropTypes.object,
  match: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedManageRole);
