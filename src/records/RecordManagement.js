import * as React from "react";
import "antd/dist/antd.css";
import moment from "moment";
import { Input, Table, Button, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import "./RecordManagement.css";
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
    // {
    //   title: "Inspector",
    //   dataIndex: "inspector",
    //   key: "inspector",
    // },
    {
      title: "Status",
      dataIndex: ["image", "camera", "status"],
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

  fetchAllCases = () => {
    fetch("http://localhost:8081/api_war_exploded/case/getAll", {
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

  componentDidMount = () => {
    this.fetchAllCases();
  };

  render() {
    return (
      <>
        <div className="background">
          <div className="box">
            <h2 className="title">Records Management</h2>
            <div className="filter">
              <Input type="date" placeholder="From" />
              <Input type="date" placeholder="To" />
              <Select showSearch placeholder="Violation Type">
                <Select.Option>Passing red light</Select.Option>
                <Select.Option>Not wearing helmet</Select.Option>
              </Select>
              <Select showSearch placeholder="Status">
                <Select.Option>Pending</Select.Option>
                <Select.Option>Approved</Select.Option>
                <Select.Option>Rejected</Select.Option>
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
        />
      </>
    );
  }
}

export default RecordManagement;
