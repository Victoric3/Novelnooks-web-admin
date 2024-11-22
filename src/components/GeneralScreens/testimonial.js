import React, { useState, useRef, useEffect } from "react";
import "../../Css/testimonial.css";
import TestimonialItem from "../utilities/testimonial";
import { data } from "../../data/testimonial";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import testimonial from "../../img/testimonial.png";
import configData from "../../config.json";

const Testimonial = () => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSlide === data.length - 1) {
        setCurrentSlide(0);
      } else {
        setCurrentSlide(currentSlide + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const prevSlide = () => {
    if (currentSlide === 0) {
      setCurrentSlide(data.length - 1);
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const nextSlide = () => {
    if (currentSlide === data.length - 1) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };
  const SlideIcon = ({ onClick, type, className }) => {
    return (
      <button
        style={{
          backgroundColor: "transparent",
          color: configData.SpecialColor,
          "&:hover": { backgroundColor: configData.AppColor, color: "#fff" },
          left: "unset !important",
          bottom: "30px",
          right: type === "prev" ? "90px !important" : "30px !important",
          zIndex: 10,
          boxShadow: 1,
          fontSize: "25px",
        }}
        disableRipple
        color="inherit"
        onClick={onClick}
        className={className}
      >
        {type === "next" ? (
          <FaArrowRight style={{ fontSize: "16px" }} />
        ) : (
          <FaArrowLeft style={{ fontSize: "16px" }} />
        )}
      </button>
    );
  };
  return (
    <div id="testimonial" className="testimonial-container">
      <div className="testimonial-flex-container">
        <div className="testimonial-flex-item">
          <h2 className="testimonial-flex-title">
            Testimonial What Our{" "}
            <span
              style={{ color: configData.greenColor, display: "inline-block" }}
            >
              <div style={{display: "flex"}}>
              Customers
              <svg
                width="91px"
                height="12px"
                viewBox="0 0 91 12"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                className="testimonial-svg"
              >
                <path
                  fill="#800080"
                  d="M0.980197061,9.09306521 C25.5681791,0.00152988657 55.1427929,-2.26697742 89.6953818,2.26269565 C90.5167807,2.37037698 91.0953632,3.12354536 90.9876819,3.9449443 C90.8800005,4.76634325 90.1268321,5.3449257 89.3054332,5.23724437 C55.2055398,0.76691744 26.1134869,2.99841013 2.02061792,11.9068748 C1.24360585,12.1941791 0.380806977,11.7971925 0.0935026912,11.0201804 C-0.193801595,10.2431684 0.203184997,9.3803695 0.980197061,9.09306521 Z"
                ></path>
              </svg>
                </div>
            </span>{" "}
            Say
          </h2>
          <div className="testimonial-slider-container">
            <div className="testimonial-slider" ref={sliderRef}>
              {data.map((item, index) => (
                <div
                  key={index}
                  className="slide"
                  style={{
                    transform: `translateX(-${currentSlide + "00"}%)`,
                    transition: 'all 1s ease'
                  }}
                >
                  <TestimonialItem item={item} />
                </div>
              ))}
            </div>
            <div className="slider-controls">
              <SlideIcon onClick={prevSlide} className="prev-slide"/>
              <SlideIcon
                onClick={nextSlide}
                className="next-slide"
                type={"next"}
              />
            </div>
          </div>
        </div>
        <div className="image-container">
          <img src={testimonial} alt="Testimonial img" />
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
