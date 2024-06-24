import React, { useState, useEffect } from "react";
import { supabase } from "@/client/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Avatar from "@assets/icons/avatar.png";
import GrafikPertumbuhan from "../GrafikPertumbuhan";
import Swal from "sweetalert2";

const RekapPosyandu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [parent, setParent] = useState(null);
  const [rekap, setRekap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("user_session");
      if (token) {
        try {
          jwtDecode(token);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Invalid token:", error);
          setIsAuthenticated(false);
          navigate("/login");
        }
      } else {
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    const fetchChildAndRekap = async () => {
      const { data: childData, error: childError } = await supabase
        .from("anak")
        .select("*")
        .eq("id", id)
        .single();

      if (childError) {
        console.error("Error fetching child data:", childError.message);
        setLoading(false);
        return;
      }

      const { data: parentData, error: parentError } = await supabase
        .from("orangtua")
        .select("*")
        .eq("id", childData.id_orangtua)
        .single();

      if (parentError) {
        console.error("Error fetching parent data:", parentError.message);
        setLoading(false);
        return;
      }

      const { data: rekapData, error: rekapError } = await supabase
        .from("rekam_medis_posyandu")
        .select("*")
        .eq("id_anak", id)
        .order("tanggal_kunjungan", { ascending: true });

      if (rekapError) {
        console.error("Error fetching rekap data:", rekapError.message);
        setLoading(false);
        return;
      }

      setChild(childData);
      setParent(parentData);
      setRekap(rekapData);

      const uniqueYears = [
        ...new Set(
          rekapData.map((visit) =>
            new Date(visit.tanggal_kunjungan).getFullYear()
          )
        ),
      ];
      setYears(uniqueYears);

      setLoading(false);
    };

    checkAuth();
    if (isAuthenticated) {
      fetchChildAndRekap();
    }
  }, [id, isAuthenticated, navigate]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const filteredRekap =
    selectedYear === "all"
      ? rekap
      : rekap.filter(
          (visit) =>
            new Date(visit.tanggal_kunjungan).getFullYear().toString() ===
            selectedYear
        );

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const handleDeleteRekap = async (rekapId) => {
    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Rekap ini akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      const { error } = await supabase
        .from("rekam_medis_posyandu")
        .delete()
        .eq("id", rekapId);
      if (error) {
        console.error("Error deleting rekap:", error.message);
        Swal.fire({
          title: "Error",
          text: "Gagal menghapus rekap!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        setRekap(rekap.filter((item) => item.id !== rekapId));
        Swal.fire({
          title: "Berhasil",
          text: "Rekap berhasil dihapus!",
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
      <div className="container h-auto px-4 py-8 mx-auto border-2">
        <div className="h-10 bg-gray-200 animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="h-48 bg-gray-200 animate-pulse"></div>
          <div className="h-48 bg-gray-200 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 animate-pulse mt-6 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-gray-200 animate-pulse"></div>
          <div className="h-40 bg-gray-200 animate-pulse"></div>
          <div className="h-40 bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!child) {
    return <div>Data anak tidak ditemukan</div>;
  }

  return (
    <div className="container h-auto px-4 py-8 mx-auto border-2">
      <h2 className="py-2 mb-6 text-2xl font-bold text-center rounded-md text-accent-800 bg-success-300">
        Rekap Data Anak
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <img
              src={child.foto ? child.foto : Avatar}
              alt="Foto Anak"
              className="object-cover w-16 h-16 rounded-full"
              onError={(e) => {
                e.target.src = Avatar;
              }}
            />
            <div className="ml-4">
              <h3 className="text-xl font-semibold">{child.nama}</h3>
              <p className="text-gray-600">{child.nik}</p>
            </div>
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <img
              src={parent.foto ? parent.foto : Avatar}
              alt="Avatar Orang Tua"
              className="object-cover w-16 h-16 rounded-full"
              onError={(e) => {
                e.target.src = Avatar;
              }}
            />
            <div className="ml-4">
              <h3 className="text-xl font-semibold">{parent.nama}</h3>
              <p className="text-gray-600">{parent.nik}</p>
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
      </div>
      <div className="mt-9">
        <h3 className="text-2xl font-semibold mb-2">Hasil Rekap Posyandu</h3>
        <div className="mb-4">
          <label htmlFor="yearFilter" className="mr-2 text-gray-600">
            Tampilkan Dari Tahun:
          </label>
          <select
            id="yearFilter"
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border rounded-md"
          >
            <option value="all">All</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRekap.length === 0 ? (
            <p className="col-span-3 text-gray-600">
              Belum ada hasil rekap data.
            </p>
          ) : (
            filteredRekap.map((rekapItem) => (
              <div
                key={rekapItem.id}
                className="bg-white p-6 rounded-lg shadow-md relative flex flex-col justify-between"
              >
                <div
                  className="w-4 h-4 border-2 border-slate-400 rounded-full absolute top-4 right-4"
                  style={{ backgroundColor: rekapItem.warna_heksa }}
                ></div>
                <div>
                  <p className="font-semibold mb-2">
                    {getDayName(rekapItem.tanggal_kunjungan)}
                  </p>
                  <p>Tinggi Badan: {rekapItem.tinggi_badan} cm</p>
                  <p>Berat Badan: {rekapItem.berat_badan} kg</p>
                  <p>Status: {rekapItem.status}</p>
                  {rekapItem.aktivitas_imunisasi && (
                    <>
                      <p>
                        Aktivitas Imunisasi: {rekapItem.aktivitas_imunisasi}
                      </p>
                      <p>Status Imunisasi: {rekapItem.status_imunisasi}</p>
                    </>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteRekap(rekapItem.id)}
                  className="w-full p-2 mt-4 text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mt-6">
        <GrafikPertumbuhan childId={child.id} selectedYear={selectedYear} />
      </div>
    </div>
  );
};

export default RekapPosyandu;
