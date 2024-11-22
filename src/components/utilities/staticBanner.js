import React from "react";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import configData from "../../config.json";

const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #6a1b9a;
  min-height: 600px;
`;

const TextContainer = styled.div`
  flex: 1;
  padding: 0px 10px;
`;

const ImageContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

const StaticBanner = () => {
  const isMobile = useMediaQuery({ maxWidth: "912px" });

  return (
    <BannerContainer style={{ padding: isMobile ? "2px" : "10px 70px" }}>
      <TextContainer>
        <h2 style={{ fontSize: "30px", color: configData.whiteColor }}>
          Dedicated Services
        </h2>
        <h2 style={{ fontSize: "40px", color: configData.whiteColor }}>
          We Are Here To Empower Your Online Venture
        </h2>
        <p style={{ color: configData.whiteColor, fontSize: "20px" }}>
          Guide your online venture with a skilled project manager, navigating
          each step of your digital business launch.
        </p>
        <p style={{ color: configData.whiteColor, fontSize: "20px" }}>
          {" "}
          Speed up your path to market with a specialized team of experts from a
          leading tech agency.{" "}
        </p>
        <p style={{ color: configData.whiteColor, fontSize: "20px" }}>
          {" "}
          Optimize your resources with a dedicated project manager overseeing
          all operations, allowing more funds for strategic marketing and
          scalable growth.
        </p>
        <button
          style={{
            color: configData.whiteColor,
            background: configData.AppColor,
            padding: "8px 15px", // Adjust padding for a more compact look
            borderRadius: "5px",
            border: "none", // Remove border
            cursor: "pointer", // Add cursor pointer for better usability
          }}
        >
          Get Started
        </button>
      </TextContainer>
      {!isMobile?
      <ImageContainer>
        <Image
          src="https://i.ibb.co/9rjyBW4/Default-premuim-showcase-of-agency-2-removebg-preview.png"
          alt="Banner Image"
        />
      </ImageContainer> : ''}
    </BannerContainer>
  );
};

export default StaticBanner;
