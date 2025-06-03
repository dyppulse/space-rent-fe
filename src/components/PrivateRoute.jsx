import { useEffect } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const myToken = localStorage.getItem("token")
  const [token, setToken] = useState(localStorage.getItem("token"))
  useEffect(() => {
    if(myToken){
      setToken(myToken)
    }else{
      setToken(null)
    }
  }, [myToken])
  // const token  = useState(localStorage.getItem("token"))
  return token ? children : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
