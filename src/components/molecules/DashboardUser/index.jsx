import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/client/supabaseClient";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import defaultAvatar from "@assets/icons/avatar.png";
import DotButton from "@assets/icons/dot-button.svg";
import { Link } from "react-router-dom";

const DashboardUser = () => {
  const [children, setChildren] = useState([]);
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get("user_session");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        fetchData(decodedToken.id);
      } catch (error) {
        console.error("Token tidak valid:", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchData = async (userId) => {
    try {
      const { data: parentData, error: parentError } = await supabase
        .from("orangtua")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (parentError) {
        console.error("Gagal mengambil data orang tua:", parentError.message);
        return;
      }

      const { data: childrenData, error: childrenError } = await supabase
        .from("anak")
        .select("*")
        .eq("id_orangtua", parentData.id);

      if (childrenError) {
        console.error("Gagal mengambil data anak:", childrenError.message);
        return;
      }

      setParent(parentData);
      setChildren(childrenData);
    } catch (error) {
      console.error("Gagal mengambil data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="container h-auto px-4 py-8 mx-auto border-2 rounded-xl">
        <div className="h-10 bg-gray-200 animate-pulse mb-6 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container h-auto px-4 py-8 mx-auto border-2 rounded-xl">
      <h2 className="py-2 mb-6 text-2xl font-bold text-center rounded-md text-accent-800 bg-success-300">
        Dashboard User
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {parent ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <img
                src={parent.foto || defaultAvatar}
                alt="Foto Orang Tua"
                className="w-16 h-16 rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
              <div className="ml-4">
                <h3 className="text-xl font-semibold">{parent.nama}</h3>
                <p className="text-gray-600">NIK: {parent.nik}</p>
              </div>
            </div>
            <p className="text-gray-600">
              <strong>Alamat:</strong> {parent.alamat}
            </p>
            <p className="text-gray-600">
              <strong>Usia:</strong> {parent.usia}
            </p>
            <p className="text-gray-600">
              <strong>Jenis Kelamin:</strong> {parent.jenis_kelamin}
            </p>
            <p className="text-gray-600">
              <strong>Nomor Telepon:</strong> {parent.nomor_telepon}
            </p>
          </div>
        ) : (
          <p className="col-span-1 md:col-span-2">
            Data orang tua tidak ditemukan.
          </p>
        )}

        {children.length > 0 ? (
          <div className="col-span-1 grid grid-cols-1 gap-6">
            {children.map((child) => (
              <div
                key={child.id}
                className="bg-white p-6 rounded-lg shadow-md relative"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={child.foto || defaultAvatar}
                    alt="Foto Anak"
                    className="w-16 h-16 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">{child.nama}</h3>
                    <p className="text-gray-600">NIK: {child.nik}</p>
                  </div>
                  <button
                    className="absolute top-4 right-4"
                    onClick={() => toggleDropdown(child.id)}
                  >
                    <img src={DotButton} alt="Dot Button" className="w-6 h-6" />
                  </button>
                  {activeDropdown === child.id && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-10 right-4 bg-white shadow-lg rounded-lg p-2"
                    >
                      <Link
                        to={`/child/${child.id}`}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Detail
                      </Link>
                    </div>
                  )}
                </div>
                <p className="text-gray-600">
                  <strong>Alamat:</strong> {child.alamat}
                </p>
                <p className="text-gray-600">
                  <strong>Usia:</strong> {child.usia}
                </p>
                <p className="text-gray-600">
                  <strong>Jenis Kelamin:</strong> {child.jenis_kelamin}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="col-span-1 md:col-span-2">Data anak tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardUser;
