import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import "../../Css/Login.css";
// import Loader from "../GeneralScreens/Loader";
import login from "../../img/ink-150697_1920-removebg-preview.png";

const LoginScreen = () => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);


  const loginHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      localStorage.setItem('userIdentity', identity)
      const result = await authLogin(identity, password);

      if (result.success && result.role === 'admin') {
        setSuccess("Login successful!");
        setTimeout(() => {
          navigate("/addstory");
        }, 1800);
        setTimeout(() => {
          setSuccess("");
        }, 6000);
      } else if(result.statusCode === 200 && result.role !== 'admin'){
        setError("You need administrative access to do this");
        setTimeout(() => {
          setError("");
        }, 6000);
      } else {
        switch (result.status) {
          case 'not found':
            setError("Please check your email to complete your account creation.");
            break;
          
          case 'unverified email':
            setError("You have not verified your email. Please check your inbox for the verification email.");
            break;
          
          case 'unauthorized':
            setError("Unusual sign-in detected. Please check your email for verification.");
            navigate('/confirmEmailAndSignUp')
            break;
            
            case 'temporary user':
              setError("DownLoad the mobile app and complete signUp");
            break;
          
          default:
            setError(result.message || "An error occurred during login");
        }

        setTimeout(() => {
          setError("");
        }, 6000);
      }
    } catch (error) {
      setError(`Something went wrong: ${error}`);
      setTimeout(() => {
        setError("");
      }, 4500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Inclusive-login-page">
      <div className="login-big-wrapper">
        <div className="section-wrapper">
          <div className="top-login-explain">
            <h2>Login to Your Account </h2>
            <p>Please Login Your Account, Thank You!</p>
          </div>

          <form onSubmit={loginHandler}>
            {error && <div className="error_message">{error}</div>}
            {success && <div className="success_message">{success}</div>}
            
            <div className="input-wrapper">
              <input
                type="string"
                required
                id="identity"
                placeholder="example@gmail.com"
                onChange={(e) => setIdentity(e.target.value.trim())}
                value={identity}
                tabIndex={1}
              />
              <label htmlFor="identity">Email</label>
            </div>
            
            <div className="input-wrapper">
              <input
                type="password"
                required
                id="password"
                autoComplete="true"
                placeholder="6+ strong character"
                onChange={(e) => setPassword(e.target.value.trim())}
                value={password}
                tabIndex={2}
              />
              <label htmlFor="password">Password</label>
            </div>
            
            <button type="submit">{!isLoading ? 'Login' : 'Logging in..'}</button>
            {/* {isLoading && <Loader />} */}
          </form>
        </div>

        <div className="login-banner-section">
          <img src={login} alt="banner" width="400px" />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;