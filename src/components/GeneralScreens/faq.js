import React, { useState } from 'react';
import '../../Css/faq.css'
const FAQComponent = ({ faqData }) => {
  const [expanded, setExpanded] = useState(null);

  const handleAccordionChange = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div className={`faq-container ${isMobile ? 'mobile' : ''}`}>
      {faqData.map((faq, index) => (
        <div key={index} className="accordion-item">
          <div 
            className={`accordion-header ${expanded === index ? 'expanded' : ''}`} 
            onClick={() => handleAccordionChange(index)}
          >
            <h3>{faq.question}</h3>
            <span className="toggle-icon">
              {expanded === index ? '-' : '+'}
            </span>
          </div>
          <div className={`accordion-content ${expanded === index ? 'expanded' : ''}`}>
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQComponent;
