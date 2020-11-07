import * as React from "react";
import "antd/dist/antd.css";
import moment from "moment";
import { Table, Button, Select, DatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import "./recordManagement.css";
import RecordDetail from "./RecordDetail";

class RecordManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      record: {
        image: { camera: { location: "", status: "" } },
        violationType: { name: "" },
      },
      data: [],
      types: [],
      selectedType: "",
      selectedStatus: "",
      fromDate: "",
      toDate: "",
    };
  }

  columns = [
    {
      title: "No.",
      dataIndex: "caseId",
      key: "no",
      width: "5%",
    },
    {
      title: "Violation Type",
      dataIndex: ["violationType", "name"],
      key: "type",
      ellipsis: true,
    },
    {
      title: "License Plate Number",
      dataIndex: "licensePlate",
      key: "licensePlateNumber",
    },
    {
      title: "Recorded Time",
      dataIndex: "createdDate",
      key: "time",
      ellipsis: true,
      render: (text) => {
        return moment(text).format("DD/MM/yyyy");
      },
    },
    {
      title: "Location",
      dataIndex: ["image", "camera", "location"],
      key: "location",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "caseType",
      key: "status",
    },
    {
      title: "View Details",
      dataIndex: "detail",
      key: "detail",
      width: "10%",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            className="detail"
            onClick={() => this.setState({ visible: true, record: record })}
          >
            <FontAwesomeIcon
              icon={faEye}
              style={{ fontSize: 17, alignSelf: "center" }}
            />
          </Button>
        </>
      ),
    },
  ];

  showModal = () => {
    this.setState({ visible: true });
  };

  handleApprove = () => {
    //approve code here
    this.setState({ visible: false });
  };

  handleReject = () => {
    //reject code here
    this.setState({ visible: false });
  };

  onClose = () => {
    this.setState({ visible: false });
  };

  fetchAllCases = () => {
    fetch("http://localhost:8080/case/getAll", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((cases) => {
        this.setState({ data: cases });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  fetchViolationTypes = () => {
    fetch("http://localhost:8080/case/getViolationType", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((types) => {
        this.setState({ types: types });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  filter = (from = "", to = "", violationType = 1, caseType = "") => {
    fetch(
      `http://localhost:8080/case/filter?fromDate=${from}&toDate=${to}&violationId=${violationType}&caseType=${caseType}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((Response) => Response.json())
      .then((cases) => {
        this.setState({ data: cases });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onSelectedType = (value, option) => {
    this.setState({ selectedType: value });
    this.filter(
      this.state.fromDate,
      this.state.toDate,
      value,
      this.state.selectedStatus
    );
  };

  onSelectedStatus = (value, option) => {
    this.setState({ selectedStatus: value });
    this.filter(
      this.state.fromDate,
      this.state.toDate,
      this.state.selectedType,
      value
    );
  };

  onSelectedDates = (dates, dateStrings) => {
    console.log("dates", dates);
    const from = moment(dates[0]).format("yyyy-MM-DD");
    const to = moment(dates[1]).format("yyyy-MM-DD");
    this.setState({
      fromDate: from,
      toDate: to,
    });
    this.filter(from, to, this.state.selectedType, this.state.selectedStatus);
  };

  componentDidMount = () => {
    this.fetchAllCases();
    this.fetchViolationTypes();
  };

  render() {
    return (
      <>
        <div className="background">
          <div className="box">
            <h2 className="title">Records Management</h2>
            <div className="filter">
              <DatePicker.RangePicker
                placeholder={["From", "To"]}
                format="DD/MM/yyyy"
                onChange={this.onSelectedDates}
              />
              <Select
                placeholder="Violation Type"
                onChange={this.onSelectedType}
              >
                {this.state.types.map((type) => (
                  <Select.Option
                    key={type.violationId}
                    value={type.violationId}
                  >
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
              <Select placeholder="Status">
                <Select.Option value="unconfirmed">Pending</Select.Option>
                <Select.Option value="punishment">Approved</Select.Option>
                <Select.Option value="rejected">Rejected</Select.Option>
              </Select>
            </div>
            <div>
              <Table
                className="table"
                dataSource={this.state.data}
                columns={this.columns}
              />
            </div>
          </div>
        </div>
        <RecordDetail
          visible={this.state.visible}
          data={this.state.record}
          handleApprove={this.handleApprove}
          handleReject={this.handleReject}
          onClose={this.onClose}
        />
      </>
    );
  }
}

export default RecordManagement;
