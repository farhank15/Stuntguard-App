import React, { useState, useEffect } from "react";
import { supabase } from "@/client/supabaseClient";
import Swal from "sweetalert2";
import FloatingActionButton from "@components/atoms/FloatingActionButton";
import dayjs from "dayjs";
import "dayjs/locale/id"; // import locale Indonesia
import localizedFormat from "dayjs/plugin/localizedFormat";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

dayjs.extend(localizedFormat);
dayjs.locale("id");

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = Cookies.get("user_session");
      const decodedToken = jwtDecode(token);
      const adminId = decodedToken.id;

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("admin_id", adminId)
        .order("date", { ascending: true });
      if (error) {
        console.error("Error fetching events:", error.message);
      } else {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = Cookies.get("user_session");
    const decodedToken = jwtDecode(token);
    const adminId = decodedToken.id;

    const { data, error } = await supabase
      .from("events")
      .insert([{ title, description, date, admin_id: adminId }])
      .select();
    if (error) {
      console.error("Error adding event:", error.message);
      Swal.fire({
        title: "Error",
        text: "Gagal menambahkan acara!",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      setEvents((prevEvents) => [...prevEvents, ...data]);
      setTitle("");
      setDescription("");
      setDate("");
      setIsModalOpen(false);
      Swal.fire({
        title: "Berhasil",
        text: "Acara berhasil ditambahkan!",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      });
    }
    setIsSubmitting(false);
  };

  const handleDeleteEvent = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Acara ini akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) {
        console.error("Error deleting event:", error.message);
        Swal.fire({
          title: "Error",
          text: "Gagal menghapus acara!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== id)
        );
        Swal.fire({
          title: "Berhasil",
          text: "Acara berhasil dihapus!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
          timerProgressBar: true,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container h-auto px-4 py-8 mx-auto border-2 rounded-xl">
        <h2 className="py-2 mb-6 text-2xl font-bold text-center rounded-md text-accent-800 bg-success-300">
          Kelola Acara
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
    <div className="container min-h-[30rem] px-4 py-8 mx-auto border-2 rounded-xl overflow-auto">
      <h2 className="py-2 mb-6 text-2xl  font-bold text-center rounded-md text-accent-800 bg-success-300">
        Kelola Acara
      </h2>
      {events.length === 0 ? (
        <div className="flex justify-center items-center h-[20rem]">
          <h3 className="text-xl text-gray-500">
            Belum ada acara yang dibuat.
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-600">
                {dayjs(event.date).format("dddd, D MMMM YYYY")}
              </p>
              <p className="text-gray-600">{event.description}</p>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="w-full p-2 mt-4 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Tambah Acara</h2>
            <form onSubmit={handleAddEvent}>
              <input
                type="text"
                placeholder="Judul Acara"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:border-success-400 focus:outline-none"
                required
              />
              <textarea
                placeholder="Deskripsi Acara"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:border-success-400 focus:outline-none"
                required
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                  {isSubmitting ? "Menambahkan..." : "Tambah Acara"}
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

export default ManageEvents;
