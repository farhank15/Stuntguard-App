import React, { useRef, useEffect, useState } from "react";
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = [
  { year: "2015", percentage: 28.0 },
  { year: "2016", percentage: 27.5 },
  { year: "2017", percentage: 27.0 },
  { year: "2018", percentage: 25.5 },
  { year: "2019", percentage: 24.5 },
  { year: "2020", percentage: 23.5 },
  { year: "2021", percentage: 22.5 },
  { year: "2022", percentage: 21.5 },
  { year: "2023", percentage: 21.0 },
];

const StuntingStatistics = () => {
  const chartRef = useRef(null);
  const [isChartVisible, setIsChartVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsChartVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  const chartData = {
    labels: data.map((d) => d.year),
    datasets: [
      {
        label: "Prevalensi Stunting (%)",
        data: data.map((d) => d.percentage),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
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
        text: "Statistik Prevalensi Stunting di Indonesia",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}% (${context.label})`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (val, index) {
            return data[index].year;
          },
        },
      },
    },
  };

  return (
    <div className="p-4 mt-20 md:p-8 rounded-xl">
      <div className="flex flex-col items-center space-y-6 md:flex-row md:items-start md:space-y-0 md:space-x-10">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold text-center text-gray-800 md:text-3xl md:text-left">
            Statistik Prevalensi Stunting di Indonesia
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-center text-gray-600 md:text-base md:text-left">
            Data prevalensi stunting di Indonesia dari tahun 2015 hingga 2023.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-center text-gray-600 md:text-base md:text-left">
            Grafik di sebelah kanan menunjukkan tren penurunan prevalensi
            stunting di Indonesia selama beberapa tahun terakhir. Terlihat bahwa
            prevalensi stunting terus menurun dari 28.0% pada tahun 2015 menjadi
            21.0% pada tahun 2023. Penurunan ini mencerminkan berbagai upaya dan
            program pemerintah serta berbagai pihak dalam mengatasi masalah
            stunting.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-center text-gray-600 md:text-base md:text-left">
            Meskipun ada penurunan yang signifikan, masih diperlukan kerja keras
            untuk mencapai target prevalensi stunting yang lebih rendah di masa
            mendatang. Upaya yang terus menerus dalam meningkatkan gizi,
            sanitasi, serta edukasi masyarakat sangat penting untuk keberhasilan
            jangka panjang.
          </p>
        </div>
        <div
          className="w-full max-w-full mx-auto md:w-1/2 sm:max-w-2xl"
          ref={chartRef}
        >
          <div className="h-96">
            <Line data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StuntingStatistics;
