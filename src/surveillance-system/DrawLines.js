import * as React from "react";
import {Steps} from "antd";

class DrawLines extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            context: null,
            mouseDown: false,
            horizontalLine: [],
            verticalLine: [],
            distance: [],
            points: [],
            point: {x: 0, y: 0},
            canvasOffsetLeft: 0,
            canvasOffsetTop: 0,
            currentStep: 0,
        };
        var point = {};
    }

    handleMouseDown = (evt) => {
        const tmp = window.innerHeight * 0.2;
        if (this.state.context) {
            const points = this.state.points;
            const ctx = this.state.context;
            if (this.state.points.length < 2) {
                //2 points of horizontal line
                this.point = {
                    x: evt.nativeEvent.offsetX,
                    y: evt.nativeEvent.offsetY
                }
                console.log("point", this.state.point);
                points.push(this.point);
                ctx.beginPath();
                ctx.moveTo(this.point.x, this.point.y);
                ctx.lineTo(this.point.x + 0.25, this.point.y + 0.25);
                ctx.strokeStyle = "#f00";
                ctx.lineWidth = 10;
                ctx.stroke();
                ctx.closePath();
                if (this.state.points.length === 2) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#f00";
                    ctx.lineWidth = 3;
                    ctx.moveTo(this.state.points[0].x, this.state.points[0].y);
                    ctx.lineTo(this.state.points[1].x, this.state.points[1].y);
                    ctx.stroke();
                    ctx.closePath();
                    const next = this.state.currentStep + 1;
                    this.setState({currentStep: next});
                }
            } else if (this.state.points.length < 4) {
                //2 points of vertical line
                this.point = {
                    x: evt.nativeEvent.offsetX,
                    y: evt.nativeEvent.offsetY
                };
                console.log("point", this.point);
                points.push(this.point);
                ctx.beginPath();
                ctx.moveTo(this.point.x, this.point.y);
                ctx.lineTo(this.point.x + 1, this.point.y + 1);
                ctx.strokeStyle = "#ff0";
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.closePath();
                if (this.state.points.length === 4) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#ff0";
                    ctx.lineWidth = 3;
                    ctx.moveTo(this.state.points[2].x, this.state.points[2].y);
                    ctx.lineTo(this.state.points[3].x, this.state.points[3].y);
                    ctx.stroke();
                    ctx.closePath();
                    const next = this.state.currentStep + 1;
                    this.setState({currentStep: next});
                }
            } else {
                // 2 points of the area
                this.point = {
                    x: evt.nativeEvent.offsetX,
                    y: evt.nativeEvent.offsetY
                };
                console.log("point", this.point);
                points.push(this.point);
                ctx.beginPath();
                ctx.moveTo(this.point.x, this.point.y);
                ctx.lineTo(this.point.x + 1, this.point.y + 1);
                ctx.strokeStyle = "#00f";
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.closePath();
                if (this.state.points.length === 6) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#00f";
                    ctx.lineWidth = 3;
                    ctx.moveTo(this.state.points[4].x, this.state.points[4].y);
                    ctx.lineTo(this.state.points[5].x, this.state.points[5].y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    };

    handleMouseUp = (evt) => {
        this.setState({mouseDown: false});
    };

    componentDidMount = () => {
        if (this.canvasRef.current) {
            const renderCtx = this.canvasRef.current.getContext("2d");
            if (renderCtx) {
                // this.canvasRef.current.addEventListener(
                //   "mousedown",
                //   this.handleMouseDown
                // );
                // this.canvasRef.current.addEventListener("mouseup", this.handleMouseUp);
                this.setState({
                    canvasOffsetLeft: this.canvasRef.current.offsetLeft,
                    canvasOffsetTop: this.canvasRef.current.offsetTop,
                    context: renderCtx,
                });

                const img = new Image();
                img.src = require("../image/test.png");
                img.onload = () => {
                    renderCtx.drawImage(img, 0, 0, 640, 360);
                };
            }
        }
    };

    render() {
        return (
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
                        title="Draw ..... area"
                        description="Choose 4 points that form the area..."
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
        );
    }
}

export default DrawLines;
