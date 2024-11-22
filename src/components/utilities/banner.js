import React, { useState, useEffect } from 'react';
import bannerTextData from './bannerTextData';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import configData from '../../config.json'

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: '912px' });
  const navigate = useNavigate()
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerTextData.length);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);



  
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };
  const maxDotsToShow = bannerTextData.length;
  const startDotIndex = Math.max(0, currentIndex - Math.floor(maxDotsToShow / 2));
  const endDotIndex = Math.min(bannerTextData.length - 1, startDotIndex + maxDotsToShow - 1);


  return (
    <>
    <div style={{
        width: '100%',
        background: configData.baseColor,
        display: isMobile? '' : 'flex',
        height: 'auto',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: isMobile ? '0px' : '50px'
        }}>
    <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        margin: isMobile ? '0%' : '0% 5%',
        alignItems: 'center',
        alignSelf: 'center',
        padding: isMobile ? '0 10px' : '0',
        gap: isMobile? "10px" : "40px",
        justifyContent: isMobile? 'center' : 'space-between',
    }}>

      <div style={{ 
          display: 'flex',
          flexDirection: "column",
          gap: '10px',
          maxWidth: isMobile? '100%' : '50%'
        }}>
        <h5 style={{color:"#e0e0e0"}}>
          {bannerTextData[currentIndex].title}
        </h5>
        <h3 style={{ color: configData.AppColor }}>
          {bannerTextData[currentIndex].caption}
        </h3>
        <h5 style={{color: '#e0e0e0'}}>
          {bannerTextData[currentIndex].description}
        </h5>
        <button onClick={() => {navigate('/signUp')}} style={{borderRadius: '20px',  color:"#e0e0e0", padding: '15px 30px', width: '145px', background: configData.AppColor}}>
          Get Started
        </button>
      </div>
      <img
        style={{
          width: isMobile? "100%" : "400px",
          height: isMobile ? "auto" : "400px",
          animation: 'fade 5s infinite',
          transition: 'opacity 1s',
          borderRadius: '50px',
        }}
        src={bannerTextData[currentIndex].image}
        alt={`banner ${currentIndex + 1}`}
      />
    </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {bannerTextData.slice(startDotIndex, endDotIndex + 1).map((_, index) => (
          <div
            key={startDotIndex + index}
            onClick={() => handleDotClick(startDotIndex + index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: startDotIndex + index === currentIndex ? configData.AppColor : '#bbb',
              margin: '5px',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
      </div>
            </>      
  );
}

export default Banner;
