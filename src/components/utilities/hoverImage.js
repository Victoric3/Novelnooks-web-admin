import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import '../../Css/hoverImage.css';

const HoverImage = ({ src, label }) => {
  const [hover, setHover] = useState(false);
  const isSmallScreen = useMediaQuery({ maxWidth: "1030px" });

  return (
    <div
      className={`hover-image-container ${isSmallScreen ? 'mobile' : 'desktop'}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
        <div className={hover ? 'image-overlay' : ''}></div>
      <img src={src} alt={label} className={`image ${hover ? 'scale' : ''}`} />
      <div className={`label ${hover? 'show' : ''}`}>{label}</div>
      <div className={`hover-border ${hover? 'show' : ''}`}>
        <div className="line top-left"></div>
        <div className="line side-right"></div>
        <div className="line bottom-left"></div>
        <div className="line side-left"></div>
      </div>
    </div>
  );
};

export default HoverImage;
