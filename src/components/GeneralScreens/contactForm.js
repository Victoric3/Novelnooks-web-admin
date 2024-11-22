import React, { useState } from "react";
import "../../Css/contact.css";
import configData from "../../config.json";
import instance from "../../Context/axiosConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiCalendarEvent } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import Loader from "./Loader";

const ContactForm = ({ title }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to toggle calendar
  const [isLoading, setIsLoading] = useState(false)
  
  
  const submit = async (e) => {
    e.preventDefault();
    if(!date){
      return alert("please pick a date, by clicking the top right icon")
    }
    const formattedDate = date?.toLocaleString();
    const form = { name, email, service, budget, message, date: formattedDate };
    try{
      setIsLoading(true)
      const { data } = await instance.post("/call/scheduleCall", form, {
        headers: {
        "content-type": "application/json",
      }});
      if(data.status === 'success'){
        alert('success! ' + data.message)
        setIsLoading(false)
      }
    }catch(error){
      // console.log(error);
      setIsLoading(false)
      alert(error?.response?.data?.errorMessage || "Something went wrong")
    }
  };

  const serviceTypes = [
    "SEO content writing",
    "YouTube scripts",
    "Ads Marketing",
    "Blog posts",
    "Social media content",
    "Financial advice",
    "Educational content",
  ];

  return (
    <>
    <div className="form-container">
      {isLoading && <Loader />}
      <div className="form-title">
        <h2 style={{fontSize: '25px'}}>{title}</h2>
        {!isCalendarOpen ? (
          <p
            style={{ cursor: "pointer" }}
            onClick={() => setIsCalendarOpen(true)}
          >
            {date ? date.toLocaleString() : "Pick a date"} <BiCalendarEvent />
          </p>
        ) : (
          <p
            style={{ cursor: "pointer" }}
            onClick={() => setIsCalendarOpen(false)}
          >
            Close <IoClose />
          </p>
        )}
      </div>

      {isCalendarOpen ? (
        <DatePicker
          selected={date}
          onChange={(date) => {
            setDate(date);
          }}
          showTimeSelect
          dateFormat="Pp"
          inline
        />
      ) : (
        <form className="form" onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="service">Which service are you interested in?</label>
            <select
              id="service"
              name="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              className="form-input"
            >
              <option value="" disabled>Select a service</option>
              {serviceTypes.map((serviceType, index) => (
                <option key={index} value={serviceType}>
                  {serviceType}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="budget">What is your budget (in USD)?</label>
            <input
              type="text"
              id="budget"
              name="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g., 1000-5000"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              />
          </div>
          <button
            type="submit"
            className="submit-button"
            style={{ background: configData.AppColor }}
          >
            Send
          </button>
        </form>
      )}
    </div>
            </>
  );
};

export default ContactForm;
