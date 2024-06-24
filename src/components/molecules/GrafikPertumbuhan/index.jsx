// src/components/molecules/GrafikPertumbuhan.jsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { supabase } from "@/client/supabaseClient";
import { useParams } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GrafikPertumbuhan = ({ childId, selectedYear }) => {
  const [growthData, setGrowthData] = useState(null);

  useEffect(() => {
    const fetchGrowthData = async () => {
      const { data, error } = await supabase
        .from("rekam_medis_posyandu")
        .select("tanggal_kunjungan, tinggi_badan, berat_badan")
        .eq("id_anak", childId)
        .order("tanggal_kunjungan", { ascending: true });

      if (error) {
        console.error("Error fetching growth data:", error.message);
      } else {
        setGrowthData(data);
      }
    };

    fetchGrowthData();
  }, [childId]);

  if (!growthData) {
    return <div>Loading...</div>;
  }

  const filteredData =
    selectedYear === "all"
      ? growthData
      : growthData.filter(
          (data) =>
            new Date(data.tanggal_kunjungan).getFullYear().toString() ===
            selectedYear
        );

  const labels = filteredData.map((data) =>
    new Date(data.tanggal_kunjungan).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  );
  const shortLabels = filteredData.map((data) =>
    new Date(data.tanggal_kunjungan).toLocaleDateString("id-ID", {
      day: "numeric",
    })
  );
  const tinggiBadan = filteredData.map((data) => data.tinggi_badan);
  const beratBadan = filteredData.map((data) => data.berat_badan);

  const data = {
    labels: window.innerWidth <= 768 ? shortLabels : labels,
    datasets: [
      {
        label: "Tinggi Badan (cm)",
        data: tinggiBadan,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.5,
      },
      {
        label: "Berat Badan (kg)",
        data: beratBadan,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        tension: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Grafik Pertumbuhan Anak",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.raw;
            const fullDate = filteredData[context.dataIndex].tanggal_kunjungan;
            return `${label}: ${value} (${new Date(fullDate).toLocaleDateString(
              "id-ID"
            )})`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (val, index) {
            const label = this.getLabelForValue(val);
            return window.innerWidth <= 768
              ? shortLabels[index]
              : labels[index];
          },
        },
      },
    },
  };

  return (
    <div className="h-96 md:h-[40rem]">
      <Line data={data} options={options} />
    </div>
  );
};

export default GrafikPertumbuhan;
