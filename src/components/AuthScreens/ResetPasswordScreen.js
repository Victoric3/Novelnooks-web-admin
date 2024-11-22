import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../Css/ResetPasswordScreen.css"
import configData from '../../config.json'
import Loader from "../GeneralScreens/Loader";


const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const search = useLocation().search;
  const token = search.split("=")[1]
  const [isLoading, setIsLoading] = useState(false)

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Passwords don't match");
    }
    try {

      const response = await fetch(`${configData.baseUrl}/auth/resetpassword?resetPasswordToken=${token}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
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
      setError(`something went wrong, please try again: ${error}`);
      
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="Inclusive-resetPassword-page">
      <form
        onSubmit={resetPasswordHandler}
        className="resetpassword-form"
      >

        <h3 >Reset Password</h3>

        {error && <div className="error_msg">{error} </div>}

        {success && (
          <div className="success_msg">
            {success} <Link to="/login">Login</Link>
          </div>
        )}

        <div className="input-wrapper">
          <input
            type="password"
            required
            id="password"
            placeholder="Enter new password"
            autoComplete="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="confirmpassword"> Password</label>
        </div>

        <div className="input-wrapper">

          <input
            type="password"
            required
            id="confirmpassword"
            placeholder="Confirm new password"
            autoComplete="true"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label htmlFor="confirmpassword">Confirm New Password</label>
        </div>
        <button className="resetPass-btn">
          Reset Password
        </button>
        {isLoading && <Loader />}
      </form>
    </div>
  );
};

export default ResetPasswordScreen;