import * as React from "react";
import { Button, Table, Switch, Select, notification } from "antd";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "antd/dist/antd.css";
import "./CameraManagement.css";
import NewCameraModal from "./NewCameraModal";

class CameraManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      data: [],
      locations: [],
      selectedLocation: "",
      selectedStatus: "Active",
      selectedRow: {},
    };
  }

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
      render: (text, record) => {
        let self = this;
        return (
          <Switch
            style={{ width: "75px" }}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            checked={record.status === "Active"}
            onClick={(checked, evt) => {
              self.tempRecord = record;
              self.onSwitch(checked);
            }}
          />
        );
      },
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

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
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

  updateStatus = async (record) => {
    const status = record.status;
    await fetch("http://localhost:8080/camera/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    }).then((Response) => {
      if (status === "Active") {
        if (Response.status === 200) {
          notification.success({
            message: "Activate Camera Successfully!",
            placement: "bottomLeft",
          });
        } else {
          notification.error({
            message: "Activate Camera Failed!",
            placement: "bottomLeft",
          });
        }
      } else {
        if (Response.status === 200) {
          notification.success({
            message: "Deactivate Camera Successfully!",
            placement: "bottomLeft",
          });
        } else {
          notification.error({
            message: "Deactivate Camera Failed!",
            placement: "bottomLeft",
          });
        }
      }
    });
    this.fetchCameras();
  };

  onSelectedLocation = (value, option) => {
    this.setState({ selectedLocation: value });
    this.filterByLocationStatus(value, this.state.selectedStatus);
  };

  onSelectedStatus = (value, option) => {
    this.setState({ selectedStatus: value });
    this.filterByLocationStatus(this.state.selectedLocation, value);
  };

  onSwitch = async (checked) => {
    let newStatus;
    let record = this.tempRecord;
    if (checked) {
      newStatus = "Active";
    } else {
      newStatus = "Inactive";
    }
    record.status = newStatus;
    await this.updateStatus(record);
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
          visible={this.state.visible}
          s
          onCancel={this.handleCancel}
        />
      </>
    );
  }
}

export default CameraManagement;
