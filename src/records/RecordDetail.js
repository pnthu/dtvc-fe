import * as React from "react";
import { Modal, Button } from "antd";
import "./RecordDetail.css";

const actions = {
  unconfirmed: (
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
        onCancel={this.props.onClose}
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
            <p>{this.props.data.createdDate}</p>
            <p>{this.props.data.image.camera.location}</p>
            <p>{this.props.data.violationType.name}</p>
            <p>{this.props.data.licensePlate}</p>
            <p>{this.props.data.caseType}</p>
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
        <div>{actions[this.props.data.caseType]}</div>
      </Modal>
    );
  }
}

export default RecordDetail;
