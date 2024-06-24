import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Avatar from "react-avatar";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const SigninSignup = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("user_session");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserData(decodedToken);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
        setIsLoggedIn(false);
      }
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("user_session");
    setIsLoggedIn(false);
    setUserData(null);
    Swal.fire({
      title: "Berhasil",
      text: "Berhasil logout!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      navigate("/");
      window.location.reload();
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex items-center gap-3">
      {isLoggedIn ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="btn btn-ghost btn-circle avatar"
          >
            <Avatar name={userData.email} size="40" round={true} />
          </button>
          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <Link
                  to={
                    userData.role === "admin"
                      ? `/admin-dashboard/${userData.id}`
                      : `/dashboard/${userData.id}`
                  }
                  className="justify-between"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <>
          <Link to="/sign-in" className="btn btn-primary text-white">
            Sign In
          </Link>
          <Link to="/sign-up" className="btn btn-secondary text-white">
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

export default SigninSignup;
