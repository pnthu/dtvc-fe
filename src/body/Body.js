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
import ActivateAccount from "../user-management/ActivateAccount";

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.login = this.login.bind(this);
    this.state = {
      error: null,
    };
  }

  login = (data) => {
    fetch("http://localhost:8080/auth/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((Response) => Response.json())
      .then((user) => {
        if (user === null) {
          this.setState({
            error: "Wrong username or password. Please try again.",
          });
        } else if (user.status === "active") {
          window.sessionStorage.setItem("role", user.role.name);
          window.sessionStorage.setItem("fullname", user.fullname);
          window.sessionStorage.setItem("username", user.username);
          if (user.role.name === "moderator") {
            this.props.history.push("/records");
          } else if (user.role.name === "admin") {
            this.props.history.push("/accounts");
          }
          this.setState({ error: null });
        } else {
          this.setState({
            error:
              "This account has been deactivated. Please contact the administrator.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
            {/* <Route path="/streaming" exact component={VideoStreaming} /> */}
            <Route path="/records" exact component={RecordManagement} />
            <Route path="/cameras" exact component={CameraManagement} />
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
            component={() => (
              <Login login={this.login} error={this.state.error} />
            )}
          />
          <Route path="/confirm" component={ActivateAccount} />
        </Switch>
      );
    }
    return routes;
  }
}

export default withRouter(Body);
