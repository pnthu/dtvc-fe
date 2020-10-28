import * as React from "react";
import "antd/dist/antd.css";
import { Input, Table, Button, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import "./recordManagement.css";
import RecordDetail from "./RecordDetail";

const dataSource = [
  {
    key: "1",
    no: 1,
    type: "Stopping red light crossing the line",
    licensePlateNumber: "59V181250",
    time: "12:00AM Tue, October 27, 2020",
    location: "123 Cách Mạng Tháng 8, phường 13, quận 10",
    inspector: "Nguyễn Văn A",
    status: "Approved",
  },
  {
    key: "1",
    no: 1,
    type: "Stopping red light crossing the line",
    licensePlateNumber: "59V181250",
    time: "12:00AM Tue, October 27, 2020",
    location: "123 Cách Mạng Tháng 8, phường 13, quận 10",
    inspector: "Nguyễn Văn A",
    status: "Pending",
  },
  {
    key: "1",
    no: 1,
    type: "Stopping red light crossing the line",
    licensePlateNumber: "59V181250",
    time: "12:00AM Tue, October 27, 2020",
    location: "123 Cách Mạng Tháng 8, phường 13, quận 10",
    inspector: "Nguyễn Văn A",
    status: "Rejected",
  },
];

class RecordManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      record: {},
    };
  }

  columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      width: "5%",
    },
    {
      title: "Violation Type",
      dataIndex: "type",
      key: "type",
      ellipsis: true,
    },
    {
      title: "License Plate Number",
      dataIndex: "licensePlateNumber",
      key: "licensePlateNumber",
    },
    {
      title: "Recorded Time",
      dataIndex: "time",
      key: "time",
      ellipsis: true,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
    },
    {
      title: "Inspector",
      dataIndex: "inspector",
      key: "inspector",
    },
    {
      title: "Status",
      dataIndex: "status",
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
                dataSource={dataSource}
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
