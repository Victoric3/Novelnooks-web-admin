import { useEffect, useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LoginScreen from "../AuthScreens/LoginScreen";
import instance from '../../Context/axiosConfig';
import { AuthContext } from "../../Context/AuthContext";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { setActiveUser } = useContext(AuthContext);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Since withCredentials is true in axios instance,
        // cookies will be automatically sent
        const response = await instance.get("/user/private");
        
        if (response.data?.user) {
          setIsAuthenticated(true);
          setActiveUser(response.data.user);
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
          console.log(error);
          // Handle different error scenarios
        if (error?.response?.status === 401) {
            alert("no cookie data present")
            setIsAuthenticated(false);
            setActiveUser({});
          // // Session expired
          navigate('/', { 
            state: { 
              message: 'Session expired. Please log in again.' 
            }
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [navigate, setActiveUser]);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <LoginScreen />;
};

export default PrivateRoute;