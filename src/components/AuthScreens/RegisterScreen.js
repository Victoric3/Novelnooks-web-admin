import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/Register.css";
import configData from "../../config.json";
import Loader from "../GeneralScreens/Loader";
import register from '../../img/educational_content-removebg-preview.png'

const RegisterScreen = ({ admin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };
  const navigate = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (password !== confirmpassword) {
      setIsLoading(false);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 8000);
      return setError("Passwords do not match");
    }
    try {
      const response = await fetch(
        `${
          configData.dev ? "http://localhost:5000" : configData.baseUrl
        }/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            adminPassword: admin? adminPassword : null,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setSuccess(data.message);
        setTimeout(() => {
          navigate("/confirmEmailAndSignUp/null");
        }, 1800);
        setTimeout(() => {
          setSuccess("");
        }, 6000);
      }
      if (!response.ok) {
        setIsLoading(false);
        setError(data.errorMessage);
        setTimeout(() => {
          setError("");
        }, 6000);
      }
    } catch (error) {
      setIsLoading(false);
      setError("something went wrong");
      setTimeout(() => {
        setError("");
      }, 6000);
    }
  };

  return (
    <div className="Inclusive-register-page">
      <div className="register-big-wrapper">
        <div className="register-banner-section ">
          <img src={register} alt="banner" width="490px" />
        </div>

        <div className="section-wrapper">
          <div className="top-suggest_login">
            <span> Have an account? </span>
            <a href="/login">Sign In</a>
          </div>

          <div className="top-register-explain">
            <h2>Welcome to {configData.Name} </h2>
            {admin ? (
              <p>
                Sign up as an admin of sushmeela's portfolio site in order to
                manage data and call schedules.
              </p>
            ) : (
              <p>
                Sign up to read and comment on Sushmeela's latest posts, and
                stay updated with her newest content.
              </p>
            )}
          </div>

          <form onSubmit={registerHandler}>
            {error && <div className="error_message">{error}</div>}
            {success && <div className="success_message">{success}</div>}
            <div className="input-wrapper">
              <input
                type="text"
                required
                id="name"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="name">Username</label>
            </div>
            <div className="input-wrapper">
              <input
                type="email"
                required
                id="email"
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                tabIndex={1}
              />
              <label htmlFor="email">E-mail</label>
            </div>
            {admin && <div className="input-wrapper">
              <input
                type="password"
                required
                id="adminPassword"
                autoComplete="true"
                placeholder="Admin Passwork"
                onChange={(e) => setAdminPassword(e.target.value)}
                value={adminPassword}
                tabIndex={2}
              />
              <label htmlFor="adminPassword">Admin Password</label>
            </div>}
            <div className="input-wrapper">
              <input
                type="password"
                required
                id="password"
                autoComplete="true"
                placeholder="6+ strong character"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                tabIndex={2}
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="input-wrapper">
              <input
                type="password"
                required
                id="confirmpassword"
                autoComplete="true"
                placeholder="Confirm password"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmpassword">Confirm Password</label>
            </div>

            <div style={{ position: "relative", display: "flex" }}>
              <div style={{ marginTop: "-12px" }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div>
                <label>
                  I agree to the{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/terms-of-service" target="_blank" rel="noopener">
                    Terms of Service
                  </a>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={!checked}
              style={{ background: checked ? "" : "#7EF29B" }}
            >
              Register
            </button>
            {isLoading && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
