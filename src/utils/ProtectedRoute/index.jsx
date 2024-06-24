import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, role }) => {
  const token = Cookies.get("user_session");

  if (!token) {
    return <Navigate to="/sign-in" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;

    // Redirect to home if role is not matching
    if (role && userRole !== role) {
      return <Navigate to="/" />;
    }

    // Redirect to sign-in if token is expired
    if (decodedToken.exp * 1000 < Date.now()) {
      Cookies.remove("user_session");
      return <Navigate to="/sign-in" />;
    }

    return children;
  } catch (error) {
    console.error("Token tidak valid:", error);
    Cookies.remove("user_session");
    return <Navigate to="/sign-in" />;
  }
};

export default PrivateRoute;
