import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Nav = styled.nav`
  height: 80px;
  color: white;
  background-color: #17608d;
`;

const permissions = {
  moderator: [
    { link: "/streaming", name: "Video Streaming" },
    { link: "/cameras", name: "Camera Management" },
    { link: "/records", name: "Reacord Management" },
    { link: "/report", name: "Report" },
  ],
  admin: [{ link: "/accounts", name: "Account Management" }],
};

class Header extends React.Component {
  render() {
    return <Nav>{permissions[this.props.role]}</Nav>;
  }
}

export default Header;
