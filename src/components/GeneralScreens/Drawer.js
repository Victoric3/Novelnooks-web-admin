import { useState } from "react";
import "../../Css/Header.css";
import NavLinks from "../utilities/navLinks";
import { BiPhoneOutgoing } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import configData from "../../config.json";

const Drawer = ({ setShowDrawer }) => {
  const navigate = useNavigate();
  const navLinks = NavLinks();
  const [showChildren, setShowChildren] = useState(false);
  const handleClick = () => {
    setShowChildren(!showChildren);
  };
  const callSchedule = (navLink) => {
    navLink.func();
    setShowDrawer(false);
  };

  const handleNavClick = () => {
    setShowChildren(false);
    setShowDrawer(false);
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          gap: "15px",
          background: "#111",
          height: "calc(100vh - 85px)",
          marginTop: "85px",
        }}
        onClick={() => showChildren && setShowChildren(false)}
      >
        {navLinks.map((navLink, index) => {
          return (
            <div
              key={index}
              className="nav_link"
              onClick={() => {
                document.body.classList.remove("no-scroll");
                navLink.children
                  ? handleClick(index)
                  : index === navLinks.length - 1
                  ? callSchedule(navLink)
                  : handleNavClick()
              }}
            >
              <a
                style={{
                  color: configData.blackColor,
                  textDecoration: "none",
                }}
                href={navLink.navLink}
              >
                <h2 style={{ color: "#fff", fontSize: "22px" }}>
                  {index === navLinks.length - 1 && <BiPhoneOutgoing />}
                  {` ${navLink.navName}`}
                  {navLink.children && <BiDownArrow />}
                </h2>
              </a>

              {showChildren ? (
                <div
                  className="accordion_content"
                  style={{
                    left: 0,
                    top: 0,
                    transform: "none",
                    width: "100%",
                    display: !showChildren && "none",
                  }}
                >
                  {navLink?.children?.map((childNavLink, childIndex) => (
                    <div
                      key={childIndex}
                      className="nav_link"
                      onClick={() =>
                        showChildren && navigate(`${childNavLink.navLink}`)
                      }
                    >
                      <img
                        src={childNavLink.img}
                        alt={`${childNavLink.navName}`}
                      />
                      <h2 style={{ color: "#333" }}>{childNavLink.navName}</h2>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Drawer;
