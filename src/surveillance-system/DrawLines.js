import * as React from "react";
import { Steps, Button, notification } from "antd";

const LINE_TYPE = [
  { label: "line1", value: "horizontal" },
  { label: "line2", value: "vertical" },
  { label: "line3", value: "left_bound" },
  { label: "line4", value: "upper_bound" },
  { label: "line5", value: "right_bound" },
];

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
    if (this.state.currentStep !== 4) {
      const next = this.state.currentStep + 1;
      this.setState({ currentStep: next });
    }
  };

  handleMouseDown = (evt) => {
    this.drawPoint(evt);
    if (this.state.points.length % 2 === 0 && this.state.points.length <= 10) {
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
      tmpPoint.x = point.x * 3;
      tmpPoint.y = point.y * 3;
      tmp.push(tmpPoint);
    }
    //map array
    for (let i = 0; i < 10; i += 2) {
      let line = {};
      line.lineType = LINE_TYPE[i / 2].value;
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

  componentDidMount = () => {
    this.setState({ data: this.props.data });
    if (this.canvasRef.current) {
      const renderCtx = this.canvasRef.current.getContext("2d");
      if (renderCtx) {
        this.setState({
          canvasOffsetLeft: this.canvasRef.current.offsetLeft,
          canvasOffsetTop: this.canvasRef.current.offsetTop,
          context: renderCtx,
        });
        // const img = new Image();
        // img.src = require("../image/a.jpg");
        // img.width = 672;
        // img.height = 380;
        // img.onload = () => {
        //   renderCtx.drawImage(img, 0, 0, 672, 380);
        // };
      }
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
            <Steps.Step
              title="Draw horizontal line"
              description="Choose the start and end point of the white line near the traffic light"
            />
            <Steps.Step
              title="Draw vertical line"
              description="Choose the start and end point of the broken white lane line"
            />
            <Steps.Step
              title="Draw inspecting area"
              description="Choose the start and end point of the left bound of inspecting area"
            />
            <Steps.Step
              title="Draw inspecting area"
              description="Choose the start and end point of the upper bound of inspecting area"
            />
            <Steps.Step
              title="Draw inspecting area"
              description="Choose the start and end point of the right bound of inspecting area"
            />
          </Steps>
          <div style={{ border: "1px solid #000", position: "relative" }}>
            <img
              src={require("../image/a.jpg")}
              width={672}
              height={380}
              style={{ position: "relative" }}
            />
            <canvas
              id="canvas"
              ref={this.canvasRef}
              width={672}
              height={380}
              onMouseUp={(evt) => this.handleMouseUp(evt)}
              onMouseDown={(evt) => this.handleMouseDown(evt)}
              style={{ border: "1px solid #f00" }}
            ></canvas>
          </div>
        </div>
        <div style={{ textAlign: "right", marginTop: "24px" }}>
          <Button onClick={this.props.prev}>Previous</Button>
          <Button type="primary" onClick={this.handleCreate}>
            Create
          </Button>
        </div>
      </>
    );
  }
}

export default DrawLines;
