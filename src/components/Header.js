import * as React from "react";
import { Popover, Button } from "antd";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

const permissions = {
  moderator: [
    { link: "/streaming", name: "Video Streaming" },
    { link: "/cameras", name: "Surveillance System" },
    { link: "/records", name: "Records" },
    { link: "/report", name: "Report" },
  ],
  admin: [{ link: "/accounts", name: "Account Management" }],
};

class Header extends React.Component {
  content = (
    <div className="popover">
      <Button className="btn-secondary">Change Password</Button>
      <Button className="btn-secondary" onClick={this.props.logout}>
        Log Out
      </Button>
    </div>
  );

  render() {
    console.log("props", this.props);
    return (
      <nav className="header">
        <div className="left">
          <img src={require("../logo.svg")} alt="logo" width={40} height={40} />
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
          <div className="headerRight">
            <div>Hello, User</div>
            <Popover content={this.content} placement="bottomRight">
              <FontAwesomeIcon icon={faChevronDown} />
            </Popover>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
