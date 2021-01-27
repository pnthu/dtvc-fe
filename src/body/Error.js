import * as React from "react";
import { Result } from "antd";

class Error extends React.Component {
  render() {
    return <Result status="500" title="Sorry, something went wrong." />;
  }
}

export default Error;
