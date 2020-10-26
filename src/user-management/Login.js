import * as React from "react";
import { Button } from "antd";

class Login extends React.Component {
  componentDidMount = () => {
    window.sessionStorage.removeItem("role");
  };

  login = () => {
    window.sessionStorage.setItem("role", "moderator");
    this.props.history.push("/streaming");
  };

  render() {
    console.log("props", this.props);
    return (
      <div>
        <Button onClick={this.login}>Login</Button>
      </div>
    );
  }
}

export default Login;
