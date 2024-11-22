import React, { useState, useEffect } from "react";
import instance from "./axiosConfig";
import { getDeviceInfo, getLocationInfo, getIpAddress } from './deviceHelpers';

export const AuthContext = React.createContext();

const AuthContextProvider = props => {
  const [callScheduled, setCallScheduled] = useState(false);
  const [activeUser, setActiveUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios instance to include credentials
  instance.defaults.withCredentials = true;

  const logout = () => {
    try {
      // Clear all cookies by setting their expiration date to the past
      const cookies = document.cookie.split(";");
  
      for (const cookie of cookies) {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
  
      // Clear the active user state
      setActiveUser({});
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  

  const login = async (identity, password) => {
    try {
      if(isLoading) return;
      setIsLoading(true);

      // Gather all required information
      const [locationData, ipAddress] = await Promise.all([
        getLocationInfo(),
        getIpAddress()
      ]);
      
      const deviceInfo = getDeviceInfo();

      const loginData = {
        identity,
        password,
        location: {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        },
        ipAddress,
        deviceInfo: {
          deviceType: deviceInfo.deviceType,
          os: deviceInfo.os,
          appVersion: deviceInfo.appVersion,
          uniqueIdentifier: deviceInfo.uniqueIdentifier,
        }
      };
      console.log('loginData: ', loginData);
      const response = await instance.post("/user/login", loginData);
      
      // Check if response has a status property
      const status = response.data?.status || 'failed';
      const statusCode = response.status || 500;
      const message = response.data?.message || response.data?.errorMessage;
      const role = response.data?.role || null

      if (statusCode === 200 && role === 'admin') {
        // setActiveUser(response.data.user);
        return { 
          success: true, 
          message: message || "Login successful",
          statusCode: 200,
          role: role
        };
      }

      // For non-successful responses
      logout()
      return {
        success: false,
        status: status,
        statusCode: statusCode,
        message: statusCode === 200 && role !== 'admin' ? 'Oops! this portal is only for admins' : message || "Login failed"
      };

    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "An error occurred during login";
      let errorStatus = "error";

      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.errorMessage || error.response.data?.message || errorMessage;
        errorStatus = error.response.data?.status || errorStatus;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }

      return {
        success: false,
        status: errorStatus,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const { data } = await instance.get("/user/private");
      setActiveUser(data.user);
    } catch (error) {
      setActiveUser({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    activeUser,
    setActiveUser,
    login,
    logout,
    isLoading,
    callScheduled,
    setCallScheduled
  };

  // Remove this condition to prevent context from disappearing
  // if (isLoading) {
  //   return null;
  // }

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;