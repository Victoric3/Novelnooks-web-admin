import React, { useState } from "react";
import "../../Css/work.css";
import image1 from "../../img/twine.png";
import image2 from "../../img/fiverr.jpg";
import image3 from "../../img/twine.png";
import image4 from "../../img/linkedIn.jpg";
import image5 from "../../img/fiverr.jpg";
import image6 from "../../img/linkedIn.jpg";
import image7 from "../../img/fiverr.jpg";
import image8 from "../../img/twine.png";

const Works = () => {
  const works = [
    {
      id: 1,
      title: "Adidas",
      description: "Lily likes to play with crayons and pencils",
      imgSrc: image1,
    },
    {
      id: 2,
      title: "Jeans",
      description: "Lily likes to play with crayons and pencils",
      imgSrc: image2,
    },
    {
      id: 3,
      title: "Metal",
      description: "Lily likes to play with crayons and pencils",
      imgSrc: image3,
    },
    {
      id: 4,
      title: "Vintage",
      description: "Lily likes to play with crayons and pencils",
      imgSrc: image4,
    },
    {
      id: 5,
      title: "Typers",
      description: "Lily likes to play with crayons and pencils",
      imgSrc: image5,
    },
    {
      id: 6,
      title: "Marco",
      description: "Lily likes to play with crayons and pencils",
      imgSrc: image6,
    },
    {
      id: 7,
      title: "Chinese",
      description: "Lily likes to play with crayons and pencils",
      imgSrc: image7,
    },
    {
      id: 8,
      title: "Dicrap",
      description: "Lily likes to play with crayons and pencils",
      imgSrc: image8,
    },
  ];
  const [hover, setHover] = useState();

  return (
    <div class="works">
      {works.map((work, index) => (
        <div className="work-wrapper">
          <img src={work.imgSrc} alt={`img${work.id}`} className="work-image" />
          <div
            className="work-label-wrapper"
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(null)}
          >
            {hover === index && <div className="image-overlay"></div>}
            <h2 className={`work-title ${hover === index && "show-label"}`}>
              {work.title}
            </h2>
            <p
              className={`work-description ${hover === index && "show-label"}`}
            >
              {work.description}
            </p>
            <a
              href={work.imgSrc}
              title={work.id}
              data-gallery
              className={`work-link ${hover === index && "show-label"}`}
            >
              View more
            </a>
            <div className={`hover-border ${hover === index ? "show" : ""}`}>
              <div className="line top-left"></div>
              <div className="line side-right"></div>
              <div className="line bottom-left"></div>
              <div className="line side-left"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Works;
