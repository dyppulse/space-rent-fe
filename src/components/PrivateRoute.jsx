import { useState } from 'react';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"))

  // useEffect(() => {
  //   if(localStorage.getItem("token")){
  //     setToken(localStorage.getItem("token"))
  //   }else{
  //     setToken(null)
  //   }
  // }, [localStorage.getItem('token')])
  return token ? children : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
