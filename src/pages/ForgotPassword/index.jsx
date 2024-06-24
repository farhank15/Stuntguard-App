import React from "react";
import ForgotPasswordTemp from "@/components/templates/ForgotPasswordTemp";
import { Helmet } from "react-helmet-async";

const ForgotPassword = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Forgot Password</title>
      </Helmet>
      <ForgotPasswordTemp />
    </div>
  );
};

export default ForgotPassword;
