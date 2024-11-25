import React, { useState, useEffect, useCallback } from "react";
import instance from "./axiosConfig";
import { getDeviceInfo, getLocationInfo, getIpAddress } from './deviceHelpers';

export const AuthContext = React.createContext();

const AuthContextProvider = props => {
  const [callScheduled, setCallScheduled] = useState(false);
  const [activeUser, setActiveUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const setToken = (token) => {
    if (token) {
      // Store in localStorage
      localStorage.setItem('authToken', token);
      // Update axios instance headers
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const clearToken = () => {
    // Clear from localStorage
    localStorage.removeItem('authToken');
    // Remove from axios instance headers
    delete instance.defaults.headers.common['Authorization'];
  };

  const logout = () => {
    try {
      clearToken();
      // Clear all other cookies
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
      setActiveUser({});
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const login = async (identity, password) => {
    try {
      if(isLoading) return;
      setIsLoading(true);

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

      const response = await instance.post("/user/login", loginData);
      
      const status = response.data?.status || 'failed';
      const statusCode = response.status || 500;
      const message = response.data?.message || response.data?.errorMessage;
      const role = response.data?.role || null;
      const token = response.data?.token;

      if (statusCode === 200 && role === 'admin' && token) {
        setToken(token);
        setActiveUser(response.data.user);
        return { 
          success: true, 
          message: message || "Login successful",
          statusCode: 200,
          role: role
        };
      }

      logout();
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

      if (error.response) {
        errorMessage = error.response.data?.errorMessage || error.response.data?.message || errorMessage;
        errorStatus = error.response.data?.status || errorStatus;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
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

  const checkAuthStatus = useCallback( async () => {
    try {
      setIsLoading(true);
      // Get token from localStorage or cookie
      const token = localStorage.getItem('authToken') || document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
      
      if (token) {
        // Set token in axios headers
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await instance.get("/user/private");
        setActiveUser(data.user);
      } else {
        setActiveUser({});
      }
    } catch (error) {
      clearToken();
      setActiveUser({});
    } finally {
      setIsLoading(false);
    }
  }, [])

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value = {
    activeUser,
    setActiveUser,
    login,
    logout,
    isLoading,
    callScheduled,
    setCallScheduled
  };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;