import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Css/Header.css";
import configData from "../../config.json";
import logo from "../../img/logo.png";
import { useMediaQuery } from "react-responsive";
import NavLinks from "../utilities/navLinks";
import downArrow from "../../img/downarrow.png";
import { BiPhoneOutgoing } from "react-icons/bi";
import { BiMenu, BiX } from "react-icons/bi";
import Drawer from "./Drawer";

const Header = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: "912px" });
  const navigate = useNavigate();
  const navLinks = NavLinks();
  const [showChildren, setShowChildren] = useState(false);
  const [activeIndex, setActiveIndex] = useState("");
  const [dotVisible, setDotVisible] = useState(true);
  const handleHover = (index) => {
    setActiveIndex(index);
    setShowChildren(true);
    setDotVisible(true);
  };

  ///for mobile
  const [showDrawer, setShowDrawer] = useState(false);
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        backdropFilter: "blur(10px)",
        zIndex: 7,
      }}
      id="header"
    >
      <>
        <div className="averager">
          <div className="header_options">
            <div className="logo_container" onClick={() => navigate("/")}>
              <Link to="/">
                <img src={logo} alt="logo" className="logo"/>
              </Link>
              {/* <div className="logo-caption-wrapper"> */}
                <h2
                  style={{ color: configData.whiteColor, cursor: "pointer" }}
                  className='logo_container_h2'
                >{`${configData.Name}`}</h2>
              {/* </div> */}
            </div>

            {isSmallScreen ? (
              <>
                {showDrawer ? (
                  <BiX
                    fontSize="30px"
                    onClick={() => {
                      setShowDrawer(false);
                      document.body.classList.remove("no-scroll");
                    }}
                    color={configData.blackColor}
                  />
                ) : (
                  <BiMenu
                    fontSize="30px"
                    onClick={() => {
                      setShowDrawer(true);
                      document.body.classList.add("no-scroll");
                    }}
                    color={configData.blackColor}
                  />
                )}
              </>
            ) : (
              <div className="nav_link_container">
                {navLinks.map((navLink, index) => {
                  return (
                    <div key={index} className="nav_link">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                          color: configData.whiteColor,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          navLink.children
                            ? setShowChildren(true)
                            : index === navLinks.length - 1 && navLink.func();
                        }}
                      >
                        {activeIndex === index && dotVisible && (
                          <div
                            className="logo-touch"
                            style={{ backgroundColor: configData.AppColor }}
                          ></div>
                        )}
                        <a
                          style={{
                            color: configData.blackColor,
                            textDecoration: "none",
                          }}
                          href={navLink.navLink}
                          onMouseEnter={() => handleHover(index)}
                          onMouseLeave={() => setDotVisible(false)}
                        >
                          <h2>
                            {index === navLinks.length - 1 && (
                              <BiPhoneOutgoing />
                            )}
                            {` ${navLink.navName}`}
                            {navLink.children && (
                              <img
                                src={downArrow}
                                alt="downArrow"
                                style={{
                                  width: "20px",
                                  height: "auto",
                                }}
                              />
                            )}
                          </h2>
                        </a>
                      </div>
                      {showChildren && activeIndex === index ? (
                        <div
                          className="accordion_content"
                          onMouseEnter={() => handleHover(index)}
                          onMouseLeave={() => {
                            setDotVisible(false);
                            setActiveIndex(null);
                            setShowChildren(false);
                          }}
                        >
                          {navLink?.children?.map(
                            (childNavLink, childIndex) => (
                              <div
                                key={childIndex}
                                className="nav_link"
                                onClick={() =>
                                  navigate(`${childNavLink.navLink}`)
                                }
                              >
                                <img
                                  src={childNavLink.img}
                                  alt={`${childNavLink.navName}`}
                                />
                                <h2 style={{ color: "#333" }}>
                                  {childNavLink.navName}
                                </h2>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <hr style={{ margin: 0 }}></hr>
      </>
      {isSmallScreen && showDrawer ? (
        <Drawer setShowDrawer={setShowDrawer} />
      ) : (
        ""
      )}
    </header>
  );
};

export default Header;
