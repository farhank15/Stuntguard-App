import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SigninSignup from "@components/molecules/Signin-Signup";
import Logo from "@assets/images/logos/stuntguard.svg";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = Cookies.get("user_session"); // Adjust the cookie name to match your auth token cookie
    if (token) {
      setIsAuthenticated(true);
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }

    const handleDocumentClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleMenuClick = (event) => {
    event.preventDefault();
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  const handleLinkClick = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <div className="navbar absolute font-poppins z-50 py-2 px-2 xl:px-20 bg-slate-50 font-medium">
      <div className="navbar-start">
        <div className="dropdown" ref={dropdownRef}>
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {dropdownOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm text-sm dropdown-content mt-3 z-[1] p-2 shadow-lg border-2 border-slate-200 bg-slate-50 rounded-box w-52"
            >
              <li>
                <Link to="/" onClick={handleLinkClick}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={handleLinkClick}>
                  About
                </Link>
              </li>
              <li>
                <p>Fitur</p>
                <ul className="p-2">
                  <li>
                    <Link to="/artikel-kesehatan" onClick={handleLinkClick}>
                      Artikel Kesehatan
                    </Link>
                  </li>
                  <li>
                    <Link to="/kalkulator-gizi" onClick={handleLinkClick}>
                      Kalkulator Gizi
                    </Link>
                  </li>
                  {isAuthenticated && isAdmin && (
                    <>
                      <li>
                        <Link to="/data-anak" onClick={handleLinkClick}>
                          Data Anak
                        </Link>
                      </li>
                      <li>
                        <Link to="/data-orangtua" onClick={handleLinkClick}>
                          Data Orang Tua
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </li>
              {isAuthenticated && !isAdmin && (
                <li>
                  <Link to="/events" onClick={handleLinkClick}>
                    Acara
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link to="/manage-events" onClick={handleLinkClick}>
                    Manage Events
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
        <Link to="/" className="cursor-pointer">
          <img className="w-14" src={Logo} alt="stuntguard-logo" />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex" ref={menuRef}>
        <ul className="menu menu-horizontal text-lg px-1">
          <li>
            <Link to="/" onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={handleLinkClick}>
              About
            </Link>
          </li>
          <li>
            <details open={menuOpen}>
              <summary onClick={handleMenuClick}>Fitur</summary>
              {menuOpen && (
                <ul className="p-2 w-[300px] bg-slate-50 shadow-sm shadow-slate-900">
                  <li>
                    <Link to="/artikel-kesehatan" onClick={handleLinkClick}>
                      Artikel Kesehatan
                    </Link>
                  </li>
                  <li>
                    <Link to="/kalkulator-gizi" onClick={handleLinkClick}>
                      Kalkulator Gizi
                    </Link>
                  </li>
                  {isAuthenticated && isAdmin && (
                    <>
                      <li>
                        <Link to="/data-anak" onClick={handleLinkClick}>
                          Data Anak
                        </Link>
                      </li>
                      <li>
                        <Link to="/data-orangtua" onClick={handleLinkClick}>
                          Data Orang Tua
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </details>
          </li>
          {isAuthenticated && !isAdmin && (
            <li>
              <Link to="/events" onClick={handleLinkClick}>
                Acara
              </Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link to="/manage-events" onClick={handleLinkClick}>
                Manage Events
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        <SigninSignup />
      </div>
    </div>
  );
};

export default Navbar;
