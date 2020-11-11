import * as React from "react";
import { Modal, Button, Form, Input, notification } from "antd";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "./RecordDetail.css";

const MODE = {
  VIEW: "view",
  EDIT: "edit",
};

class RecordDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: MODE.VIEW,
      confirmVisible: false,
    };
  }

  approveCase = () => {
    fetch(
      `http://localhost:8080/case/approve?caseId=${this.props.data.caseId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ).then((Response) => {
      if (Response.status === 200) {
        notification.success({
          message: "Approve case succcessfully!",
          placement: "bottomLeft",
        });
      } else {
        notification.error({
          message: "Approve case failed!",
          placement: "bottomLeft",
        });
      }
    });
  };

  rejectCase = () => {
    fetch(
      `http://localhost:8080/case/reject?caseId=${this.props.data.caseId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ).then((Response) => {
      if (Response.status === 200) {
        notification.success({
          message: "Reject case succcessfully!",
          placement: "bottomLeft",
        });
      } else {
        notification.error({
          message: "Reject case failed!",
          placement: "bottomLeft",
        });
      }
    });
  };

  handleApprove = () => {
    this.approveCase();
    this.props.onClose();
    window.location.reload();
  };

  handleReject = () => {
    this.approveCase();
    this.props.onClose();
    window.location.reload();
  };

  openConfirm = () => {
    this.setState({ confirmVisible: true });
  };

  closeConfirm = () => {
    this.setState({ confirmVisible: false });
  };

  titleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join(" ");
  };

  render() {
    
    let actions = {
      unconfirmed: (
        <div style={{ textAlign: "right" }}>
          <Button
            type="default"
            style={{ marginRight: "24px" }}
            onClick={this.handleReject}
          >
            Reject
          </Button>
          <Button type="primary" onClick={this.handleApprove}>
            Approve
          </Button>
        </div>
      ),
      punishment: (
        <div style={{ textAlign: "right" }}>
          <a
            href="https://firebasestorage.googleapis.com/v0/b/capstone-dtv.appspot.com/o/reports%2FViolation5.pdf?alt=media&token=7ba7a939-9a28-465f-bfe0-7f57e9f8cca0&fbclid=IwAR24cI4NUBXY5eOWs3m-j0B6mXb-KbXHfkh_vK4pxCBVueAYRdTkTN1XB3g"
            target="_blank"
            download
          >
            <Button type="primary">Export to PDF</Button>
          </a>
        </div>
      ),
      rejected: null,
    };

    return (
      <>
        <Modal
          visible={this.props.visible}
          footer={false}
          className="detail-modal"
          onCancel={this.props.onClose}
        >
          <h3 className="title">VIOLATION RECORD</h3>
          <div className="container">
            <div>
              <p className="label">Time</p>
              <p className="label">Location</p>
              <p className="label">Violation Type</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <p className="label">License Plate Number</p>
                <Button
                  style={{ marginBottom: "14px" }}
                  onClick={() => this.setState({ mode: MODE.EDIT })}
                  type="text"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </div>
              <p
                className="label"
                style={{
                  marginTop: this.state.mode === MODE.EDIT ? "45px" : "0px",
                }}
              >
                Status
              </p>
            </div>
            <div className="modalRight">
              <p>{moment(this.props.data.createdDate).format("DD/MM/yyyy")}</p>
              <p>{this.props.data.image.camera.location}</p>
              <p>{this.props.data.violationType.name}</p>
              {this.state.mode === MODE.VIEW ? (
                <p>{this.props.data.licensePlate}</p>
              ) : (
                <Form
                  name="basic"
                  initialValues={{ license: this.props.data.licensePlate }}
                  onFinish={(values) => { 
                    this.props.handleUpdate(values, this.props.data);
                    this.setState({ mode: MODE.VIEW });
                  }}
                >
                  <Form.Item name="license" style={{ marginBottom: "14px" }}>
                    <Input
                      placeholder="License plate number"
                      rules={[
                        {
                          required: true,
                          message: "Please input license plate number",
                        },
                      ]}
                    />
                  </Form.Item>
                  <Button
                    type="default"
                    style={{ margin: "0px 24px 14px 0px" }}
                    onClick={() => this.setState({ mode: MODE.VIEW })}
                  >
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form>
              )}

              <p>
                {this.props.data.caseType &&
                  this.titleCase(this.props.data.caseType)}
              </p>
            </div>
          </div>
          <img
            src={this.props.data.image.url}
            alt="Record"
            width={533}
            height={300}
            style={{ marginBottom: "24px" }}
          />
          <div>{actions[this.props.data.caseType]}</div>
        </Modal>
        <Modal visible={this.state.confirmVisible}>
          <h3 className="title">VIOLATION RECORD</h3>
        </Modal>
      </>
    );
  }
}

export default RecordDetail;
