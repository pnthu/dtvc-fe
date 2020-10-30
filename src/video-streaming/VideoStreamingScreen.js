import * as React from "react";
import SockJS from "sockjs-client";
import { Menu, Dropdown, Button } from "antd";
import "antd/dist/antd.css";
import "./VideoStreamingScreen.css";
import ViolationRecord from "./ViolationRecord";
import "./Common.css";

class VideoStreaming extends React.Component {
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
              <img src={require("../image/black.jpg")} alt="Left camera" />
            </div>
            <div className="camera">
              <div>Camera 2</div>
              <img src={require("../image/black.jpg")} alt="Right camera" />
            </div>
          </div>
        </div>
        <ViolationRecord />
      </>
    );
  }
}

export default VideoStreaming;
