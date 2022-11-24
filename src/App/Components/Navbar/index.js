// External Imports
import { useState } from "react";
import {
  FaBasketballBall,
  FaHome,
  FaCalculator,
  FaEye,
  FaPhone,
} from "react-icons/fa";
import { Twirl as Hamburger } from "hamburger-react";

// Internal Imports
import Login from "./Login";
import SideMenu from "../SideMenu";

const Navbar = () => {
  // Sets state for color change and using react library to change hamburger menu
  const [color, setColor] = useState("#fffffb");
  // Sets state for sidebar visibility
  const [sideBar, setSideBar] = useState(false);

  return (
    <>
      <div className="navbar-wrapper">
        <div className="navbar-left">
          <div className="navbar-left-icon">
            {" "}
            <FaBasketballBall className="navbar-left-ball" size={"2rem"} />
          </div>
          <div className="navbar-left-title">
            <h1>
              <span>in</span>sights
            </h1>
          </div>
        </div>
        <div className="navbar-right">
          <ul classname="navbar-list">
            <li>
              <a href="/">
                <FaHome className="navbar-list-icon" />
                Home
              </a>
            </li>
            <li>
              <a href="/stats">
                <FaCalculator className="navbar-list-icon" />
                Stats
              </a>
            </li>
            <li>
              <a href="/insights">
                <FaEye className="navbar-list-icon" />
                Insights
              </a>
            </li>
            <li>
              <a href="/contact">
                <FaPhone className="navbar-list-icon" />
                Contact
              </a>
            </li>
          </ul>

          <div className="navbar-btn">
            {/* Toggles between two styled icon components for hamburger menu */}
            <Hamburger
              onToggle={(toggled) => {
                console.log(`Sidebar State:` + sideBar);
                if (toggled) {
                  //menu is open
                  setColor("#e12836");
                  setSideBar(!sideBar);
                } else {
                  //menu is closed
                  setColor("#fffffb");
                  setSideBar(!sideBar);
                }
              }}
              size={30}
              color={color}
              label="Show menu"
            />
          </div>
        </div>
        <Login />
        {/* Toggles sidebar component on and off */}
      </div>
      <SideMenu
        FaHome={<FaHome />}
        FaCalculator={<FaCalculator />}
        FaEye={<FaEye />}
        FaPhone={<FaPhone />}
        sidebar={sideBar}
      />
    </>
  );
};

export default Navbar;
