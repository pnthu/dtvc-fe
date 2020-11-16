import * as React from "react";
import { Modal, Button, Form, Input, notification } from "antd";

class ChangeProfileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      fullname: "",
    };
  }

  changeProfile = () => {
    fetch(
      `http://localhost:8080/account/updateProfile?username=${this.state.username}&fullname=${this.state.fullname}`,
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
    this.setState({ fullname: values.fullname });
    this.changeProfile();
    this.props.onCancel();
    notification.success({
      message: "Change Profile Successfully!",
      placement: "bottomLeft",
    });
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  componentDidMount = () => {
    const username = window.sessionStorage.getItem("username");
    const fullname = window.sessionStorage.getItem("fullname");
    this.setState({ username: username, fullname: fullname });
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
          initialValues={{ fullname: this.state.fullname }}
        >
          <h1 className="title-new-camera">Update Account</h1>
          <Form.Item
            label="Fullname"
            name="fullname"
            rules={[{ required: true, message: "Please input fullname" }]}
          >
            <Input placeholder="Fullname" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ChangeProfileModal;
