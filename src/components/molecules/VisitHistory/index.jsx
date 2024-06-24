import React, { useState, useEffect } from "react";
import { supabase } from "@/client/supabaseClient";
import GrafikPertumbuhan from "@/components/molecules/GrafikPertumbuhan";

const VisitHistory = ({ childId }) => {
  const [visitHistory, setVisitHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    const fetchVisitHistory = async () => {
      try {
        const { data, error } = await supabase
          .from("rekam_medis_posyandu")
          .select("*")
          .eq("id_anak", childId)
          .order("tanggal_kunjungan", { ascending: true });

        if (error) {
          console.error("Error fetching visit history:", error.message);
          return;
        }

        setVisitHistory(data);
        setFilteredHistory(data);

        const uniqueYears = [
          ...new Set(
            data.map((visit) => new Date(visit.tanggal_kunjungan).getFullYear())
          ),
        ];
        setYears(uniqueYears);
      } catch (error) {
        console.error("Error fetching visit history:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitHistory();
  }, [childId]);

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);

    if (year === "all") {
      setFilteredHistory(visitHistory);
    } else {
      const filtered = visitHistory.filter(
        (visit) =>
          new Date(visit.tanggal_kunjungan).getFullYear().toString() === year
      );
      setFilteredHistory(filtered);
    }
  };

  if (loading) {
    return (
      <div className="mt-6">
        <h3 className="py-2 mb-6 text-2xl font-bold text-center rounded-md text-accent-800 bg-success-300">
          History Kunjungan dan Aktivitas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md relative animate-pulse"
            >
              <div className="w-4 h-4 border-2 border-slate-400 rounded-full absolute top-4 right-4 bg-gray-200"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visitHistory.length === 0) {
    return <div>No visit history found for this child.</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="py-2 mb-6 text-2xl font-bold text-center rounded-md text-accent-800 bg-success-300">
        History Kunjungan dan Aktivitas
      </h3>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistory.map((visit) => (
          <div
            key={visit.id}
            className="bg-white p-4 rounded-lg shadow-md relative"
          >
            <div
              className="w-4 h-4 border-2 border-slate-400 rounded-full absolute top-4 right-4"
              style={{ backgroundColor: visit.warna_heksa }}
            ></div>
            <p className="text-gray-600">
              <strong>Tanggal Kunjungan:</strong>{" "}
              {new Date(visit.tanggal_kunjungan).toLocaleDateString("id-ID")}
            </p>
            <p className="text-gray-600">
              <strong>Tinggi Badan:</strong> {visit.tinggi_badan} cm
            </p>
            <p className="text-gray-600">
              <strong>Berat Badan:</strong> {visit.berat_badan} kg
            </p>
            <p className="text-gray-600">
              <strong>Status:</strong> {visit.status}
            </p>
            {visit.aktivitas_imunisasi && (
              <>
                <p className="text-gray-600">
                  <strong>Aktivitas Imunisasi:</strong>{" "}
                  {visit.aktivitas_imunisasi}
                </p>
                <p className="text-gray-600">
                  <strong>Status Imunisasi:</strong> {visit.status_imunisasi}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      <GrafikPertumbuhan childId={childId} selectedYear={selectedYear} />
    </div>
  );
};

export default VisitHistory;
