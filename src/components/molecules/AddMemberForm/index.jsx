import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "@/client/supabaseClient";
import { v4 as uuidv4 } from "uuid";

const CDNURL =
  "https://kqwhwlnyvahaddispubu.supabase.co/storage/v1/object/public/images/";

const AddMemberForm = () => {
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    foto: null,
    alamat: "",
    usia: "",
    jenis_kelamin: "",
    nomor_telepon: "",
    email: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      foto: null,
    });
    setPhotoPreview(null);
  };

  const validateForm = () => {
    const { nama, nik, alamat, usia, jenis_kelamin, nomor_telepon, email } =
      formData;
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
    if (!nomor_telepon) {
      newErrors.nomor_telepon = "Nomor telepon harus diisi!";
    } else if (!/^\d+$/.test(nomor_telepon)) {
      newErrors.nomor_telepon = "Nomor telepon harus berisi angka saja!";
    } else if (nomor_telepon.length <= 11) {
      newErrors.nomor_telepon = "Nomor telepon harus lebih dari 11 angka!";
    }
    if (!email) {
      newErrors.email = "Email harus diisi!";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email tidak valid!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file) => {
    const fileName = `profile-ortu/${uuidv4()}`;
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
      let fotoUrl = null;
      if (formData.foto) {
        const uploadedUrl = await uploadImage(formData.foto);
        if (uploadedUrl) {
          fotoUrl = uploadedUrl;
        }
      }

      const { error } = await supabase.from("orangtua").insert([
        {
          nama: formData.nama,
          nik: formData.nik,
          foto: fotoUrl,
          alamat: formData.alamat,
          usia: formData.usia,
          jenis_kelamin: formData.jenis_kelamin,
          nomor_telepon: formData.nomor_telepon,
          email: formData.email,
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          // NIK atau email sudah terdaftar
          if (fotoUrl) {
            // Hapus foto yang sudah terunggah
            await supabase.storage
              .from("images")
              .remove([fotoUrl.replace(CDNURL, "")]);
          }
          Swal.fire({
            title: "Error",
            text: "NIK atau email sudah terdaftar!",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          console.error("Error inserting data:", error);
          Swal.fire({
            title: "Error",
            text: "Gagal menambahkan data!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        setIsSubmitting(false);
      } else {
        Swal.fire({
          title: "Berhasil",
          text: "Data berhasil ditambahkan!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/data-orangtua");
          }
        });
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    navigate("/data-orangtua");
  };

  return (
    <div className="flex justify-center px-2 items-center py-40 bg-gray-100">
      <div className="card w-full lg:w-1/2 bg-white shadow-xl p-6">
        <h2 className="card-title text-center mb-4">Tambah Anggota/Orangtua</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Nama</span>
            </label>
            <input
              type="text"
              name="nama"
              className="input input-bordered"
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
              <span className="text-red-500 text-sm">{errors.nik}</span>
            )}
          </div>
          <div className="form-control mb-4">
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
              <span className="text-red-500 text-sm">{errors.email}</span>
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
              <span className="label-text">Alamat</span>
            </label>
            <input
              type="text"
              name="alamat"
              className="input input-bordered"
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
              <span className="label-text">Usia</span>
            </label>
            <input
              type="number"
              name="usia"
              className="input input-bordered"
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
              className="select select-bordered"
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
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Nomor Telepon</span>
            </label>
            <input
              type="text"
              name="nomor_telepon"
              className="input input-bordered"
              value={formData.nomor_telepon}
              onChange={handleChange}
              required
            />
            {errors.nomor_telepon && (
              <span className="text-red-500 text-sm">
                {errors.nomor_telepon}
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

export default AddMemberForm;
