import * as React from "react";

class VideoStreamingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      points: [],
      context: null,
      mouseDown: false,
      point: { x: 0, y: 0 },
      canvasOffsetLeft: 0,
      canvasOffsetTop: 0,
    };
  }

  handleMouseDown = (evt) => {
    if (this.state.points.length !== 4) {
      this.setState({
        mouseDown: true,
        point: {
          x: evt.clientX - this.state.canvasOffsetLeft,
          y: evt.clientY - this.state.canvasOffsetTop,
        },
      });
      const currentPoints = this.state.points;
      currentPoints.push(this.state.point);
      if (this.state.context) {
        const ctx = this.state.context;
        ctx.beginPath();
        ctx.moveTo(this.state.point.x, this.state.point.y);
        ctx.lineTo(this.state.point.x + 1, this.state.point.y + 1);
        ctx.strokeStyle = "#f00";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
      }
      this.setState({ points: currentPoints });
      console.log(
        "last point",
        this.state.points[this.state.points.length - 1]
      );

      //if enough 4 points
      if (this.state.context && this.state.points.length === 4) {
        const ctx = this.state.context;
        ctx.beginPath();
        ctx.strokeStyle = "#f00";
        ctx.fillStyle = "#f00";
        ctx.lineWidth = 3;
        for (let i = 0; i < this.state.points.length; i++) {
          ctx.moveTo(this.state.points[i].x, this.state.points.y);
          if (i !== 3) {
            ctx.lineTo(this.state.points[i + 1].x, this.state.points[i + 1].y);
          } else {
            ctx.lineTo(this.state.points[0].x, this.state.points[0].y);
          }
          ctx.stroke();
        }
        ctx.closePath();
        ctx.fill()
      }
    }
  };

  handleMouseUp = (evt) => {
    this.setState({ mouseDown: false });
  };

  componentDidMount = () => {
    if (this.canvasRef.current) {
      const renderCtx = this.canvasRef.current.getContext("2d");
      if (renderCtx) {
        this.canvasRef.current.addEventListener(
          "mousedown",
          this.handleMouseDown
        );
        this.canvasRef.current.addEventListener("mouseup", this.handleMouseUp);
        this.setState({
          canvasOffsetLeft: this.canvasRef.current.offsetLeft,
          canvasOffsetTop: this.canvasRef.current.offsetTop,
          context: renderCtx,
        });

        const img = new Image();
        img.src = require("../test.JPG");
        img.onload = () => {
          renderCtx.drawImage(img, 0, 0);
        };
      }
    }
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <canvas
          id="canvas"
          ref={this.canvasRef}
          width={1275}
          height={720}
          style={{ border: "2px solid #000", marginTop: 10 }}
        ></canvas>
      </div>
    );
  }
}

export default VideoStreamingScreen;
