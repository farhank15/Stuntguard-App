import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/client/supabaseClient";
import Avatar from "@assets/icons/avatar.png";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const DisplayMember = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const token = Cookies.get("user_session");
      const decodedToken = jwtDecode(token);
      const adminId = decodedToken.id;

      const { data, error } = await supabase
        .from("orangtua")
        .select("*")
        .eq("admin_id", adminId);

      if (error) {
        console.error("Error fetching members:", error.message);
        Swal.fire({
          title: "Error",
          text: "Gagal mengambil data anggota!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        setMembers(data);
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  const handleDelete = async (id, parentPhotoPath) => {
    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data anggota ini akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const { data: children, error: fetchChildrenError } = await supabase
          .from("anak")
          .select("*")
          .eq("id_orangtua", id);

        if (fetchChildrenError) {
          throw new Error(
            "Gagal mengambil data anak: " + fetchChildrenError.message
          );
        }

        const { error: deleteParentError } = await supabase
          .from("orangtua")
          .delete()
          .eq("id", id);

        if (deleteParentError) {
          throw new Error(
            "Gagal menghapus data anggota: " + deleteParentError.message
          );
        }

        if (parentPhotoPath) {
          const parentPhotoName = `profile-ortu/${parentPhotoPath
            .split("/")
            .pop()}`;
          const { error: deleteParentPhotoError } = await supabase.storage
            .from("images")
            .remove([parentPhotoName]);

          if (deleteParentPhotoError) {
            throw new Error(
              "Gagal menghapus foto orang tua: " +
                deleteParentPhotoError.message
            );
          }
        }

        for (const child of children) {
          if (child.foto) {
            const childPhotoName = `profile-anak/${child.foto
              .split("/")
              .pop()}`;
            const { error: deleteChildPhotoError } = await supabase.storage
              .from("images")
              .remove([childPhotoName]);

            if (deleteChildPhotoError) {
              throw new Error(
                "Gagal menghapus foto anak: " + deleteChildPhotoError.message
              );
            }
          }

          const { error: deleteChildError } = await supabase
            .from("anak")
            .delete()
            .eq("id", child.id);

          if (deleteChildError) {
            throw new Error(
              "Gagal menghapus data anak: " + deleteChildError.message
            );
          }
        }

        setMembers(members.filter((member) => member.id !== id));
        Swal.fire({
          title: "Berhasil",
          text: "Data anggota berhasil dihapus!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error(error.message);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nik.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container h-auto px-4 py-8 mx-auto border-2 rounded-xl">
      <h2 className="py-2 mb-6 text-2xl font-bold text-center rounded-md text-accent-800 bg-success-300">
        Daftar Anggota
      </h2>
      <input
        type="text"
        placeholder="Cari berdasarkan NIK atau nama"
        className="w-full p-2 mb-6 border-2 border-gray-300 rounded-md focus:border-success-400 focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full skeleton"></div>
                <div className="ml-4 flex flex-col space-y-2">
                  <div className="w-32 h-4 bg-gray-300 skeleton"></div>
                  <div className="w-24 h-4 bg-gray-300 skeleton"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-300 skeleton"></div>
                <div className="w-full h-4 bg-gray-300 skeleton"></div>
                <div className="w-full h-4 bg-gray-300 skeleton"></div>
                <div className="w-full h-4 bg-gray-300 skeleton"></div>
              </div>
              <div className="flex justify-between mt-4">
                <div className="w-20 h-8 bg-gray-300 skeleton"></div>
                <div className="w-20 h-8 bg-gray-300 skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center h-[32rem] flex justify-center items-center text-gray-600">
          <h1 className="w-[25rem] text-xl text-slate-400">
            Belum ada data yang tersedia yang ditambahkan, silahkan tambahkan
            data anggota.
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <div key={member.id} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src={member.foto ? member.foto : Avatar}
                  alt="Avatar"
                  className="object-cover w-16 h-16 rounded-full"
                  onError={(e) => {
                    e.target.src = Avatar;
                  }}
                />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">{member.nama}</h3>
                  <p className="text-gray-600">{member.nik}</p>
                </div>
              </div>
              <p className="mb-2">
                <strong>Alamat:</strong> {member.alamat}
              </p>
              <p className="mb-2">
                <strong>Usia:</strong> {member.usia}
              </p>
              <p className="mb-2">
                <strong>Jenis Kelamin:</strong> {member.jenis_kelamin}
              </p>
              <p className="mb-2">
                <strong>Nomor Telepon:</strong> {member.nomor_telepon}
              </p>
              <div className="flex justify-between mt-4">
                <Link
                  to={`/edit-data/${member.id}`}
                  className="btn btn-primary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(member.id, member.foto)}
                  className="btn btn-danger"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayMember;
