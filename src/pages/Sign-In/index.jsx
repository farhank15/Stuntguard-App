import SignInFormTemp from "@/components/templates/SignInFormTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const SignIn = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Sign In</title>
      </Helmet>
      <SignInFormTemp />
    </div>
  );
};

export default SignIn;
