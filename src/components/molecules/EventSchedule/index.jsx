import React, { useState, useEffect } from "react";
import { supabase } from "@/client/supabaseClient";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const EventSchedule = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = Cookies.get("user_session");
      if (!token) {
        console.error("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error.message);
        setLoading(false);
        return;
      }

      const userId = decodedToken.id;
      if (!userId) {
        console.error("User ID tidak ditemukan dalam token");
        setLoading(false);
        return;
      }

      console.log("User ID:", userId);

      // Ambil role dari tabel users
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        setLoading(false);
        return;
      }

      const role = user.role;
      let adminId;

      if (role === "admin") {
        adminId = userId;
      } else {
        // Jika pengguna bukan admin, ambil admin_id dari tabel orangtua berdasarkan user_id
        const { data: orangtua, error: orangtuaError } = await supabase
          .from("orangtua")
          .select("admin_id")
          .eq("user_id", userId)
          .single();

        if (orangtuaError) {
          console.error("Error fetching orangtua:", orangtuaError.message);
          setLoading(false);
          return;
        }

        adminId = orangtua.admin_id;
      }

      console.log("Admin ID:", adminId);

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("admin_id", adminId)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error.message);
      } else {
        console.log("Fetched events:", data);
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="container h-auto px-4 py-8 mx-auto border-2 rounded-xl">
        <h2 className="py-2 mb-6 text-2xl font-bold text-center rounded-md text-accent-800 bg-success-300">
          Jadwal Acara
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container h-auto px-4 py-8 mx-auto border-2 rounded-xl">
      <h2 className="py-2 mb-6 text-2xl font-bold text-center rounded-md text-accent-800 bg-success-300">
        Jadwal Acara
      </h2>
      {events.length === 0 ? (
        <div className="text-center h-[33rem] flex justify-center items-center text-gray-600">
          <h1 className="w-[25rem] text-xl text-slate-400">
            Belum ada acara yang tersedia.
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-600">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventSchedule;
