import * as React from "react";
import { Button, Table, Switch, Input, Select, notification } from "antd";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "antd/dist/antd.css";
import "./AccountManagement.css";
import AccountManagementModal from "./AccountManagementModal";

class AccountManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      confirmLoading: false,
      data: [],
    };
  }

  columns = [
    {
      title: "Email",
      dataIndex: "username",
      key: "email",
      width: "40%",
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
      width: "30%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "30%",
      render: (text, record) => {
        let self = this;
        return (
          <Switch
            style={{ width: "75px" }}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            checked={record.status === "active"}
            onClick={(checked, evt) => {
              self.tempRecord = record;
              self.onSwitch(checked);
            }}
          />
        );
      },
    },
  ];

  fetchUsers = (value = "") => {
    fetch(`http://localhost:8080/account/search?value=${value}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((accounts) => {
        this.setState({ data: accounts });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  filterByNameAndStatus = (status = "", name = "") => {
    fetch(
      `http://localhost:8080/account/filterByStatusAndName?status=${status}&fullname=${name}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((Response) => Response.json())
      .then((accounts) => {
        this.setState({ data: accounts });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateStatus = async (record) => {
    const status = record.status;
    await fetch(
      `http://localhost:8080/account/updateStatus?username=${record.username}&status=${record.status}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      }
    ).then((Response) => {
      if (status === "Active") {
        if (Response.status === 200) {
          notification.success({
            message: "Activate Account Successfully!",
            placement: "bottomLeft",
          });
        } else {
          notification.error({
            message: "Activate Account Failed!",
            placement: "bottomLeft",
          });
        }
      } else {
        if (Response.status === 200) {
          notification.success({
            message: "Deactivate Account Successfully!",
            placement: "bottomLeft",
          });
        } else {
          notification.error({
            message: "Deactivate Account Failed!",
            placement: "bottomLeft",
          });
        }
      }
    });
    this.fetchUsers();
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onSearch = (value) => {
    this.filterByNameAndStatus("", value);
  };

  onSelectedStatus = (value, option) => {
    this.filterByNameAndStatus(value);
  };

  onSwitch = async (checked) => {
    let newStatus;
    let record = this.tempRecord;
    if (checked) {
      newStatus = "active";
    } else {
      newStatus = "inactive";
    }
    record.status = newStatus;
    await this.updateStatus(record);
    window.location.reload();
  };

  componentDidMount = () => {
    this.setState({ loading: true });
    this.fetchUsers();
    this.setState({ loading: false });
  };

  render() {
    return (
      <>
        <div className="background">
          <div className="box">
            <h2 className="title">Account Management</h2>
            <div className="top-row">
              <div className="camera-filter">
                <Input.Search
                  placeholder="Fullname"
                  style={{ width: "50%" }}
                  onSearch={this.onSearch}
                />
                <Select
                  defaultValue=""
                  placeholder="Status"
                  style={{ width: "40%" }}
                  onChange={this.onSelectedStatus}
                >
                  <Select.Option value="">All Status</Select.Option>
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
              </div>
              <div className="new-btn">
                <Button onClick={this.showModal}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span className="new-camera">New Account</span>
                </Button>
              </div>
            </div>
            <Table
              loading={this.state.loading}
              className="table"
              columns={this.columns}
              dataSource={this.state.data}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </div>
        <AccountManagementModal
          visible={this.state.visible}
          onCancel={this.handleCancel}
        />
      </>
    );
  }
}

export default AccountManagement;
