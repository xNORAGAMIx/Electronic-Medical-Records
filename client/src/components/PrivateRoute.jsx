import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const [loading, setLoading] = useState(true);
  
    // authorization check
    useEffect(() => {
      if (!isLoggedIn) {
        navigate("/patient-login", { replace: true });
      } else {
        setLoading(false);
      }
    }, [isLoggedIn, navigate]);
  
    if (loading) {
      return null;  // Prevent rendering content while checking the login status
    }
  
    return children;  // Render the children if the user is logged in
};

export default PrivateRoute;
