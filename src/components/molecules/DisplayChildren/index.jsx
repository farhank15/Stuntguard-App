import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/client/supabaseClient";
import Avatar from "@assets/icons/avatar.png";
import Dotbutton from "@assets/icons/dot-button.svg";

const DisplayChildren = () => {
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchChildren = async () => {
      const { data, error } = await supabase
        .from("anak")
        .select(
          "id, nama, alamat, usia, jenis_kelamin, foto, dibuat_pada, id_orangtua, orangtua (nama)"
        )
        .order("dibuat_pada", { ascending: false });

      if (error) {
        console.error("Error fetching children data:", error.message);
        Swal.fire({
          title: "Error",
          text: "Gagal mengambil data anak!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        setChildren(data);
        setFilteredChildren(data); // Initialize filtered children
      }
      setLoading(false);
    };

    fetchChildren();
  }, []);

  const handleMenuToggle = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDetail = (id) => {
    // Handle detail action
    console.log("Detail", id);
  };

  const handleEdit = (id) => {
    // Handle edit action
    console.log("Edit", id);
  };

  const deleteImage = async (path) => {
    const { error } = await supabase.storage.from("images").remove([path]);
    if (error) {
      console.error("Error deleting image:", error.message);
      Swal.fire({
        title: "Error",
        text: "Gagal menghapus gambar!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDelete = async (id, foto) => {
    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data anak ini akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      setIsDeleting(true);
      const { error } = await supabase.from("anak").delete().eq("id", id);

      if (error) {
        console.error("Error deleting child:", error.message);
        Swal.fire({
          title: "Error",
          text: "Gagal menghapus data anak!",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsDeleting(false);
      } else {
        if (foto) {
          const photoName = `profile-anak/${foto.split("/").pop()}`; // Extract the file name from the path and prefix with 'profile-anak/'
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
            setIsDeleting(false);
            return;
          }
        }
        setChildren(children.filter((child) => child.id !== id));
        setFilteredChildren(
          filteredChildren.filter((child) => child.id !== id)
        );
        Swal.fire({
          title: "Berhasil",
          text: "Data anak berhasil dihapus!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setIsDeleting(false);
      }
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredChildren(
      children.filter(
        (child) =>
          child.nama.toLowerCase().includes(query) ||
          child.orangtua.nama.toLowerCase().includes(query)
      )
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 border-2 h-auto">
      <h2 className="text-2xl font-bold mb-6 py-2 text-accent-800 rounded-md bg-success-300 text-center">
        Daftar Anak
      </h2>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-2 mb-6 border rounded"
        placeholder="Cari anak atau wali..."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChildren.length === 0 ? (
          <div className="col-span-full h-[20rem] flex justify-center items-center text-gray-600">
            <h1 className="w-[25rem] text-center text-xl text-slate-400">
              Belum ada data yang tersedia , silahkan tambahkan data anak.
            </h1>
          </div>
        ) : (
          filteredChildren.map((child) => (
            <div
              key={child.id}
              className="relative bg-white shadow-md rounded-lg p-4"
            >
              <div className="flex items-center mb-4">
                <img
                  src={child.foto ? child.foto : Avatar}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = Avatar;
                  }}
                />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">{child.nama}</h3>
                  <p className="text-gray-600">Wali: {child.orangtua.nama}</p>
                </div>
                <div className="ml-auto relative p-2">
                  <button
                    onClick={() => handleMenuToggle(child.id)}
                    className="focus:outline-none"
                  >
                    <img
                      src={Dotbutton}
                      className="h-6 w-6 md:h-8 md:w-8 m-auto"
                      alt="Menu"
                    />
                  </button>
                  {activeMenu === child.id && (
                    <div className="absolute z-10 right-0 mt-2 w-48 bg-white border rounded-lg shadow-md">
                      <button
                        onClick={() => handleDetail(child.id)}
                        className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleEdit(child.id)}
                        className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(child.id, child.foto)}
                        className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Dibuat pada: {new Date(child.dibuat_pada).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DisplayChildren;
