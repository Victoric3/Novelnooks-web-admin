import { useState } from "react";
import { Link } from "react-router-dom";
import "../../Css/ForgotPassword.css"
import { BsArrowBarLeft } from 'react-icons/bs'
import configData from '../../config.json'
import Loader from "../GeneralScreens/Loader";


const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true)

    try {
      const response = await fetch(`${configData.baseUrl}/auth/forgotpassword`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false)
        setSuccess(data.message);
      } 
      if(!response.ok) {
        setIsLoading(false)
        setError(data.errorMessage);
        setTimeout(() => {
          setError("");
        }, 5000);
      }

    } catch (error) {
      setIsLoading(false)
      setError(error || 'something went wrong');
      setEmail("");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  

  return (
    <div className="Inclusive-forgotPassword-page">

      <div className="forgotPassword-big-wrapper">
        <Link to="/" className="back_home">
          <BsArrowBarLeft />
        </Link>
        <form
          onSubmit={forgotPasswordHandler}
          >
          <div className="top-forgotpassword-explain">
            <h3 >Forgot Password</h3>
            <p >
              Please enter the email address you register your account with. We
              will send you reset password confirmation to this email
            </p>
          </div>

          {error && <div className="error_message">{error}</div>}
          {success && <div className="success_message  ">{success}  -
            <Link to="/" className="ml-3">Go home</Link></div>}

          <div className="input-wrapper">

            <input
              type="email"
              required
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">E-mail</label>

          </div>

          <button type="submit">
            Send Email
          </button>
        {isLoading && <Loader />}
        </form>

      </div>

    </div>

  );
};

export default ForgotPasswordScreen;