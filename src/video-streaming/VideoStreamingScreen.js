import * as React from "react";
import SockJS from "sockjs-client";
import { Menu, Dropdown, Button } from "antd";
import "antd/dist/antd.css";
import "./VideoStreamingScreen.css";
import ViolationRecord from "./ViolationRecord";
import "./Common.css";

class VideoStreaming extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftImageCamera: "",
      rightImageCamera: "",
    };
    this.socket = new SockJS("http://localhost:8080/gs-guide-websocket");
    //left camera
    this.LeftStomp = require("stompjs");
    this.leftStompClient = this.LeftStomp.over(this.socket);
    //right camera
    this.RightStomp = require("stompjs");
    this.rightStompClient = this.RightStomp.over(this.socket);
  }

  componentDidMount() {
    var self = this;

    //socket left
    // this.leftStompClient.connect({}, (frame) => {
    //     this.leftStompClient.subscribe('/dtvc/left/camera', function (newFrame) {
    //         var tmpFrame = 'data:image/jpeg;base64,' + JSON.parse(newFrame.body)['frame'];
    //         self.setState({leftImageCamera: tmpFrame});
    //     });
    //         this.getFrameOfLeftCamera();
    // });

    //socket right
    this.rightStompClient.connect({}, (frame) => {
      this.rightStompClient.subscribe(
        "/dtvc/right/camera",
        function (newFrame) {
          var tmpFrame =
            "data:image/jpeg;base64," + JSON.parse(newFrame.body)["frame"];
          self.setState({ rightImageCamera: tmpFrame });
        }
      );
      this.getFrameOfRightCamera();
    });
  }

  getFrameOfLeftCamera = (message) => {
    this.leftStompClient.send("/get/left/camera/frame", {}, JSON.stringify({}));
  };

  getFrameOfRightCamera = (message) => {
    this.rightStompClient.send(
      "/get/right/camera/frame",
      {},
      JSON.stringify({})
    );
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.alipay.com/"
          >
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.taobao.com/"
          >
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.tmall.com/"
          >
            3rd menu item
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        <div className="parent-video-streaming wrapper-parent-camera">
          <div>
            <Dropdown overlay={menu} placement="bottomCenter" arrow>
              <Button className="dropbox">Location</Button>
            </Dropdown>
          </div>
          <div className="parent-camera">
            <div className="camera">
              <div>Camera 1</div>
              <img
                src={
                  this.state.leftImageCamera === ""
                    ? require("../image/black.jpg")
                    : this.state.leftImageCamera
                }
                alt="Left camera"
                width={400}
                height={250}
              />
            </div>
            <div className="camera">
              <div>Camera 2</div>
              <img
                src={
                  this.state.rightImageCamera === ""
                    ? require("../image/black.jpg")
                    : this.state.rightImageCamera
                }
                alt="Right camera"
                width={400}
                height={250}
              />
            </div>
          </div>
        </div>
        <ViolationRecord />
      </>
    );
  }
}

export default VideoStreaming;
