import * as React from "react";
import { Button, Form, Input } from "antd";

class ActivateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      token: "",
      status: "Active",
    };
  }

  activateAccount = () => {
    fetch(
      `http://localhost:8080/account/confirm?username=${this.state.username}&password=${this.state.password}&token=${this.state.token}&status=${this.state.status}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  };

  onFinish = (values) => {
    this.setState({ password: values.password });
    this.activateAccount();
    //dung ra la "Your account has been activated + icon checked + nut back to login"
    this.props.history.push("/");
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  componentDidMount = () => {
    const urlSearch = new URLSearchParams(this.props.location.search);
    const token = urlSearch.get("token");
    const username = urlSearch.get("username");
    this.setState({ username: username, token: token });
  };

  render() {
    return (
      <div className="container">
        <Form
          layout="vertical"
          name="basic"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <h1 className="title-new-camera">Activate Your Account</h1>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input password" }]}
          >
            <Input.Password placeholder="New password" />
          </Form.Item>
          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password" },
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login"
              style={{ width: "160px" }}
            >
              Activate Account
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default ActivateAccount;
