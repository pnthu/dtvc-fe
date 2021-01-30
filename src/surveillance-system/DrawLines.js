import * as React from "react";
import { Steps, Button, Popover, notification } from "antd";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LINE_TYPE = {
  left: ["horizontal", "left_bound", "upper_bound", "right_bound"],
  right: ["horizontal", "vertical", "left_bound", "upper_bound", "right_bound"],
};

const LINE_POSITION = {
  left: [
    require("../image/left-horizontal.jpg"),
    require("../image/left-left.jpg"),
    require("../image/left-upper.jpg"),
    require("../image/left-right.jpg"),
  ],
  right: [
    require("../image/right-horizontal.jpg"),
    require("../image/right-vertical.jpg"),
    require("../image/right-left.jpg"),
    require("../image/right-upper.jpg"),
    require("../image/right-right.jpg"),
  ],
};

class DrawLines extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      context: null,
      mouseDown: false,
      points: [],
      point: { x: 0, y: 0 },
      canvasOffsetLeft: 0,
      canvasOffsetTop: 0,
      currentStep: 0,
      data: {},
      init: true,
      disabled: true,
    };
    var point = {};
  }

  createCamera = (body) => {
    fetch(`http://localhost:8080/camera/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((Response) => {
      if (Response.status === 200) {
        notification.success({
          message: "Create camera succcessfully!",
          placement: "bottomLeft",
        });
        this.props.onCancel();
        window.location.reload();
      } else {
        notification.error({
          message: "Create camera failed!",
          placement: "bottomLeft",
        });
      }
    });
  };

  drawPoint = (evt) => {
    if (
      ((this.props.data.position === "right" &&
        this.state.points.length < 10) ||
        (this.props.data.position === "left" &&
          this.state.points.length < 8)) &&
      !this.state.disableUndo
    ) {
      if (this.state.context) {
        const points = this.state.points;
        const ctx = this.state.context;
        this.point = {
          x: evt.nativeEvent.offsetX,
          y: evt.nativeEvent.offsetY,
        };
        console.log("point", this.point);
        points.push(this.point);
        this.setState({ points: points });
        ctx.beginPath();
        ctx.moveTo(this.point.x, this.point.y);
        ctx.lineTo(this.point.x + 0.25, this.point.y + 0.25);
        ctx.strokeStyle = "#f00";
        ctx.lineWidth = 10;
        ctx.stroke();
        // ctx.closePath();
      }
    }
  };

  drawLine = () => {
    const ctx = this.state.context;
    const pos = this.state.points.length;
    ctx.beginPath();
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 3;
    ctx.moveTo(this.state.points[pos - 2].x, this.state.points[pos - 2].y);
    ctx.lineTo(this.state.points[pos - 1].x, this.state.points[pos - 1].y);
    ctx.stroke();
    // ctx.closePath();
    if (
      (this.props.data.position === "right" && this.state.currentStep !== 4) ||
      (this.props.data.position === "left" && this.state.currentStep !== 3)
    ) {
      const next = this.state.currentStep + 1;
      this.setState({ currentStep: next });
    } else {
      this.setState({ disabled: false });
    }
  };

  undo = () => {
    //draw image
    const ctx = this.state.context;
    this.props.data.position === "right"
      ? ctx.clearRect(0, 0, 672, 380)
      : ctx.clearRect(0, 0, 640, 360);
    const img = new Image();
    img.onload = () => {
      if (this.props.data.position === "right") {
        ctx.drawImage(img, 0, 0, 672, 380);
      } else {
        ctx.drawImage(img, 0, 0, 640, 360);
      }
      //pop 2 points
      const newPoints = this.state.points.slice(
        0,
        this.state.points.length - 2
      );
      this.setState({ points: newPoints, currentStep: newPoints.length / 2 });
      //draw again
      for (let i = 0; i < newPoints.length; i += 2) {
        ctx.beginPath();
        ctx.strokeStyle = "#f00";
        ctx.lineWidth = 3;
        ctx.moveTo(newPoints[i].x, newPoints[i].y);
        ctx.lineTo(newPoints[i + 1].x, newPoints[i + 1].y);
        ctx.stroke();
      }
    };
    img.src = `data:image/png;base64, ${this.props.image.frame}`;
  };

  handleMouseDown = (evt) => {
    this.drawPoint(evt);
    if (
      this.state.points.length % 2 === 0 &&
      ((this.props.data.position === "right" &&
        this.state.points.length <= 10) ||
        (this.props.data.position === "left" && this.state.points.length <= 8))
    ) {
      this.drawLine();
    }
  };

  handleMouseUp = (evt) => {
    this.setState({ mouseDown: false });
  };

  handleCreate = () => {
    //resize
    let tmp = [];
    let point = {};
    let tmpObj = {};
    tmpObj.camera = this.state.data;
    for (let i = 0; i < this.state.points.length; i++) {
      point = this.state.points[i];
      let tmpPoint = {};
      if (this.props.data.position === "right") {
        tmpPoint.x = point.x * 4;
        tmpPoint.y = point.y * 4;
      } else {
        tmpPoint.x = point.x * 3;
        tmpPoint.y = point.y * 3;
      }
      tmp.push(tmpPoint);
    }
    //map array
    const maxPoint = this.props.data.position === "right" ? 10 : 8;
    for (let i = 0; i < maxPoint; i += 2) {
      let line = {};
      line.lineType = LINE_TYPE[this.props.data.position][i / 2];
      line.top = tmp[i].y;
      line.left = tmp[i].x;
      line.right = tmp[i + 1].x;
      line.bottom = tmp[i + 1].y;
      switch (i) {
        case 0:
          tmpObj.line1 = line;
          break;
        case 2:
          tmpObj.line2 = line;
          break;
        case 4:
          tmpObj.line3 = line;
          break;
        case 6:
          tmpObj.line4 = line;
          break;
        case 8:
          tmpObj.line5 = line;
          break;
      }
    }
    console.log("result", tmpObj);
    this.createCamera(tmpObj);
  };

  prev = () => {
    this.props.prev(this.state.data);
  };

  componentDidMount = () => {
    console.log("props", this.props);
    this.setState({ data: this.props.data });
    if (this.canvasRef.current) {
      const renderCtx = this.canvasRef.current.getContext("2d");
      if (renderCtx) {
        this.setState({
          canvasOffsetLeft: this.canvasRef.current.offsetLeft,
          canvasOffsetTop: this.canvasRef.current.offsetTop,
          context: renderCtx,
        });
      }
    }
  };

  componentDidUpdate = () => {
    const ctx = this.state.context;
    if (this.props.image.frame && this.state.init) {
      const img = new Image();
      img.src = `data:image/png;base64, ${this.props.image.frame}`;
      if (this.props.data.position === "right") {
        img.width = 672;
        img.height = 380;
      } else {
        img.width = 640;
        img.height = 360;
      }
      img.onload = () => {
        ctx.drawImage(img, 0, 0, img.width, img.height);
      };
      this.setState({ init: false });
    }
  };

  render() {
    console.log("data", this.props.data);
    return (
      <>
        <div className="next-step">
          <Steps
            progressDot
            current={this.state.currentStep}
            direction="vertical"
          >
            {this.props.data.position === "right" ? (
              <Steps.Step
                title="Draw horizontal line"
                description="Choose the start and end point of the white line near the traffic light"
              />
            ) : (
              <Steps.Step
                title="Draw inspecting area"
                description="Choose the start and end point of the lower bound of inspecting area"
              />
            )}
            {this.props.data.position === "right" && (
              <Steps.Step
                title="Draw vertical line"
                description="Choose the start and end point of the white lane line"
              />
            )}
            <Steps.Step
              title="Draw inspecting area"
              description="Choose the start and end point of the left bound of inspecting area"
            />
            {this.props.data.position === "right" ? (
              <Steps.Step
                title="Draw inspecting area"
                description="Choose the start and end point of the upper bound of inspecting area"
              />
            ) : (
              <Steps.Step
                title="Draw horizontal line"
                description="Choose the start and end point of the white line near the traffic light"
              />
            )}
            <Steps.Step
              title="Draw inspecting area"
              description="Choose the start and end point of the right bound of inspecting area"
            />
          </Steps>
          <div
            style={{
              display: "grid",
              position: "relative",
              top: "4px",
              left: "-320px",
              color: "#c0c0c0",
              fontSize: "16px",
            }}
          >
            {LINE_POSITION[this.props.data.position].map((img) => (
              <Popover
                placement="topLeft"
                content={<img src={img} width={288} height={162} />}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </Popover>
            ))}
          </div>
          <canvas
            id="canvas"
            ref={this.canvasRef}
            width={this.props.data.position === "right" ? 672 : 640}
            height={this.props.data.position === "right" ? 380 : 360}
            onMouseUp={(evt) => this.handleMouseUp(evt)}
            onMouseDown={(evt) => this.handleMouseDown(evt)}
          ></canvas>
        </div>
        <Button
          type="primary"
          style={{ marginRight: "8px" }}
          onClick={this.undo}
          disabled={this.state.currentStep === 0}
        >
          Undo
        </Button>
        <div style={{ textAlign: "right", marginTop: "24px" }}>
          <Button onClick={this.prev} style={{ marginRight: "8px" }}>
            Previous
          </Button>
          <Button
            type="primary"
            onClick={this.handleCreate}
            disabled={this.state.disabled}
          >
            Create
          </Button>
        </div>
      </>
    );
  }
}

export default DrawLines;
