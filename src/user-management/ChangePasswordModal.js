import * as React from "react";
import { Modal, Button, Form, Input, Typography, notification } from "antd";

class ChangePasswordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      error: null,
    };
    this.formRef = React.createRef();
  }

  changePassword = () => {
    fetch(
      `http://localhost:8080/account/updatePassword?username=${this.state.username}&oldPassword=${this.state.oldPassword}&newPassword=${this.state.newPassword}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((Response) => {
        if (Response.status === 200) {
          notification.success({
            message: "Change Password Successfully!",
            placement: "bottomLeft",
          });
          this.setState({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          this.formRef.current.setFieldsValue({ ...this.state });
          this.props.onCancel();
        } else {
          notification.error({
            message: "Change Password Failed!",
            description: "Wrong current password. Please check again.",
            placement: "bottomLeft",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkOldPassword = (password) => {
    const username = window.sessionStorage.getItem("username");
    fetch(
      `http://localhost:8080/account/checkOldPassword?username=${username}&password=${password}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((Response) => Response.json())
      .then((matched) => {
        if (matched) {
          this.changePassword();
        } else {
          this.setState({ error: "You entered wrong password" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onFinish = (values) => {
    this.setState({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
    this.checkOldPassword(values.oldPassword);
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  componentDidMount = () => {
    const username = window.sessionStorage.getItem("username");
    this.setState({ username: username });
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
          ref={this.formRef}
        >
          <h1 className="title-new-camera">Change Password</h1>
          <Form.Item
            label="Old password"
            name="oldPassword"
            rules={[
              { required: true, message: "Please input old password" },
              {
                min: 8,
                message: "Password cannot be less than 8 characters",
              },
              {
                pattern: new RegExp(/[A-Za-z]+[0-9]+|[0-9]+[A-Za-z]+/g),
                message: "Password must contain letters and numbers",
              },
            ]}
          >
            <Input.Password
              placeholder="Old password"
              value={this.state.oldPassword}
            />
          </Form.Item>
          <Form.Item
            label="New password"
            name="newPassword"
            rules={[
              { required: true, message: "Please input new password" },
              {
                min: 8,
                message: "Password cannot be less than 8 characters",
              },
              {
                pattern: new RegExp(/[A-Za-z]+[0-9]+|[0-9]+[A-Za-z]+/g),
                message: "Password must contain letters and numbers",
              },
            ]}
          >
            <Input.Password
              placeholder="New password"
              value={this.state.newPassword}
            />
          </Form.Item>
          <Form.Item
            label="Confirm new password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              {
                min: 8,
                message: "Password cannot be less than 8 characters",
              },
              {
                pattern: new RegExp(/[A-Za-z]+[0-9]+|[0-9]+[A-Za-z]+/g),
                message: "Password must contain letters and numbers",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "The two passwords that you entered do not match!"
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm new password"
              value={this.state.confirmPassword}
            />
          </Form.Item>
          {this.state.error !== null && (
            <Typography.Text type="danger" style={{ textAlign: "left" }}>
              {this.state.error}
            </Typography.Text>
          )}
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
