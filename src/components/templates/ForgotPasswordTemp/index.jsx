import React, { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/client/supabaseClient";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const ForgotPasswordTemp = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      Swal.fire({
        title: "Error",
        text: "Silakan verifikasi bahwa Anda bukan robot!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.api.resetPasswordForEmail(email);

    setIsLoading(false);

    if (error) {
      Swal.fire({
        title: "Error",
        text: "Gagal mengirim email reset password!",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Berhasil",
        text: "Email reset password berhasil dikirim!",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          setEmail("");
          setCaptchaValue(null);
        }
      });
    }
  };

  return (
    <div className="pt-12 bg-gray-100">
      <div className="flex justify-center items-center h-screen px-4">
        <div className="card w-full max-w-lg bg-white shadow-xl p-6 md:p-8 lg:p-10 relative">
          <h2 className="card-title text-center mb-6 text-lg md:text-xl lg:text-2xl">
            Reset Password
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
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control mb-6">
              <ReCAPTCHA
                sitekey="YOUR_RECAPTCHA_SITE_KEY"
                onChange={handleCaptchaChange}
              />
            </div>
            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Mengirim..." : "Kirim Email Reset"}
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>
              Kembali ke halaman{" "}
              <Link to="/signin" className="text-blue-500">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordTemp;
