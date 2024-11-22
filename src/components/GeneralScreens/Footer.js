import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "../../Css/Footer.css";
import configData from "../../config.json";
import logo from "../../img/logo.png";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";
import NavLinks from "../utilities/navLinks";

const Footer = () => {
  const stories = JSON?.parse(localStorage.getItem("stories"));
  const navLinks = NavLinks();
  const navigate = useNavigate();
  const makeSlug = (title) => {
    return slugify(title, {
      replacement: "-",
      remove: /[*+~.()'"!:@/?]/g,
      lower: true,
      strict: false,
      locale: "tr",
      trim: true,
    });
  };

  const handleNavigation = (local) => {
    const titleSlug = makeSlug(local);
    navigate(`/story/${titleSlug}`);
  };

  return (
    <>
      <div className="contact-footer">
        <div className="quick-links">
          <h3>Quick Links</h3>
          <hr className="horizontal-line" />
          <ul>
            {navLinks[1].children.map((nav) => {
              return (
                <li>
                  <a href={nav.navLink}>{nav.navName}</a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="quick-links">
          <h3>Latest Posts</h3>
          <hr className="horizontal-line" />
          <ul>
            {stories?.length !== 0
              ? stories?.slice(0, 9)?.map((story) => {
                  return (
                    <li>
                      <p
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleNavigation(story?.title);
                        }}
                      >
                        {story?.title?.slice(0, 40)}...
                      </p>
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>
        <div className="contact-info">
          <h3>Contact Me</h3>
          <hr className="horizontal-line" />
          <p>
            <span>Phone1:</span>{" "}
            <a href={`${configData.phone1}`}>{`${configData.phone1}`}</a>
          </p>
          <p>
            <span>Phone2:</span>{" "}
            <a href={`${configData.phone2}`}>{`${configData.phone2}`}</a>
          </p>
          <p>
            <span>Email:</span>{" "}
            <a href={`mailto:${configData.email}`}>{`${configData.email}`}</a>
          </p>
          <p>
            <span>Address:</span> {`${configData.location}`}
          </p>
        </div>
        <div className="social-media">
          <h3>Reach Out</h3>
          <hr className="horizontal-line" />
          <ul>
            <li>
              <a
                href={`${configData.faceBook}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook />
              </a>
            </li>
            <li>
              <a href={`${configData.twiter}`} target="_blank" rel="noreferrer">
                <FaXTwitter />
              </a>
            </li>
            <li>
              <a
                href={`${configData.instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
              </a>
            </li>
            <li>
              <a
                href={`${configData.linkedIn}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin />
              </a>
            </li>
            <li>
              <a
                href={`${configData.youtube}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaYoutube />
              </a>
            </li>
          </ul>
          <div className="logo-container">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={logo} alt="King's heart logo" className="logo" />
              <h3>{configData.Name.slice(1)}</h3>
            </div>
            <hr className="horizontal-line" />
            <h4 style={{ color: configData.AppColor }}>
              Breathing into thoughts
            </h4>
          </div>
        </div>
        <hr
          style={{
            display: "block",
            height: "1px",
            width: "100%",
            border: 0,
            borderTop: "1px solid #fff", // Change the color to #fff or another light color
            margin: "1em 0",
            padding: 0,
            color: "#fff", // Change the color to #fff or another light color
          }}
        />

        <div className="copyrigtht">
          <p>
            © {new Date().getFullYear()} {configData.copyright}. All rights
            reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
