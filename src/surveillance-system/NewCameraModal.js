import * as React from "react";
import {
  Drawer,
  Steps,
  Button,
  Form,
  Input,
  Select,
  Popover,
  Typography,
  Spin,
} from "antd";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./NewCameraModal.css";
import DrawLines from "./DrawLines";

class NewCameraModal extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      current: 0,
      data: null,
      groups: [],
      selectedGroup: [],
      positions: [],
      groupText: "",
      existedPosition: null,
      existedGroup: true,
      image: "",
      positionImage: null,
      error: null,
      groupCamera: null,
      urlError: null,
      loading: false,
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

  getImageFromCamera = async (cameraUrl) => {
    await fetch(`http://localhost:8080/camera/getImageFromCamera`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cameraUrl),
    })
      .then((Response) => Response.json())
      .then((image) => {
        if (image.frame === "error") {
          this.setState({ urlError: "Wrong URL or no internet connection" });
        } else {
          this.setState({ image: image, urlError: null });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkGroup = async (groupCamera) => {
    await fetch(`http://localhost:8080/camera/checkGroup?name=${groupCamera}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((matched) => {
        if (matched) {
          this.setState({ error: "This group name has been used" });
        } else {
          this.setState({
            error: null,
            selectedGroup: { groupId: 0, groupName: groupCamera },
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onFinish = async (values) => {
    this.setState({ loading: true });
    const info = values;
    if (!this.state.existedGroup) {
      await this.checkGroup(values.groupCamera);
    }
    const image = {};
    image.cameraUrl = info.connectionUrl;
    await this.getImageFromCamera(image);
    this.setState({ loading: false });
    if (this.state.error === null && this.state.urlError === null) {
      const next = this.state.current + 1;
      info.status = "active";
      info.groupCamera = this.state.selectedGroup;
      this.setState({ current: next, data: info });
    }
  };

  onSelectedGroup = (value, option) => {
    if (typeof value === "number") {
      this.state.groups.forEach((group) => {
        if (group.groupId === value) {
          this.setState({ selectedGroup: group });
        }
      });
      this.getGroup(value);
    }
  };

  onPositionChange = (value, option) => {
    this.setState({ positionImage: value });
  };

  prev = (data) => {
    const prev = this.state.current - 1;
    let copyCamera = {};
    copyCamera = Object.assign({}, data);
    delete copyCamera.groupCamera;
    const existedGroup = this.state.existedGroup;
    const groupId = data.groupCamera.groupName;
    this.setState({
      current: prev,
      data: copyCamera,
      existedPosition: data.position,
      groupCamera: existedGroup ? data.groupCamera : { groupId: groupId },
    });
  };

  componentDidMount = () => {
    this.fetchGroupByName();
  };

  render() {
    const check = () => {
      if (this.state.groups && this.state.groupCamera) {
        const result = this.state.groups.filter(
          (group) => group.groupId === this.state.groupCamera.groupId
        );
        return result.length === 0;
      }
    };

    return (
      <Drawer
        height="85vh"
        placement="bottom"
        title="Create a new camera"
        onClose={() => {
          this.setState(
            {
              current: 0,
              data: {
                location: null,
                connectionUrl: null,
                position: null,
                groupCamera: null,
              },
              groupCamera: {},
            },
            () => {
              this.formRef.current.setFieldsValue({
                ...this.state.data,
              });
            }
          );
          this.props.onCancel();
        }}
        visible={this.props.visible}
      >
        <div className="steps">
          <Steps current={this.state.current}>
            <Steps.Step title="Camera Information" />
            <Steps.Step title="Draw Lane Lines" />
          </Steps>
        </div>
        {this.state.current === 0 && (
          <Spin spinning={this.state.loading}>
            <Form
              name="basic"
              onFinish={this.onFinish}
              ref={this.formRef}
              initialValues={{
                groupCamera: this.state.groupCamera
                  ? this.state.groupCamera.groupId
                  : null,
                ...this.state.data,
              }}
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
                  <Input
                    placeholder="Camera URL"
                    onChange={(e) => {
                      if (e.target.value === "") {
                        this.setState({ urlError: "" });
                      }
                    }}
                  />
                </Form.Item>
                {this.state.urlError !== null && (
                  <Typography.Text
                    type="danger"
                    style={{
                      position: "absolute",
                      top: "35px",
                      right: "313px",
                    }}
                  >
                    {this.state.urlError}
                  </Typography.Text>
                )}
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
                      defaultValue={
                        this.state.groupCamera
                          ? this.state.groupCamera.groupId
                          : ""
                      }
                    >
                      {this.state.groups &&
                        this.state.groups.length !== 0 &&
                        this.state.groups.map((group) => (
                          <Select.Option value={group.groupId}>
                            {group.groupName}
                          </Select.Option>
                        ))}
                      {check() ? (
                        this.state.groupCamera &&
                        this.state.groupCamera.groupName !== "" ? (
                          <Select.Option value={this.state.groupCamera.groupId}>
                            {this.state.groupCamera.groupName}
                          </Select.Option>
                        ) : null
                      ) : null}
                    </Select>
                  ) : (
                    <Input
                      placeholder="Group"
                      onChange={(e) => {
                        if (e.target.value === "") {
                          this.setState({ error: "" });
                        }
                      }}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  label="Position"
                  name="position"
                  rules={[
                    { required: true, message: "Please input camera position" },
                  ]}
                >
                  <Select
                    placeholder="Position"
                    style={{ textAlign: "left", width: "95%" }}
                    onChange={this.onPositionChange}
                  >
                    {this.state.existedPosition === null ? (
                      <>
                        <Select.Option value="left">left</Select.Option>
                        <Select.Option value="right">right</Select.Option>
                      </>
                    ) : this.state.existedPosition === "left" ? (
                      <Select.Option value="right">right</Select.Option>
                    ) : (
                      <Select.Option value="left">left</Select.Option>
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
            <div
              style={{
                position: "absolute",
                left: "46px",
                top: "115px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {this.state.error !== null && (
                <Typography.Text
                  type="danger"
                  style={{ textAlign: "left", marginLeft: "15px" }}
                >
                  {this.state.error}
                </Typography.Text>
              )}
              <Button
                type="link"
                onClick={() => {
                  const tmp = !this.state.existedGroup;
                  if (tmp) {
                    this.setState({ error: null });
                  }
                  this.setState(
                    {
                      existedGroup: tmp,
                      existedPosition: null,
                    },
                    () => {
                      this.formRef.current.setFieldsValue({
                        groupCamera: null,
                      });
                    }
                  );
                }}
              >
                {this.state.existedGroup
                  ? "Create new group"
                  : "Use existed group"}
              </Button>
            </div>
            <Popover
              placement="bottomRight"
              content={
                this.state.positionImage && (
                  <img
                    src={
                      this.state.positionImage === "left"
                        ? require("../image/left-camera.png")
                        : require("../image/right-camera.png")
                    }
                    width={205}
                    height={112}
                  />
                )
              }
            >
              <FontAwesomeIcon
                icon={faInfoCircle}
                style={{
                  marginLeft: "10px",
                  position: "absolute",
                  right: "-10px",
                  top: "86px",
                  color: "#bbbbbb",
                }}
              />
            </Popover>
          </Spin>
        )}
        {this.state.current === 1 && (
          <DrawLines
            prev={this.prev}
            data={this.state.data}
            image={this.state.image}
            onCancel={this.props.onCancel}
          />
        )}
      </Drawer>
    );
  }
}

export default NewCameraModal;
