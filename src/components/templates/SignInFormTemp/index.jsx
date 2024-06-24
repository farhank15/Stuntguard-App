import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { supabase } from "@/client/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const { email, password } = formData;
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email harus diisi!";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email tidak valid!";
    }
    if (!password) {
      newErrors.password = "Password harus diisi!";
    } else if (password.length < 6) {
      newErrors.password = "Password harus lebih dari 6 karakter!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const base64UrlEncode = (str) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str))
      .replace(/=+$/, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const createJwtToken = (header, payload, secret) => {
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = CryptoJS.HmacSHA256(
      `${encodedHeader}.${encodedPayload}`,
      secret
    );
    const encodedSignature = base64UrlEncode(
      signature.toString(CryptoJS.enc.Base64)
    );
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      const { email, password } = formData;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (error) {
          throw error;
        }

        // Hash password yang diinputkan oleh pengguna
        const hashedPassword = CryptoJS.SHA256(password).toString();

        // Bandingkan hashed password dengan password yang tersimpan di database
        if (hashedPassword !== data.password) {
          throw new Error("Password salah!");
        }

        const header = {
          alg: "HS256",
          typ: "JWT",
        };

        const payload = {
          id: data.id,
          email: data.email,
          role: data.role,
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
        };

        const secret = "user_session";
        const token = createJwtToken(header, payload, secret);

        Swal.fire({
          title: "Berhasil",
          text: "Berhasil masuk!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          Cookies.set("user_session", token, { expires: 1 / 24 }); // Token expires in 1 hour
          navigate("/");
          window.location.reload();
        });
      } catch (error) {
        console.error("Error:", error.message);
        Swal.fire({
          title: "Error",
          text: "Email atau Password salah!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="pt-12 bg-gray-100">
      <div className="flex justify-center items-center h-screen px-4">
        <div className="card w-full max-w-lg bg-white shadow-xl p-6 md:p-8 lg:p-10 relative">
          <h2 className="card-title text-center mb-6 text-lg md:text-xl lg:text-2xl">
            Masuk
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-6 relative">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <span className="text-red-500 text-sm absolute -bottom-5 left-0">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="form-control mb-6 relative">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input input-bordered w-full"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm absolute -bottom-5 left-0">
                  {errors.password}
                </span>
              )}
            </div>
            <div className="form-control mb-6 flex justify-end">
              <Link to="/forgot-password" className="text-blue-500 text-sm">
                Lupa password?
              </Link>
            </div>
            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Masuk..." : "Masuk"}
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>
              Belum punya akun?{" "}
              <Link to="/register" className="text-blue-500">
                Register
              </Link>{" "}
              {" / "}
              <Link to="/join" className="text-blue-500">
                Masuk sebagai Anggota
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
