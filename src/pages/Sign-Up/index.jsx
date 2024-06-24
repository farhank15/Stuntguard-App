import SignUpFormTemp from "@/components/templates/SignUpFormTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const SignUp = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Sign Up</title>
      </Helmet>
      <SignUpFormTemp />
    </div>
  );
};

export default SignUp;
