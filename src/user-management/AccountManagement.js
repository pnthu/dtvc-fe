import * as React from "react";
import { Button, Table, Switch } from "antd";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "antd/dist/antd.css";
import "./AccountManagement.css";
import AccountManagementModal from "./AccountManagementModal";

class AccountManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      data: [],
    };
  }

  columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Email",
      dataIndex: "username",
      key: "email",
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Switch
          style={{ width: "75px" }}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          defaultChecked={record.status === "Active"}
        />
      ),
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

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      ModalText: "Creating new camera",
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount = () => {
    this.fetchUsers();
  };

  render() {
    return (
      <>
        <div className="background">
          <div className="box">
            <h2 className="title">Account Management</h2>
            <div className="parent-create-new">
              <Button onClick={this.showModal}>
                <FontAwesomeIcon icon={faPlus} />
                <span className="new-camera">New Account</span>
              </Button>
            </div>
            <div className="camera-table">
              <Table
                className="table"
                columns={this.columns}
                dataSource={this.state.data}
                pagination={{ defaultCurrent: 1, total: 10, pageSize: 10 }}
              />
            </div>
          </div>
        </div>
        <AccountManagementModal
          handleOk={this.handleOk}
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        />
      </>
    );
  }
}

export default AccountManagement;
