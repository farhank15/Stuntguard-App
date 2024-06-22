import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/client/supabaseClient";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const CDNURL =
  "https://kqwhwlnyvahaddispubu.supabase.co/storage/v1/object/public/images/";

const EditChildForm = () => {
  const { id } = useParams();
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
    const fetchData = async () => {
      const token = Cookies.get("user_session");
      const decodedToken = jwtDecode(token);
      const adminId = decodedToken.id;

      const { data: anak, error: anakError } = await supabase
        .from("anak")
        .select("*")
        .eq("id", id)
        .single();

      const { data: orangtua, error: orangtuaError } = await supabase
        .from("orangtua")
        .select("id, nama")
        .eq("admin_id", adminId);

      if (anakError || orangtuaError) {
        Swal.fire({
          title: "Error",
          text: "Gagal mengambil data!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        setFormData({
          ...anak,
          foto: null,
        });
        setPhotoPreview(anak.foto);
        setParents(orangtua);
        setFilteredParents(orangtua);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

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

      const { data: existingNikInOrangtua } = await supabase
        .from("orangtua")
        .select("nik")
        .eq("nik", formData.nik);

      const { data: existingNikInAnak } = await supabase
        .from("anak")
        .select("nik")
        .eq("nik", formData.nik)
        .neq("id", id);

      if (existingNikInOrangtua.length > 0 || existingNikInAnak.length > 0) {
        Swal.fire({
          title: "Error",
          text: "NIK sudah terdaftar di orang tua atau anak lain!",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsSubmitting(false);
        return;
      }

      let fotoUrl = photoPreview;
      if (formData.foto) {
        const uploadedUrl = await uploadImage(formData.foto);
        if (uploadedUrl) {
          fotoUrl = uploadedUrl;
        } else {
          setIsSubmitting(false);
          return;
        }
      }

      const { nama, nik, id_orangtua, alamat, usia, jenis_kelamin } = formData;

      const { error } = await supabase
        .from("anak")
        .update({
          nama,
          nik,
          id_orangtua,
          alamat,
          usia,
          jenis_kelamin,
          foto: fotoUrl,
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating child:", error.message);
        Swal.fire({
          title: "Error",
          text: "Gagal mengupdate data anak!",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsSubmitting(false);
      } else {
        Swal.fire({
          title: "Berhasil",
          text: "Data anak berhasil diupdate!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/data-anak");
          }
        });
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
    <div className="flex items-center justify-center px-2 py-40 bg-gray-100">
      <div className="w-full p-6 bg-white rounded-lg shadow-xl card lg:w-1/2">
        <h2 className="py-2 mb-6 text-2xl font-bold text-center text-blue-700 bg-blue-100 rounded-md">
          Edit Data Anak
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4 form-control">
            <label className="label">
              <span className="label-text">Nama Anak</span>
            </label>
            <input
              type="text"
              name="nama"
              className="w-full input input-bordered"
              value={formData.nama}
              onChange={handleChange}
              required
            />
            {errors.nama && (
              <span className="text-sm text-red-500">{errors.nama}</span>
            )}
          </div>
          <div className="mb-4 form-control">
            <label className="label">
              <span className="label-text">NIK Anak</span>
            </label>
            <input
              type="text"
              name="nik"
              className="w-full input input-bordered"
              value={formData.nik}
              onChange={handleChange}
              required
            />
            {errors.nik && (
              <span className="text-sm text-red-500">{errors.nik}</span>
            )}
          </div>
          <div className="mb-4 form-control">
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
              <label htmlFor="foto" className="cursor-pointer btn btn-primary">
                {photoPreview ? "Ganti Foto" : "Pilih Foto"}
              </label>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="object-cover w-16 h-16 ml-4 rounded-full"
                />
              )}
              {photoPreview && (
                <button
                  type="button"
                  className="ml-4 btn btn-danger"
                  onClick={() => setPhotoPreview(null)}
                >
                  Hapus Foto
                </button>
              )}
            </div>
            {errors.foto && (
              <span className="text-sm text-red-500">{errors.foto}</span>
            )}
          </div>
          <div className="mb-4 form-control">
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
          <div className="mb-4 form-control">
            <label className="label">
              <span className="label-text">Alamat</span>
            </label>
            <input
              type="text"
              name="alamat"
              className="w-full input input-bordered"
              value={formData.alamat}
              onChange={handleChange}
              required
            />
            {errors.alamat && (
              <span className="text-sm text-red-500">{errors.alamat}</span>
            )}
          </div>
          <div className="mb-4 form-control">
            <label className="label">
              <span className="label-text">Usia</span>
            </label>
            <input
              type="number"
              name="usia"
              className="w-full input input-bordered"
              value={formData.usia}
              onChange={handleChange}
              required
            />
            {errors.usia && (
              <span className="text-sm text-red-500">{errors.usia}</span>
            )}
          </div>
          <div className="mb-4 form-control">
            <label className="label">
              <span className="label-text">Jenis Kelamin</span>
            </label>
            <select
              name="jenis_kelamin"
              className="w-full select select-bordered"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            {errors.jenis_kelamin && (
              <span className="text-sm text-red-500">
                {errors.jenis_kelamin}
              </span>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="px-8 btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-8 btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengupdate..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChildForm;
