import * as React from "react";
import { NavLink } from "react-router-dom";
import "./header.css";

const permissions = {
  moderator: [
    { link: "/streaming", name: "Video Streaming" },
    { link: "/cameras", name: "Camera Management" },
    { link: "/records", name: "Record Management" },
    { link: "/report", name: "Report" },
  ],
  admin: [{ link: "/accounts", name: "Account Management" }],
};

class Header extends React.Component {
  render() {
    console.log("props", this.props);
    return (
      <nav className="header">
        <div className="left">
          <img src={require("../logo.svg")} width={40} height={40} />
        </div>
        <div className="right">
          {permissions[this.props.role] instanceof Array &&
            permissions[this.props.role].map((permission) => {
              return (
                <NavLink
                  to={permission.link}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  {permission.name}
                </NavLink>
              );
            })}
          <div>Hello, User</div>
        </div>
      </nav>
    );
  }
}

export default Header;
