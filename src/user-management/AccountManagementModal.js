import * as React from "react";
import { Modal, Button, Form, Input, notification } from "antd";
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
    });
  };

  onFinish = (values) => {
    let temp = this.state.info;
    temp.username = values.email;
    temp.fullname = values.fullname;
    this.setState({ info: temp });
    this.createUser();
    this.props.onCancel();
    notification.success({
      message: "Created Successfully!",
      placement: "bottomLeft",
    });
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
              rules={[{ required: true, message: "Please input email" }]}
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
