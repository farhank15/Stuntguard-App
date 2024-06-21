import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "@/client/supabaseClient"; // Pastikan Anda mengimpor dengan benar

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    const { name, nik, email, password, confirmPassword } = formData;
    const newErrors = {};
    if (!name) newErrors.name = "Nama harus diisi!";
    if (!nik) {
      newErrors.nik = "NIK harus diisi!";
    } else if (!/^\d+$/.test(nik) || nik.length !== 16) {
      newErrors.nik = "NIK harus berisi 16 angka!";
    }
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
    if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "Password dan Konfirmasi Password tidak cocok!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      const { name, email, password } = formData;

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) throw error;

        alert("Periksa email Anda untuk tautan verifikasi");
      } catch (error) {
        console.error("Error:", error); // Log error ke konsol untuk debugging
        setErrors({
          general: error.message || "Terjadi kesalahan pada server.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="md:pt-16 pt-28 bg-gray-100">
      <div className="flex justify-center items-center h-screen px-4">
        <div className="card w-full max-w-lg bg-white shadow-xl p-6 md:p-8 lg:p-10 relative">
          <h2 className="card-title text-center mb-6 text-lg md:text-xl lg:text-2xl">
            Daftar Anggota
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-6 relative">
              <label className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <span className="text-red-500 text-sm absolute -bottom-5 left-0">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="form-control mb-6 relative">
              <label className="label">
                <span className="label-text">NIK</span>
              </label>
              <input
                type="text"
                name="nik"
                className="input input-bordered"
                value={formData.nik}
                onChange={handleChange}
                required
              />
              {errors.nik && (
                <span className="text-red-500 text-sm absolute -bottom-5 left-0">
                  {errors.nik}
                </span>
              )}
            </div>
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
            <div className="form-control mb-6 relative">
              <label className="label">
                <span className="label-text">Konfirmasi Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="input input-bordered w-full"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={toggleShowConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm absolute -bottom-5 left-0">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Mendaftar..." : "Daftar"}
              </button>
            </div>
            {errors.general && (
              <div className="text-red-500 text-center mt-4">
                {errors.general}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
