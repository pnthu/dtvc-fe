import * as React from "react";
import { Button, Form, Input, notification } from "antd";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ActivateAccount.css";

class ActivateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      token: "",
      status: "active",
      pageState: "",
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
    ).then((response) => {
      if (response.status === 200) {
        this.setState({ pageState: "Success" });
      } else {
        notification.error({
          message: "Activate Account Failed!",
          placement: "bottomLeft",
        });
      }
    });
  };

  checkStatus = (username) => {
    console.log("username", this.state.username, this.state.token);
    fetch(`http://localhost:8080/account/search?value=${username}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((account) => {
        if (account[0].status === "Pending") {
          this.setState({ pageState: "Activating" });
        } else {
          this.setState({ pageState: "Activated" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onFinish = (values) => {
    this.setState({ password: values.password });
    this.activateAccount();
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  componentDidMount = () => {
    const urlSearch = new URLSearchParams(this.props.location.search);
    const token = urlSearch.get("token");
    const username = urlSearch.get("username");
    this.setState({ username: username, token: token });
    //check status
    this.checkStatus(username);
  };

  render() {
    return (
      <div className="activate-box">
        <div className="inner-box">
          {this.state.pageState === "Activating" && (
            <Form
              layout="vertical"
              name="basic"
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <h1 className="title-new-camera" style={{ textAlign: "center" }}>
                Activate Your Account
              </h1>
              <div className="instruction">
                Please fill in this form in order to activate your account
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "0px 24px",
                }}
              >
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input password" },
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
                  <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item
                  label="Confirm password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Please confirm your password" },
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
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "The two passwords that you entered do not match!"
                        );
                      },
                    }),
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
              </div>
            </Form>
          )}
          {this.state.pageState === "Activated" && (
            <>
              <FontAwesomeIcon icon={faCheckCircle} size="7x" color="#009B17" />
              <div style={{ fontSize: "17px", margin: "30px 0px" }}>
                This account has been activated.
                <br />
                Please login to our system to explore further.
              </div>
              <Button
                style={{ width: "120px" }}
                className="login"
                onClick={() => this.props.history.push("/")}
                type="primary"
              >
                Back to login
              </Button>
            </>
          )}
          {this.state.pageState === "Success" && (
            <>
              <FontAwesomeIcon icon={faCheckCircle} size="7x" color="#009B17" />
              <div style={{ fontSize: "17px", margin: "30px 0px" }}>
                You are all set!
                <br />
                Your account has been activated and now you can use our system.
              </div>
              <Button
                type="primary"
                style={{ width: "120px" }}
                className="login"
                onClick={() => this.props.history.push("/")}
              >
                Back to login
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default ActivateAccount;
