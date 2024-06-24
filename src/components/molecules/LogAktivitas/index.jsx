import React, { useState, useEffect } from "react";
import { supabase } from "@/client/supabaseClient";
import Swal from "sweetalert2";
import FloatingActionButton from "@components/atoms/FloatingActionButton";
import dayjs from "dayjs";
import "dayjs/locale/id";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

dayjs.extend(localizedFormat);
dayjs.locale("id");

const LogAktivitas = () => {
  const [activities, setActivities] = useState([]);
  const [aktivitas, setAktivitas] = useState("");
  const [tanggal, setTanggal] = useState(dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      const token = Cookies.get("user_session");
      const decodedToken = jwtDecode(token);
      const adminId = decodedToken.id;

      const { data, error } = await supabase
        .from("log_aktivitas")
        .select("id, aktivitas, tanggal")
        .eq("admin_id", adminId)
        .order("tanggal", { ascending: true });

      if (error) {
        console.error("Error fetching activities:", error.message);
      } else {
        setActivities(data);
      }
      setLoading(false);
    };

    fetchActivities();
  }, []);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = Cookies.get("user_session");
    const decodedToken = jwtDecode(token);
    const adminId = decodedToken.id;

    const { data, error } = await supabase
      .from("log_aktivitas")
      .insert([{ aktivitas, tanggal, admin_id: adminId }])
      .select();

    if (error) {
      console.error("Error adding activity:", error.message);
      Swal.fire({
        title: "Error",
        text: "Gagal menambahkan aktivitas!",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      setActivities((prevActivities) => [...prevActivities, ...data]);
      setAktivitas("");
      setTanggal(dayjs().format("YYYY-MM-DD"));
      setIsModalOpen(false);
      Swal.fire({
        title: "Berhasil",
        text: "Aktivitas berhasil ditambahkan!",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      });
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="container h-auto px-4 py-8 mx-auto border-2 rounded-xl">
        <h2 className="py-2 mb-6 text-2xl font-bold text-center rounded-md text-accent-800 bg-success-300">
          Log Aktivitas
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
              <div className="h-6 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="h-10 bg-gray-300 rounded mt-4 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container h-auto px-4 py-8 mx-auto border-2 rounded-xl">
      <h2 className="py-2 mb-6 text-2xl font-bold text-center rounded-md text-accent-800 bg-success-300">
        Log Aktivitas
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{activity.aktivitas}</h3>
            <p className="text-gray-600">
              {dayjs(activity.tanggal).format("dddd, D MMMM YYYY")}
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Tambah Aktivitas</h2>
            <form onSubmit={handleAddActivity}>
              <input
                type="text"
                placeholder="Nama Aktivitas"
                value={aktivitas}
                onChange={(e) => setAktivitas(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:border-success-400 focus:outline-none"
                required
              />
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:border-success-400 focus:outline-none"
                required
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menambahkan..." : "Tambah Aktivitas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />
    </div>
  );
};

export default LogAktivitas;
