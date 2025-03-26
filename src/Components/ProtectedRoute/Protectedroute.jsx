/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in (check cookies)
    const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
    if (accessToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(true);
      //navigate('/', { replace: true });
    }
  }, [navigate]);

  return isLoggedIn ? children : null;
};

export default ProtectedRoute;
