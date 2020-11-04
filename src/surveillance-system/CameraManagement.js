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

const data = [
  {
    key: "1",
    no: 1,
    name: "John Brown",
    location: "New York No. 1 Lake Park",
    group: "A",
    position: "left",
    status: "on",
  },
  {
    key: "2",
    no: 2,
    name: "Jim Green",
    location: "London No. 1 Lake Park",
    group: "A",
    position: "right",
    status: "off",
  },
  {
    key: "3",
    no: 3,
    name: "Joe Black",
    location: "Sidney No. 1 Lake Park",
    group: "B",
    position: "left",
    status: "on",
  },
  {
    key: "4",
    no: 3,
    name: "Joe Black",
    location: "Sidney No. 1 Lake Park",
    group: "B",
    position: "left",
    status: "on",
  },
  {
    key: "5",
    no: 3,
    name: "Joe Black",
    location: "Sidney No. 1 Lake Park",
    group: "C",
    position: "left",
    status: "on",
  },
];

class CameraManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
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
            <div className="parent-create-new">
              <div className="filter">
                <Select showSearch placeholder="Location"></Select>
                <Select placeholder="Status">
                  <Select.Option>Active</Select.Option>
                  <Select.Option>Inactive</Select.Option>
                </Select>
              </div>
              <Button onClick={this.showModal}>
                <FontAwesomeIcon icon={faPlus} />
                <span className="new-camera">New Camera</span>
              </Button>
            </div>
            <div className="camera-table">
              <Table
                columns={columns}
                dataSource={data}
                pagination={{ defaultCurrent: 1, total: 10, pageSize: 10 }}
              />
            </div>
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
