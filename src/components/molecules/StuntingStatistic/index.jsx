import React, { useRef, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  return (
    <div className="mt-20 p-4 md:p-8 rounded-xl">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
        <div className="md:w-1/2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
            Statistik Prevalensi Stunting di Indonesia
          </h2>
          <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed text-center md:text-left">
            Data prevalensi stunting di Indonesia dari tahun 2015 hingga 2023.
          </p>
          <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed text-center md:text-left">
            Grafik di sebelah kanan menunjukkan tren penurunan prevalensi
            stunting di Indonesia selama beberapa tahun terakhir. Terlihat bahwa
            prevalensi stunting terus menurun dari 28.0% pada tahun 2015 menjadi
            21.0% pada tahun 2023. Penurunan ini mencerminkan berbagai upaya dan
            program pemerintah serta berbagai pihak dalam mengatasi masalah
            stunting.
          </p>
          <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed text-center md:text-left">
            Meskipun ada penurunan yang signifikan, masih diperlukan kerja keras
            untuk mencapai target prevalensi stunting yang lebih rendah di masa
            mendatang. Upaya yang terus menerus dalam meningkatkan gizi,
            sanitasi, serta edukasi masyarakat sangat penting untuk keberhasilan
            jangka panjang.
          </p>
        </div>
        <div
          className="md:w-1/2 w-full max-w-full sm:max-w-2xl mx-auto"
          ref={chartRef}
        >
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                animationBegin={0}
                animationDuration={2000}
                animationEasing="ease-in-out"
                isAnimationActive={isChartVisible}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StuntingStatistics;
