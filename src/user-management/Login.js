import * as React from "react";
import "antd/dist/antd.css";
import { Button, Input, Form, Typography } from "antd";
import "./Login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  login = (values) => {
    this.props.login(values);
  };

  render() {
    console.log("props", this.props);
    return (
      <div className="loginBackground">
        <h1 className="loginTitle">Traffic Violation Detection System</h1>
        <img src={require("../logo.svg")} alt="logo" className="logo" />
        {this.props.error !== null && (
          <Typography.Text type="danger" style={{ textAlign: "left" }}>
            {this.props.error}
          </Typography.Text>
        )}
        <Form name="basic" style={{ width: "40%" }} onFinish={this.login}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login">
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Login;
