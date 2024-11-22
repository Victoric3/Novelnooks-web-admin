import React from "react";
import "../../Css/testimonial-item.css";

const TestimonialItem = ({ item }) => {
  return (
    <div className="testimonial-item">
      <div className="testimonial-header">
        <h2 className="testimonial-title">{item.title}</h2>
        <p className="testimonial-content">{item.content}</p>
      </div>
      <div className="testimonial-box">
        <div className="testimonial-avatar">
          <img
            src= {item.user.photo}
            alt={item.user.name}
          />
        </div>
        <div>
          <h3 className="testimonial-user-name">{item.user.name}</h3>
          <p className="testimonial-user-professional">
            {item.user.professional}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialItem;
