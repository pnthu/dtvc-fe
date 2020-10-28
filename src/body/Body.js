import * as React from "react";
import { Switch, Route } from "react-router-dom";
import AccountManagement from "../user-management/AccountManagement";
import CameraManagement from "../surveillance-system/CameraManagement";
import Login from "../user-management/Login";
import RecordManagement from "../records/RecordManagement";
import Report from "../report/Report";
import VideoStreaming from "../video-streaming/VideoStreaming";
import Error from "./Error";
import Header from "../components/Header";

class Body extends React.Component {
  render() {
    const role = window.sessionStorage.getItem("role");
    console.log("role", role);
    console.log("props", this.props);
    let routes;
    if (role === "admin") {
      routes = (
        <>
          <Header role={role} />
          <Switch>
            <Route path="/accounts" exact component={AccountManagement} />
            <Route component={Error} />
          </Switch>
        </>
      );
    } else if (role === "moderator") {
      routes = (
        <>
          <Header role={role} />
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
          <Route path="/" exact component={Login} />
        </Switch>
      );
    }
    return <div>{routes}</div>;
  }
}

export default Body;
