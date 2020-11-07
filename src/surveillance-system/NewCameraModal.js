import * as React from "react";
import { Drawer, Steps, Button, Form, Input } from "antd";
import "./NewCameraModal.css";
import DrawLines from "./DrawLines";

class NewCameraModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  next = () => {
    const next = this.state.current + 1;
    this.setState({ current: next });
  };

  prev = () => {
    const prev = this.state.current - 1;
    this.setState({ current: prev });
  };

  render() {
    return (
      <Drawer
        height="80vh"
        placement="bottom"
        title="Create a new camera"
        onClose={this.props.onCancel}
        visible={this.props.visible}
        footer={
          <div style={{ textAlign: "right" }}>
            {this.state.current === 0 && (
              <Button onClick={this.next} type="primary">
                Next
              </Button>
            )}
            {this.state.current === 1 && (
              <>
                <Button onClick={this.prev}>Previous</Button>{" "}
                <Button type="primary">Create</Button>
              </>
            )}
          </div>
        }
      >
        <div className="steps">
          <Steps current={this.state.current}>
            <Steps.Step title="Camera Information" />
            <Steps.Step title="Draw Lane Lines" />
          </Steps>
        </div>
        {this.state.current === 0 && (
          <Form onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
            <div className="camera-form">
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please input camera name" },
                ]}
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
                rules={[
                  { required: true, message: "Please input camera group" },
                ]}
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
            </div>
          </Form>
        )}
        {this.state.current === 1 && <DrawLines />}
      </Drawer>
    );
  }
}

export default NewCameraModal;
