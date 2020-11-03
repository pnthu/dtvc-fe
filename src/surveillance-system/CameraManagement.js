import * as React from "react";
import { Button, Table, Switch, Select } from "antd";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "antd/dist/antd.css";
import "./CameraManagement.css";
import NewCameraModal from "./NewCameraModal";

const columns = [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Group",
    dataIndex: "group",
    key: "group",
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <>
        {status === "on" ? (
          <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked />
        ) : (
          <Switch
            checkedChildren="On"
            unCheckedChildren="Off"
            defaultChecked={false}
          />
        )}
      </>
    ),
  },
];

class CameraManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      data: [],
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      ModalText: "Creating new camera",
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log("Clicked cancel button");
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <>
        <div className="background">
          <div className="box">
            <h2 className="title">Camera Management</h2>
            <div className="top-row">
              <div className="camera-filter">
                <Select
                  showSearch
                  placeholder="Location"
                  style={{ width: "50%" }}
                ></Select>
                <Select
                  defaultValue="active"
                  placeholder="Status"
                  style={{ width: "40%" }}
                >
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
              </div>
              <div className="new-btn">
                <Button onClick={this.showModal}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span className="new-camera">New Camera</span>
                </Button>
              </div>
            </div>
            <Table
              className="table"
              columns={columns}
              dataSource={this.state.data}
              pagination={{ defaultCurrent: 1, total: 10, pageSize: 10 }}
            />
          </div>
        </div>
        <NewCameraModal
          handleOk={this.handleOk}
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        />
      </>
    );
  }
}

export default CameraManagement;
