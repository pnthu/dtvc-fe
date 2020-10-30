import * as React from "react";
import { Modal, Button } from "antd";
import "./RecordDetail.css";

const actions = {
  Pending: (
    <>
      <Button type="default">Reject</Button>
      <Button type="primary">Approve</Button>
    </>
  ),
  Approved: <Button type="primary">Export to PDF</Button>,
  Rejected: null,
};

class RecordDetail extends React.Component {
  render() {
    console.log("data", this.props);
    return (
      <Modal
        visible={this.props.visible}
        footer={null}
        className="detail-modal"
      >
        <h3 className="title">VIOLATION RECORD</h3>
        <div className="container">
          <div>
            <p className="label">Time</p>
            <p className="label">Location</p>
            <p className="label">Violation Type</p>
            <p className="label">License Plate Number</p>
            <p className="label">Status</p>
          </div>
          <div className="modalRight">
            <p>{this.props.data.time}</p>
            <p>{this.props.data.location}</p>
            <p>{this.props.data.type}</p>
            <p>{this.props.data.licensePlateNumber}</p>
            <p>{this.props.data.status}</p>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "300px",
            margin: "36px 0px 24px 0px",
            backgroundColor: "gray",
          }}
        ></div>
        <div>{actions[this.props.data.status]}</div>
      </Modal>
    );
  }
}

export default RecordDetail;
