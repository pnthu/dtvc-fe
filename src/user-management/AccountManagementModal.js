import * as React from "react";
import { Modal, Button, Form, Input, Typography, notification } from "antd";
import "./AccountManagementModal.css";

class AccountManagementModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      info: {
        username: "",
        fullname: "",
        status: "Pending",
        role: {
          roleId: 2,
          name: "moderator",
        },
      },
      error: null,
    };
  }

  createUser = () => {
    fetch("http://localhost:8080/account/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.info),
    }).then((Response) => {
      if (Response.status === 200) {
        notification.success({
          message: "Create user succcessfully!",
          placement: "bottomLeft",
        });
        this.props.onCancel();
        window.location.reload();
      } else if (Response.status === 400) {
        this.setState({ error: "This email has been used" });
      } else {
        notification.error({
          message: "Create camera failed!",
          placement: "bottomLeft",
        });
      }
    });
  };

  onFinish = (values) => {
    let temp = this.state.info;
    temp.username = values.email;
    temp.fullname = values.fullname;
    this.setState({ info: temp });
    this.createUser();
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    return (
      <>
        <Modal
          visible={this.props.visible}
          onOk={this.props.handleOk}
          onCancel={this.props.onCancel}
          footer={false}
          className="create-modal"
        >
          <h1 className="title-new-camera">New Account</h1>
          <Form
            layout="vertical"
            name="basic"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Fullname"
              name="fullname"
              rules={[{ required: true, message: "Please input fullname" }]}
            >
              <Input placeholder="Fullname" />
            </Form.Item>
            {this.state.error !== null && (
              <Typography.Text type="danger">
                {this.state.error}
              </Typography.Text>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login">
                Create
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default AccountManagementModal;
