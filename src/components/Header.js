import * as React from "react";
import { Popover, Button } from "antd";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import ChangePasswordModal from "../user-management/ChangePasswordModal";
import ChangeProfileModal from "../user-management/ChangeProfileModal";

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
  constructor(props) {
    super(props);
    this.state = {
      profileVisible: false,
      passwordVisible: false,
    };
  }

  onOpenProfile = () => {
    this.setState({ profileVisible: true });
  };

  onCloseProfile = () => {
    this.setState({ profileVisible: false });
  };

  onOpenPassword = () => {
    this.setState({ passwordVisible: true });
  };

  onClosePassword = () => {
    this.setState({ passwordVisible: false });
  };

  render() {
    const content = (
      <div className="popover">
        <Button className="btn-secondary" onClick={this.onOpenProfile}>
          Change Profile
        </Button>
        <Button className="btn-secondary" onClick={this.onOpenPassword}>
          Change Password
        </Button>
        <Button className="btn-secondary" onClick={this.props.logout}>
          Log Out
        </Button>
      </div>
    );

    return (
      <>
        <nav className="header">
          <div className="left">
            <img
              src={require("../logo.svg")}
              alt="logo"
              width={40}
              height={40}
            />
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
              <Popover content={content} placement="bottomRight">
                <FontAwesomeIcon icon={faChevronDown} />
              </Popover>
            </div>
          </div>
        </nav>
        <ChangePasswordModal
          visible={this.state.passwordVisible}
          onCancel={this.onClosePassword}
        />
        <ChangeProfileModal
          visible={this.state.profileVisible}
          onCancel={this.onCloseProfile}
        />
      </>
    );
  }
}

export default Header;
