import React, { useState, useEffect } from "react";
import { supabase } from "@/client/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AddRekapMedisPosyandu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tinggiBadan, setTinggiBadan] = useState("");
  const [beratBadan, setBeratBadan] = useState("");
  const [tanggalKunjungan, setTanggalKunjungan] = useState("");
  const [aktivitasImunisasi, setAktivitasImunisasi] = useState("");
  const [statusImunisasi, setStatusImunisasi] = useState("");
  const [growthData, setGrowthData] = useState([]);
  const [anakData, setAnakData] = useState({});
  const [aktivitasList, setAktivitasList] = useState([]);

  useEffect(() => {
    const fetchGrowthData = async () => {
      const { data, error } = await supabase
        .from("growth_data_gender")
        .select("*");
      if (error) {
        console.error("Error fetching growth data:", error.message);
      } else {
        setGrowthData(data);
      }
    };

    const fetchAnakData = async () => {
      const { data, error } = await supabase
        .from("anak")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error("Error fetching anak data:", error.message);
      } else {
        setAnakData(data);
        console.log("Anak Data:", data); // Debug log
      }
    };

    const fetchAktivitasList = async () => {
      const token = Cookies.get("user_session");
      if (!token) {
        console.error("Token tidak ditemukan");
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error.message);
        return;
      }

      const adminId = decodedToken.id;
      if (!adminId) {
        console.error("Admin ID tidak ditemukan dalam token");
        return;
      }

      console.log("Admin ID:", adminId);

      const { data, error } = await supabase
        .from("log_aktivitas")
        .select("*")
        .eq("admin_id", adminId);

      if (error) {
        console.error("Error fetching aktivitas list:", error.message);
      } else {
        console.log("Fetched aktivitas:", data);
        setAktivitasList(data);
      }
    };

    fetchGrowthData();
    fetchAnakData();
    fetchAktivitasList();
  }, [id]);

  const calculateStatusAndColor = (usia, tinggiBadan, beratBadan, gender) => {
    // Normalisasi jenis kelamin
    const normalizedGender =
      gender.toLowerCase() === "perempuan" ? "female" : "male";

    const data = growthData.find(
      (item) => item.age === usia && item.gender === normalizedGender
    );

    console.log("Growth Data for Calculation:", data); // Debug log

    if (!data) {
      return { status: "perhatian khusus", warnaHeksa: "#FF0000" }; // Merah
    }

    if (
      tinggiBadan >= data.height_min &&
      tinggiBadan <= data.height_max &&
      beratBadan >= data.weight_min &&
      beratBadan <= data.weight_max
    ) {
      return { status: "normal", warnaHeksa: "#00FF00" }; // Hijau
    }

    if (tinggiBadan < data.height_min && beratBadan < data.weight_min) {
      return { status: "perhatian khusus", warnaHeksa: "#FF0000" }; // Merah
    }
    if (tinggiBadan < data.height_min && beratBadan > data.weight_min) {
      return { status: "perhatian khusus", warnaHeksa: "#FF0000" }; // Merah
    }

    return { status: "perlu perhatian", warnaHeksa: "#FFFF00" }; // Kuning
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let usia = anakData.usia;
    const gender = anakData.jenis_kelamin;
    const adminId = anakData.admin_id; // Ambil admin_id dari data anak

    // Asumsikan usia dalam bulan, jika dalam tahun, konversi ke bulan
    if (usia < 24) {
      console.log("Usia dalam bulan:", usia); // Debug log
    } else {
      usia = usia * 12;
      console.log("Usia dalam tahun, dikonversi ke bulan:", usia); // Debug log
    }

    const { status, warnaHeksa } = calculateStatusAndColor(
      usia,
      parseFloat(tinggiBadan),
      parseFloat(beratBadan),
      gender
    );

    const dataToInsert = {
      id_anak: id,
      admin_id: adminId, // Tambahkan admin_id ke data yang akan diinsert
      tinggi_badan: parseFloat(tinggiBadan),
      berat_badan: parseFloat(beratBadan),
      usia: usia,
      tanggal_kunjungan: tanggalKunjungan,
      status: status,
      warna_heksa: warnaHeksa,
      aktivitas_imunisasi: aktivitasImunisasi,
      status_imunisasi: aktivitasImunisasi ? statusImunisasi : null,
      dibuat_pada: new Date(),
    };

    console.log("Data to be inserted:", dataToInsert);

    const { error } = await supabase
      .from("rekam_medis_posyandu")
      .insert(dataToInsert);

    if (error) {
      console.error("Error adding rekap medis posyandu:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Gagal menambahkan rekap medis posyandu: ${error.message}`,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Rekap medis posyandu berhasil ditambahkan",
      }).then(() => {
        navigate(`/rekap/${id}`);
      });
    }
  };

  const handleCancel = () => {
    navigate(`/rekap/${id}`);
  };

  return (
    <div className="px-3 container mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        Tambah Rekap Medis Posyandu
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="form-control">
          <label className="label text-gray-700">Tinggi Badan (cm)</label>
          <input
            type="number"
            value={tinggiBadan}
            onChange={(e) => setTinggiBadan(e.target.value)}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label text-gray-700">Berat Badan (kg)</label>
          <input
            type="number"
            value={beratBadan}
            onChange={(e) => setBeratBadan(e.target.value)}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label text-gray-700">Tanggal Kunjungan</label>
          <input
            type="date"
            value={tanggalKunjungan}
            onChange={(e) => setTanggalKunjungan(e.target.value)}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control md:col-span-2">
          <label className="label text-gray-700">Aktivitas Posyandu</label>
          <select
            value={aktivitasImunisasi}
            onChange={(e) => setAktivitasImunisasi(e.target.value)}
            className="select select-bordered"
          >
            <option value="">Pilih Aktivitas</option>
            {aktivitasList.map((aktivitas) => (
              <option key={aktivitas.id} value={aktivitas.aktivitas}>
                {aktivitas.aktivitas}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control md:col-span-2">
          <label className="label text-gray-700">Status Aktivitas</label>
          <select
            value={statusImunisasi}
            onChange={(e) => setStatusImunisasi(e.target.value)}
            className="select select-bordered"
            disabled={!aktivitasImunisasi}
          >
            <option value="">Pilih Status</option>
            <option value="belum">Belum</option>
            <option value="sudah">Sudah</option>
          </select>
        </div>
        <div className="justify-between md:col-span-2 flex md:justify-end space-x-4">
          <button
            type="button"
            className="btn px-8 btn-secondary"
            onClick={handleCancel}
          >
            Batal
          </button>
          <button type="submit" className="btn px-8 btn-primary">
            Tambah
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRekapMedisPosyandu;
