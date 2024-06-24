import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/client/supabaseClient";
import defaultAvatar from "@assets/icons/avatar.png";
import VisitHistory from "@components/molecules/VisitHistory";

const ChildDetail = () => {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const { data: childData, error: childError } = await supabase
          .from("anak")
          .select("*")
          .eq("id", id)
          .single();

        if (childError) {
          console.error("Error fetching child data:", childError.message);
          return;
        }

        setChild(childData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, [id]);

  if (loading) {
    return (
      <div className="container h-auto px-4 py-8 mx-auto border-2 rounded-xl">
        <div className="h-10 bg-gray-200 animate-pulse mb-6"></div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="ml-4">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
        </div>
      </div>
    );
  }

  if (!child) {
    return <div>Data anak tidak ditemukan.</div>;
  }

  return (
    <div className="container h-auto px-4 py-8 mx-auto border-2 rounded-xl">
      <h2 className="py-2 mb-6 text-2xl font-bold text-center rounded-md text-accent-800 bg-success-300">
        Detail Anak
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
          <img
            src={child.foto || defaultAvatar}
            alt="Child Avatar"
            className="w-16 h-16 rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
          />
          <div className="ml-4">
            <h3 className="text-xl font-semibold">{child.nama}</h3>
            <p className="text-gray-600">NIK: {child.nik}</p>
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

      <VisitHistory childId={child.id} />
    </div>
  );
};

export default ChildDetail;
