import * as React from "react";
import { Steps, Button, notification } from "antd";

const LINE_TYPE = [
  { label: "line1", value: "Horzontal line" },
  { label: "line2", value: "Vertical Line" },
  { label: "line3", value: "Left bound" },
  { label: "line4", value: "Upper bound" },
  { label: "line5", value: "Right bound" },
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
      ctx.closePath();
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
    ctx.closePath();
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
    for (let i = 0; i < 5; i++) {
      let line = {};
      line.lineType = LINE_TYPE[i].value;
      line.top = tmp[i].y;
      line.left = tmp[i].x;
      line.right = tmp[i + 1].x;
      line.bottom = tmp[i + 1].y;
      switch (i) {
        case 0:
          tmpObj.line1 = line;
          break;
        case 1:
          tmpObj.line2 = line;
          break;
        case 2:
          tmpObj.line3 = line;
          break;
        case 3:
          tmpObj.line4 = line;
          break;
        case 4:
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

        const img = new Image();
        img.src = require("../image/test.jpg");
        img.onload = () => {
          renderCtx.drawImage(img, 0, 0, 640, 360);
        };
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
          <canvas
            id="canvas"
            ref={this.canvasRef}
            width={640}
            height={360}
            onMouseUp={(evt) => this.handleMouseUp(evt)}
            onMouseDown={(evt) => this.handleMouseDown(evt)}
          ></canvas>
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
