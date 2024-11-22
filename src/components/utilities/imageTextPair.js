import React from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import configData from "../../config.json";

const SectionContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.inverted ? "row-reverse" : "row")};
  align-items: center;
  justify-content: space-between;
  background: ${(props) => (props.inverted ? "#f5f5f5" : "")};
  min-height: 200px; /* Set a minimum height for the section */

  .image-content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
  }

  img {
    max-height: 100%;
    max-width: 100%;
    border-radius: 20px;
  }

  button {
    color: white;
    padding: 15px 30px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 18px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #00529b;
  }
`;

const LandingPageSection = ({
  caption,
  description,
  buttonText,
  imageUrl,
  inverted,
}) => {
  const isMobile = useMediaQuery({ maxWidth: "600px" });

  return (
    <SectionContainer
      inverted={inverted}
      style={{ padding: !isMobile ? "50px 70px" : "0px" }}
    >
      <div
        style={{
          padding: isMobile ? "20px" : "40px",
          width: isMobile ? "100%" : "60%"
        }}
      >
        <h2
          gutterBottom
          style={{ color: configData.AppColor, fontSize: "30px", marginBottom: '10px'}}
        >
          {caption}
        </h2>
        <h3 paragraph style={{ color: configData.baseColor, fontSize: "20px" }}>
          {description}
        </h3>
        <button style={{backgroundColor: configData.AppColor, marginTop: '10px'}}>{buttonText}</button>
      </div>
      <div className="image-content">
        {isMobile ? "" : <img src={imageUrl} alt="Landing Page" />}
      </div>
    </SectionContainer>
  );
};

export default LandingPageSection;
