import React, { useState, useEffect } from "react";
import { supabase } from "@/client/supabaseClient";
import { useNavigate } from "react-router-dom";
import Button from "@components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";

const SigninSignup = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  if (user) {
    return (
      <div className="relative">
        <Avatar user={user} onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Button
        className="bg-primary-400 C-button"
        name="Sign In"
        path="/sign-in"
      />
      <Button
        className="bg-secondary-400 C-button"
        name="Sign Up"
        path="/sign-up"
      />
    </div>
  );
};

export default SigninSignup;
