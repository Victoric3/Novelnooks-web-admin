import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import SearchForm from "./SearchForm";
import { RiPencilFill } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { AuthContext } from "../../Context/AuthContext";
import configData from "../../config.json";
import logo from "../../img/logo.png";
import "../../Css/headerStory.css";

const HeaderStory = () => {
  const { activeUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    try {
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getStoryActionText = () => {
    console.log(location.pathname)
    switch(location.pathname) {
      case '/addstory':
        return 'Edit Story';
      case '/editstory':
        return 'Add Story';
      default:
        return 'Add Story';
    }
  };

  const handleStoryAction = () => {
    console.log(location.pathname)
    switch(location.pathname) {
      case '/addstory' || '/addStory':
        navigate('/editstory');
        break;
      case '/editstory':
        navigate('/addstory');
        break;
      default:
        navigate('/editstory');
    }
  };

  return (
    <header className="header-story">
      <div className="header-container">
        <div className="logo-section" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="logo" />
          <h2>{configData.Name}</h2>
        </div>

      {/* <SearchForm /> */}

        <div className="user-actions">
          {activeUser && Object.keys(activeUser).length > 0 ? (
            <div className="authenticated-user">
              {activeUser.role === "admin" && (
                <button
                  onClick={handleStoryAction}
                  className="add-story-btn"
                  style={{
                    backgroundColor: configData.AppColor,
                    color: 'white',
                    border: 'none'
                  }}
                >
                  <RiPencilFill /> {getStoryActionText()}
                </button>
              )}

              <div
                className="user-profile"
                onClick={toggleDropdown}
              >
                <img
                  src={activeUser.photo || 'default-avatar.png'}
                  alt={activeUser.username || 'User'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'default-avatar.png';
                  }}
                />
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <button onClick={handleStoryAction} className="dropdown-item" style={{border: "none"}}>
                        <RiPencilFill /> {getStoryActionText()}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-btn"
                    >
                      <BiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="unauthenticated-user">
              <Link to="/" className="login-btn">Login</Link>
              <Link
                // to="/register"
                className="register-btn"
                style={{
                  backgroundColor: configData.AppColor,
                  color: 'white'
                }}
                onClick={() => alert("DownLoad the mobile app and complete signUp")}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderStory;