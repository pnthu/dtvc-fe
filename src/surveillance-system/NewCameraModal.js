import * as React from "react";
import { Drawer, Steps, Button, Form, Input, AutoComplete, Select } from "antd";
import "./NewCameraModal.css";
import DrawLines from "./DrawLines";

class NewCameraModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      data: null,
      groups: [],
      selectedGroup: [],
      positions: [],
      groupText: "",
      existedPosition: null,
    };
  }

  fetchGroupByName = (value = "") => {
    fetch(`http://localhost:8080/camera/searchGroupByName?value=${value}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((groups) => {
        this.setState({ groups: groups });
        if (groups === null) {
          this.setState({ groupText: value });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getGroup = (id) => {
    fetch(`http://localhost:8080/camera/getByGroup?groupId=${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((group) => {
        if (group instanceof Array && group.length !== 0) {
          this.setState({ existedPosition: group[0].position });
        } else {
          this.setState({ existedPosition: null });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onFinish = (values) => {
    const next = this.state.current + 1;
    const info = values;
    info.status = "Active";
    info.groupCamera = this.state.selectedGroup;
    this.setState({ current: next, data: info });
  };

  onSelectedGroup = (value, option) => {
    if (typeof value === "number") {
      this.state.groups.forEach((group) => {
        if (group.groupId === value) {
          this.setState({ selectedGroup: group });
        }
      });
      this.getGroup(value);
    } else {
      this.setState({ selectedGroup: { groupId: 0, groupName: value } });
    }
  };

  prev = () => {
    const prev = this.state.current - 1;
    this.setState({ current: prev });
  };

  componentDidMount = () => {
    this.fetchGroupByName();
  };

  render() {
    return (
      <Drawer
        height="85vh"
        placement="bottom"
        title="Create a new camera"
        onClose={this.props.onCancel}
        visible={this.props.visible}
      >
        <div className="steps">
          <Steps current={this.state.current}>
            <Steps.Step title="Camera Information" />
            <Steps.Step title="Draw Lane Lines" />
          </Steps>
        </div>
        {this.state.current === 0 && (
          <Form
            name="basic"
            onFinish={this.onFinish}
            initialValues={this.state.data}
          >
            <div className="camera-form">
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
                label="URL"
                name="connectionUrl"
                rules={[{ required: true, message: "Please input camera URL" }]}
              >
                <Input placeholder="Camera URL" />
              </Form.Item>
              <Form.Item
                label="Group"
                name="groupCamera"
                rules={[
                  { required: true, message: "Please input camera group" },
                ]}
              >
                <AutoComplete
                  onSearch={this.fetchGroupByName}
                  onChange={this.onSelectedGroup}
                  style={{ textAlign: "left" }}
                  placeholder="Group"
                >
                  {this.state.groups &&
                    this.state.groups.length !== 0 &&
                    this.state.groups.map((group) => (
                      <AutoComplete.Option value={group.groupId}>
                        {group.groupName}
                      </AutoComplete.Option>
                    ))}
                </AutoComplete>
              </Form.Item>
              <Form.Item
                label="Position"
                name="position"
                rules={[
                  { required: true, message: "Please input camera position" },
                ]}
              >
                <Select placeholder="Position" style={{ textAlign: "left" }}>
                  {this.state.existedPosition === null ? (
                    <>
                      <Select.Option value="Left">Left</Select.Option>
                      <Select.Option value="Right">Right</Select.Option>
                    </>
                  ) : this.state.existedPosition === "Left" ? (
                    <Select.Option value="Left">Right</Select.Option>
                  ) : (
                    <Select.Option value="Left">Left</Select.Option>
                  )}
                </Select>
              </Form.Item>
            </div>
            <div style={{ textAlign: "right" }}>
              <Button htmlType="submit" type="primary">
                Next
              </Button>
            </div>
          </Form>
        )}
        {this.state.current === 1 && (
          <DrawLines
            prev={this.prev}
            data={this.state.data}
            onCancel={this.props.onCancel}
          />
        )}
      </Drawer>
    );
  }
}

export default NewCameraModal;
