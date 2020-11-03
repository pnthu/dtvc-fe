import * as React from "react";
import { Button, Table, Switch, Select } from "antd";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "antd/dist/antd.css";
import "./CameraManagement.css";
import NewCameraModal from "./NewCameraModal";

class CameraManagement extends React.Component {
  columns = [
    {
      title: "No",
      dataIndex: "cameraId",
      key: "no",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Group",
      dataIndex: ["groupCamera", "groupName"],
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
      render: (text, record) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          defaultChecked={record.status === "Active"}
          // onChange={this.updateStatus(record)}
        />
      ),
    },
    {
      title: "Update",
      dataIndex: "update",
      key: "update",
      render: (text, record) => (
        <Button type="primary" className="detail" onClick={() => {}}>
          <FontAwesomeIcon
            icon={faEdit}
            style={{ fontSize: 17, alignSelf: "center" }}
          />
        </Button>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      data: [],
      locations: [],
      selectedLocation: "",
      selectedStatus: "Active",
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

  fetchCameras = () => {
    fetch("http://localhost:8080/camera/getAll", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((cameras) => {
        this.setState({ data: cameras });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  searchLocation = (value = "") => {
    fetch(`http://localhost:8080/camera/searchLocation?value=${value}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((locations) => {
        this.setState({ locations: locations });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  filterByLocationStatus = (location, status) => {
    fetch(
      `http://localhost:8080/camera/filterByLocationAndStatus?location=${location}&status=${status}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((Response) => Response.json())
      .then((cameras) => {
        this.setState({ data: cameras });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateStatus = (record) => {
    fetch("http://localhost:8080/camera/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: record,
    })
      .then((Response) => Response.json())
      .then((cameras) => {
        this.setState({ data: cameras });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onSelectedLocation = (value, option) => {
    this.setState({ selectedLocation: value });
    this.filterByLocationStatus(value, this.state.selectedStatus);
  };

  onSelectedStatus = (value, option) => {
    this.setState({ selectedStatus: value });
    this.filterByLocationStatus(this.state.selectedLocation, value);
  };

  onSwitch = (text, record) => {
    let newStatus;
    if (text === "Active") {
      newStatus = "Inactive";
    } else {
      newStatus = "Active";
    }
    record.status = newStatus;
    this.updateStatus(record);
  };

  componentDidMount = () => {
    this.setState({ loading: true });
    this.searchLocation();
    this.fetchCameras();
    this.setState({ loading: false });
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
                  onSearch={this.searchLocation}
                  onChange={this.onSelectedLocation}
                >
                  {this.state.locations.length !== 0 &&
                    this.state.locations.map((location) => (
                      <Select.Option
                        key={location.location}
                        value={location.location}
                      >
                        {location.location}
                      </Select.Option>
                    ))}
                </Select>
                <Select
                  defaultValue="Active"
                  placeholder="Status"
                  style={{ width: "40%" }}
                  onChange={this.onSelectedStatus}
                >
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
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
              columns={this.columns}
              dataSource={this.state.data}
              pagination={{ defaultCurrent: 1, total: 10, pageSize: 10 }}
              loading={this.state.loading}
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
