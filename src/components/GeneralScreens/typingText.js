import React from "react";
import { useMediaQuery } from "react-responsive";
import sushmeelaImage from "../../img/portrait-8694041_1920.jpg";
import secondImage from "../../img/ballpoint-pen-62374_1920.jpg";
import star from "../../img/star-fall-svgrepo-com (2).svg";
import spiral from "../../img/spiral-svgrepo-com (2).svg";
import "../../Css/aboutSushmeela.css";

const AboutSushmeela = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 1030 });

  return (
    <div
      className={`container ${isSmallScreen ? "smallScreen" : ""}`}
      id="about"
    >
      <div className="textContainer">
        <h2 className="header">
          <img src={spiral} alt="spiral" className="spiral" />
          Content <span className="typedText">Writing</span> Services You Can
          Trust
          <img src={star} alt="star" className="star2" />
        </h2>
        <p className="paragraph">
          Hi, I’m Sushmeela, a seasoned content writer with over 10 years of
          experience. I specialize in creating engaging, high-converting content
          across various fields, including SEO writing, YouTube scripts, ads
          marketing, and educational content. Let's craft compelling messages
          together!
        </p>
      </div>
      <div className="imageContainer">
        <div className="imageWrapper">
          <img src={sushmeelaImage} alt="Sushmeela" className="image" />
        </div>
        <div className="secondImageWrapper">
          <img src={secondImage} alt="Second" className="image" />
        </div>
          <img src={star} alt="star" className="star1" />
      </div>
    </div>
  );
};

export default AboutSushmeela;
