import * as React from "react";
import {
  Modal,
  Button,
  Form,
  AutoComplete,
  Input,
  notification,
  Spin,
  Empty,
} from "antd";
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
      licenses: [],
      loading: true,
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
      } else if (Response.status === 400) {
        notification.error({
          message: "You cannot approve the same motorbike within 30 minutes",
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

  getLicense = () => {
    fetch("http://localhost:8080/case/getLicense", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((licenses) => {
        this.setState({ licenses: licenses });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleApprove = () => {
    this.approveCase();
    this.props.onClose();
    window.location.reload();
  };

  handleReject = () => {
    this.rejectCase();
    this.props.onClose();
    window.location.reload();
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
    console.log("image", this.props.data.image.url);
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
          <a href={this.props.data.reportUrl} target="_blank" download>
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
          onCancel={() => {
            this.setState({ loading: true });
            this.props.onClose();
          }}
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
                {this.props.data.caseType === "unconfirmed" && (
                  <Button
                    style={{ marginBottom: "14px" }}
                    onClick={() => {
                      this.getLicense();
                      this.setState({ mode: MODE.EDIT });
                    }}
                    type="text"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                )}
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
              <p>
                {moment(this.props.data.createdDate).format(
                  "DD/MM/yyyy HH:mm:ss"
                )}
              </p>
              <p>{this.props.data.location}</p>
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
                    {/* <Input
                      placeholder="License plate number"
                      rules={[
                        {
                          required: true,
                          message: "Please input license plate number",
                        },
                      ]}
                    /> */}
                    <AutoComplete>
                      {this.state.licenses.map((license) => (
                        <AutoComplete.Option>
                          {license} -
                          <p style={{ color: "#c0c0c0", fontSize: "12px" }}>
                            approved less than 30 seconds ago
                          </p>
                        </AutoComplete.Option>
                      ))}
                    </AutoComplete>
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
              <p
                style={{
                  marginTop:
                    this.props.data.licensePlate === "" ? "60px" : "0px",
                }}
              >
                {this.props.data.caseType &&
                  this.titleCase(this.props.data.caseType)}
              </p>
            </div>
          </div>
          {this.props.data.image.url !== null ? (
            <Spin spinning={this.state.loading}>
              <img
                src={this.props.data.image.url}
                alt="Record"
                width={533}
                height={300}
                style={{ marginBottom: "24px" }}
                onLoad={() => {
                  if (this.props.data.image.url !== undefined) {
                    this.setState({ loading: false });
                  }
                }}
              />
            </Spin>
          ) : (
            <Empty description="The system cannot capture image." />
          )}
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
