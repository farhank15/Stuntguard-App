import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/client/supabaseClient";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

const CDNURL =
  "https://kqwhwlnyvahaddispubu.supabase.co/storage/v1/object/public/images/";

const AddChildForm = () => {
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    id_orangtua: "",
    alamat: "",
    usia: "",
    jenis_kelamin: "",
    foto: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchParents = async () => {
      const token = Cookies.get("user_session");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const { data, error } = await supabase
        .from("orangtua")
        .select("id, nama")
        .eq("admin_id", decodedToken.id);

      if (error) {
        console.error("Error fetching parents:", error.message);
        Swal.fire({
          title: "Error",
          text: "Gagal mengambil data orang tua!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        setParents(data);
        setFilteredParents(data);
      }
      setLoading(false);
    };

    fetchParents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let error = "";

    if (name === "foto") {
      const file = files[0];
      if (file) {
        if (file.size > 1048576) {
          error = "Ukuran gambar harus di bawah 1MB!";
          Swal.fire({
            title: "Error",
            text: "Ukuran gambar harus di bawah 1MB!",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          setFormData({
            ...formData,
            [name]: file,
          });
          setPhotoPreview(URL.createObjectURL(file));
        }
      } else {
        setFormData({
          ...formData,
          [name]: null,
        });
        setPhotoPreview(null);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = parents.filter((parent) =>
      parent.nama.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredParents(filtered);
  };

  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      foto: null,
    });
    setPhotoPreview(null);
  };

  const validateForm = () => {
    const { nama, nik, alamat, usia, jenis_kelamin } = formData;
    const newErrors = {};
    if (!nama) newErrors.nama = "Nama harus diisi!";
    if (!nik) {
      newErrors.nik = "NIK harus diisi!";
    } else if (!/^\d+$/.test(nik) || nik.length !== 16) {
      newErrors.nik = "NIK harus berisi 16 angka!";
    }
    if (!alamat) newErrors.alamat = "Alamat harus diisi!";
    if (!usia) {
      newErrors.usia = "Usia harus diisi!";
    } else if (usia <= 0) {
      newErrors.usia = "Usia harus lebih dari 0!";
    }
    if (!jenis_kelamin)
      newErrors.jenis_kelamin = "Jenis kelamin harus dipilih!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file) => {
    const fileName = `profile-anak/${uuidv4()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal mengupload gambar!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return null;
    }

    return `${CDNURL}${fileName}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      // Check if NIK already exists in either orangtua or anak table
      const { data: existingNikInOrangtua, error: errorNikInOrangtua } =
        await supabase.from("orangtua").select("nik").eq("nik", formData.nik);

      const { data: existingNikInAnak, error: errorNikInAnak } = await supabase
        .from("anak")
        .select("nik")
        .eq("nik", formData.nik);

      if (errorNikInOrangtua || errorNikInAnak) {
        Swal.fire({
          title: "Error",
          text: "Gagal memeriksa NIK!",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsSubmitting(false);
        return;
      }

      if (existingNikInOrangtua.length > 0 || existingNikInAnak.length > 0) {
        Swal.fire({
          title: "Error",
          text: "NIK sudah terdaftar!",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsSubmitting(false);
        return;
      }

      let fotoUrl = null;
      if (formData.foto) {
        const uploadedUrl = await uploadImage(formData.foto);
        if (uploadedUrl) {
          fotoUrl = uploadedUrl;
        } else {
          setIsSubmitting(false);
          return;
        }
      }

      const token = Cookies.get("user_session");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      const { nama, nik, id_orangtua, alamat, usia, jenis_kelamin } = formData;

      const { error } = await supabase.from("anak").insert([
        {
          nama,
          nik,
          id_orangtua,
          alamat,
          usia,
          jenis_kelamin,
          foto: fotoUrl,
          admin_id: decodedToken.id,
        },
      ]);

      if (error) {
        console.error("Error adding child:", error.message);
        Swal.fire({
          title: "Error",
          text: "Gagal menambahkan data anak!",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsSubmitting(false);
      } else {
        Swal.fire({
          title: "Berhasil",
          text: "Data anak berhasil ditambahkan!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/data-anak");
          }
        });
        setFormData({
          nama: "",
          nik: "",
          id_orangtua: "",
          alamat: "",
          usia: "",
          jenis_kelamin: "",
          foto: null,
        });
        setPhotoPreview(null);
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    navigate("/data-anak");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center px-2 items-center py-40 bg-gray-100">
      <div className="card w-full lg:w-1/2 bg-white shadow-xl p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 py-2 text-center text-green-700 bg-green-100 rounded-md">
          Tambah Data Anak
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Nama Anak</span>
            </label>
            <input
              type="text"
              name="nama"
              className="input input-bordered w-full"
              value={formData.nama}
              onChange={handleChange}
              required
            />
            {errors.nama && (
              <span className="text-red-500 text-sm">{errors.nama}</span>
            )}
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">NIK Anak</span>
            </label>
            <input
              type="text"
              name="nik"
              className="input input-bordered w-full"
              value={formData.nik}
              onChange={handleChange}
              required
            />
            {errors.nik && (
              <span className="text-red-500 text-sm">{errors.nik}</span>
            )}
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Foto</span>
            </label>
            <div className="flex items-center">
              <input
                type="file"
                name="foto"
                className="hidden"
                id="foto"
                onChange={handleChange}
              />
              <label htmlFor="foto" className="btn btn-primary cursor-pointer">
                {photoPreview ? "Ganti Foto" : "Pilih Foto"}
              </label>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="ml-4 h-16 w-16 rounded-full object-cover"
                />
              )}
              {photoPreview && (
                <button
                  type="button"
                  className="btn btn-danger ml-4"
                  onClick={handleRemovePhoto}
                >
                  Hapus Foto
                </button>
              )}
            </div>
            {errors.foto && (
              <span className="text-red-500 text-sm">{errors.foto}</span>
            )}
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Nama Orang Tua</span>
            </label>
            <div ref={dropdownRef} className="relative">
              <input
                type="text"
                placeholder="Cari Orang Tua"
                className="input input-bordered w-full mb-2"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setDropdownVisible(true)}
              />
              {dropdownVisible && (
                <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto">
                  {filteredParents.map((parent) => (
                    <li key={parent.id}>
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            id_orangtua: parent.id,
                          });
                          setSearchTerm(parent.nama);
                          setDropdownVisible(false);
                        }}
                      >
                        {parent.nama}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Alamat</span>
            </label>
            <input
              type="text"
              name="alamat"
              className="input input-bordered w-full"
              value={formData.alamat}
              onChange={handleChange}
              required
            />
            {errors.alamat && (
              <span className="text-red-500 text-sm">{errors.alamat}</span>
            )}
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Usia (bulan)</span>
            </label>
            <input
              type="number"
              name="usia (bulan)"
              className="input input-bordered w-full"
              value={formData.usia}
              onChange={handleChange}
              required
            />
            {errors.usia && (
              <span className="text-red-500 text-sm">{errors.usia}</span>
            )}
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Jenis Kelamin</span>
            </label>
            <select
              name="jenis_kelamin"
              className="select select-bordered w-full"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            {errors.jenis_kelamin && (
              <span className="text-red-500 text-sm">
                {errors.jenis_kelamin}
              </span>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="btn px-8 btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn px-8 btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menambah..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChildForm;
