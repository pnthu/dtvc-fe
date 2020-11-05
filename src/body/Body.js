import * as React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import AccountManagement from "../user-management/AccountManagement";
import CameraManagement from "../surveillance-system/CameraManagement";
import Login from "../user-management/Login";
import RecordManagement from "../records/RecordManagement";
import Report from "../report/Report";
import VideoStreaming from "../video-streaming/VideoStreamingScreen";
import Error from "./Error";
import Header from "../components/Header";

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.login = this.login.bind(this);
  }

  login = () => {
    window.sessionStorage.setItem("role", "moderator");
    this.props.history.push("/accounts");
  };

  logout = () => {
    window.sessionStorage.removeItem("role");
    this.props.history.push("/");
  };

  render() {
    const role = window.sessionStorage.getItem("role");
    console.log("role", role);
    console.log("props", this.props);
    let routes;
    if (role === "admin") {
      routes = (
        <>
          <Header role={role} logout={this.logout} />
          <Switch>
            <Route path="/accounts" exact component={AccountManagement} />
            <Route component={Error} />
          </Switch>
        </>
      );
    } else if (role === "moderator") {
      routes = (
        <>
          <Header role={role} logout={this.logout} />
          <Switch>
            <Route path="/streaming" exact component={VideoStreaming} />
            <Route path="/cameras" exact component={CameraManagement} />
            <Route path="/records" exact component={RecordManagement} />
            <Route path="/report" exact component={Report} />
            <Route component={Error} />
          </Switch>
        </>
      );
    } else {
      routes = (
        <Switch>
          <Route
            path="/"
            exact
            component={() => <Login login={this.login} />}
          />
        </Switch>
      );
    }
    return <div>{routes}</div>;
  }
}

export default withRouter(Body);
