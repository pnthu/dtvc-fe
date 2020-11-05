import * as React from "react";
import { Modal, Button, Form, Input } from "antd";

class ChangePasswordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      oldPassword: "",
      newPassword: "",
    };
  }

  changeProfile = () => {
    fetch(
      `http://localhost:8080/account/updateProfile?username=${this.state.username}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  };

  componentDidMount = () => {
    this.setState({ username: "a@gmail.com" });
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        footer={false}
      >
        <Form
          layout="vertical"
          name="basic"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <h1 className="title-new-camera">Change Password</h1>
          <Form.Item
            label="Old password"
            name="oldPassword"
            rules={[{ required: true, message: "Please input old password" }]}
          >
            <Input placeholder="Old password" />
          </Form.Item>
          <Form.Item
            label="New password"
            name="newPassword"
            rules={[{ required: true, message: "Please input old password" }]}
          >
            <Input placeholder="New password" />
          </Form.Item>
          <Form.Item
            label="Confirm new password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your new password" },
            ]}
          >
            <Input placeholder="Confirm new password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login"
              style={{ width: "160px" }}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ChangePasswordModal;
