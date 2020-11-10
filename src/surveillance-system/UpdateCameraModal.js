import * as React from "react";
import { Drawer, Steps, Button, Form, Input, Select } from "antd";
// import DrawLines from "./DrawLines";

class UpdateCameraModal extends React.Component {
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
      existedGroup: true,
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

  getCameraById = (id) => {
    if (id !== -1) {
      fetch(`http://localhost:8080/camera/getById?cameraId=${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((Response) => Response.json())
        .then((camera) => {
          this.setState({ data: camera });
          console.log("camera", camera);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  onFinish = (values) => {
    const next = this.state.current + 1;
    const info = values;
    info.status = "Active";
    if (!this.state.existedGroup) {
      this.setState({
        selectedGroup: { groupId: 0, groupName: values.groupCamera },
      });
    }
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
    this.getCameraById(this.props.cameraId);
    console.log("id", this.props.cameraId);
  };

  componentDidUpdate = (prop) => {
    if (this.props.cameraId !== prop.cameraId) {
      this.getCameraById(this.props.cameraId);
      console.log("id", this.props.cameraId);
    }
  };

  render() {
    return (
      <Drawer
        height="85vh"
        placement="bottom"
        title="Update camera"
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
          <>
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
                  rules={[
                    { required: true, message: "Please input camera URL" },
                  ]}
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
                  {this.state.existedGroup ? (
                    <Select
                      showSearch
                      onSearch={this.fetchGroupByName}
                      onChange={this.onSelectedGroup}
                      style={{ textAlign: "left" }}
                      placeholder="Group"
                    >
                      {this.state.groups &&
                        this.state.groups.length !== 0 &&
                        this.state.groups.map((group) => (
                          <Select.Option value={group.groupId}>
                            {group.groupName}
                          </Select.Option>
                        ))}
                    </Select>
                  ) : (
                    <Input placeholder="Group" />
                  )}
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
            <Button
              type="link"
              onClick={() => {
                const tmp = !this.state.existedGroup;
                this.setState({ existedGroup: tmp });
              }}
            >
              {this.state.existedGroup
                ? "Create new group"
                : "Use existed group"}
            </Button>
          </>
        )}
        {/* {this.state.current === 1 && (
          <DrawLines
            prev={this.prev}
            data={this.state.data}
            onCancel={this.props.onCancel}
          />
        )} */}
      </Drawer>
    );
  }
}

export default UpdateCameraModal;
