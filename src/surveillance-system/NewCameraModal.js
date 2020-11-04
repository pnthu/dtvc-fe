import * as React from "react";
import { Modal, Button, Form, Input } from "antd";
import "./NewCameraModal.css";

class NewCameraModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
    };
  }

  onFinish = (values) => {
    console.log("Success:", values);
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onOk={this.props.handleOk}
        confirmLoading={this.props.confirmLoading}
        onCancel={this.props.onCancel}
        footer={false}
      >
        <h1 className="title-new-camera">New Camera</h1>
        <Form
          layout="vertical"
          name="basic"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input camera name" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[
              { required: true, message: "Please input camera location" },
            ]}
          >
            <Input placeholder="Location" />
          </Form.Item>
          <Form.Item
            label="Group"
            name="group"
            rules={[{ required: true, message: "Please input camera group" }]}
          >
            <Input placeholder="Group" />
          </Form.Item>
          <Form.Item
            label="Position"
            name="position"
            rules={[
              { required: true, message: "Please input camera position" },
            ]}
          >
            <Input placeholder="Position" />
          </Form.Item>
          <Form.Item
            label="URL"
            name="url"
            rules={[{ required: true, message: "Please input camera URL" }]}
          >
            <Input placeholder="Camera URL" />
          </Form.Item>
          <div className="test-row">
            <span>Test connection</span>
            <Button>Connect</Button>
          </div>
          <img
            src={require("../image/black.jpg")}
            alt="Violation"
            className="test-image"
          />
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default NewCameraModal;
