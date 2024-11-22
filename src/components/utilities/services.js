import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import NavLinks from "../utilities/navLinks";
import configData from '../../config.json'
import { useMediaQuery } from "react-responsive";
const ServicesComponent = () => {
  const isSmallScreen = useMediaQuery({maxWidth: '912px'})
  const containerStyle = {
    display: "flex",
    flexWrap: "noWrap",
    justifyContent: isSmallScreen ? "flex-start" : "center",
    gap: isSmallScreen && '15px',
    padding: '0px 15px',
    width: "100%",
    overflowX: "auto",
  };

  const serviceItemStyle = {
    textDecoration: "none",
    textAlign: "center",
    width: "200px",
  };

  const serviceIconStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "10px",
  };

  const serviceNameStyle = {
    fontSize: "15px",
    fontWeight: "bold",
    marginTop: "10px",
    color: configData.greenColor,
    whiteSpace: 'nowrap'
  };
  const navLinks = NavLinks();
  const navigate = useNavigate();
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px'}}>
    <h2 style={{color: configData.greenColor, marginBottom: '30px'}}>Range of Expert Services</h2>
    <div style={containerStyle}>
      {navLinks[1].children.map((service, index) => (
        <Link onClick={() => navigate(service.navLink)} key={index} style={serviceItemStyle}>
          <img
            src={service.img}
            alt={service.navName}
            style={serviceIconStyle}
          />
          <h2 style={serviceNameStyle}>{service.navName}</h2>
        </Link>
      ))}
    </div>
  </div>
  );
};

export default ServicesComponent;
