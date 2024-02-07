import "../assets/css/Landing.css";
import "@fontsource/cabin/400.css";
import "@fontsource/cabin/600.css";

import EUSL from "../assets/images/EUSL.jpg";
import Logo from "../assets/images/Logo.png";

import MenuIcon from "@mui/icons-material/Menu";

import { IconButton } from "@mui/material";

export default function Landing() {
  return (
    <div className="container">
      <div className="header">
        <div className="brand-navigation-container">
          <div className="brand-container">
            <img className="logo" src={Logo} alt="Logo" />
            <div className="name-container">
              <span className="name">UNICARE</span>
              <span className="slogan">EUSL SRI LANKA</span>
            </div>
          </div>
          <ul>
            <li>
              <a href="#">Home</a>
              <div className="link-line"></div>
            </li>
            <li>
              <a href="#">About us</a>
              <div className="link-line"></div>
            </li>
            <li>
              <a href="#">Contact us</a>
              <div className="link-line"></div>
            </li>
          </ul>
        </div>
        <a className="login" href="medical-centre/login">
          Login
        </a>
        <IconButton className="mobile-menu-button">
          <MenuIcon />
        </IconButton>
      </div>
      <div
        className="home"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${EUSL}')`,
        }}
      ></div>
      <div className="about-us"></div>
    </div>
  );
}
