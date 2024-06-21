import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "@/client/supabaseClient";
import Avatar from "@assets/icons/avatar.png";

const DisplayMember = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase.from("orangtua").select("*");

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

  const handleDelete = async (id, photoPath) => {
    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data anggota ini akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      const { error } = await supabase.from("orangtua").delete().eq("id", id);

      if (error) {
        console.error("Error deleting member:", error.message);
        Swal.fire({
          title: "Error",
          text: "Gagal menghapus data anggota!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        if (photoPath) {
          const photoName = `profile-ortu/${photoPath.split("/").pop()}`; // Extract the file name from the path and prefix with 'profile/'
          const { error: deleteError } = await supabase.storage
            .from("images")
            .remove([photoName]);

          if (deleteError) {
            console.error("Error deleting photo:", deleteError.message);
            Swal.fire({
              title: "Error",
              text: "Gagal menghapus foto!",
              icon: "error",
              confirmButtonText: "OK",
            });
            return;
          }
        }
        // Update members state to exclude the deleted member
        setMembers(members.filter((member) => member.id !== id));
        Swal.fire({
          title: "Berhasil",
          text: "Data anggota berhasil dihapus!",
          icon: "success",
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 border-2 h-auto">
      <h2 className="text-2xl font-bold mb-6 py-2 text-accent-800 rounded-md bg-success-300 text-center">
        Daftar Anggota
      </h2>
      <input
        type="text"
        placeholder="Cari berdasarkan NIK atau nama"
        className="mb-6 p-2 border-2 border-gray-300 rounded-md w-full focus:border-success-400 focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredMembers.length === 0 ? (
        <div className="text-center h-[20rem] flex justify-center items-center text-gray-600">
          <h1 className="w-[25rem] text-xl text-slate-400">
            Belum ada data yang tersedia yang ditambahkan, silahkan tambahkan
            data anggota.
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex items-center mb-4">
                <img
                  src={member.foto ? member.foto : Avatar}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full object-cover"
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
