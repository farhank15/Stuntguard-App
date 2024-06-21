import React, { useState, useEffect } from "react";
import axios from "axios";

const StuntingCalculator = () => {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [analysisResult, setAnalysisResult] = useState(null);
  const [growthData, setGrowthData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const apiKey = import.meta.env.VITE_API_KEY;

        const response = await axios.get(
          `${apiUrl}/rest/v1/growth_data_gender`,
          {
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          }
        );

        setGrowthData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleReset = () => {
    setGender("");
    setAge("");
    setHeight("");
    setWeight("");
    setAnalysisResult(null);
  };

  const handleCalculate = () => {
    const errors = {};

    if (!gender) {
      errors.gender = "Jenis Kelamin harus dipilih";
    }
    if (!age) {
      errors.age = "Usia harus diisi";
    } else if (age < 0 || age > 60) {
      errors.age = "Usia harus antara 0 dan 60 bulan";
    }
    if (!height) {
      errors.height = "Tinggi badan harus diisi";
    }
    if (!weight) {
      errors.weight = "Berat badan harus diisi";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setAnalysisResult(null);
      return;
    }

    const ageInt = parseInt(age);
    const result = checkStunting(
      ageInt,
      parseFloat(height),
      parseFloat(weight),
      gender
    );

    setValidationErrors({});
    setAnalysisResult(result);
  };

  const checkStunting = (age, height, weight, gender) => {
    const data = growthData.filter(
      (item) => item.gender === gender && item.age === age
    );
    if (data.length === 0) {
      return {
        isStunting: true,
        message: "Data tidak ditemukan untuk usia ini",
        heightRange: "Tidak Diketahui",
        weightRange: "Tidak Diketahui",
        clustering: "Golongan 4",
      };
    }

    const range = data[0];
    const tbBbRatio = height / weight;

    if (weight < range.weight_min && height < range.height_min) {
      return {
        isStunting: true,
        tbBbRatio,
        message: "Anak mengalami stunting",
        heightRange: "Kurang",
        weightRange: "Kurang",
        clustering: "Golongan 4",
      };
    } else if (weight < range.weight_min && height > range.height_max) {
      return {
        isStunting: true,
        tbBbRatio,
        message:
          "Mungkin anak kurang gizi, tinggi badan anak di atas rata-rata tapi berat badan anak kurang.",
        heightRange: "Lebih",
        weightRange: "Kurang",
        clustering: "Golongan 2",
      };
    } else if (weight > range.weight_max && height < range.height_min) {
      return {
        isStunting: true,
        tbBbRatio,
        message:
          "Tinggi badan dan berat badan anak tidak ideal mungkin anak mengalami stunting, segera konsultasikan ke dokter.",
        heightRange: "Kurang",
        weightRange: "Lebih",
        clustering: "Golongan 4",
      };
    } else if (weight > range.weight_max && height > range.height_max) {
      return {
        isStunting: true,
        tbBbRatio,
        message:
          "Anak tumbuh normal tinggi anak di atas rata-rata tapi berat badan anak sedikit berlebihan.",
        heightRange: "Lebih",
        weightRange: "Lebih",
        clustering: "Golongan 2",
      };
    } else if (height < range.height_min) {
      return {
        isStunting: true,
        tbBbRatio,
        message:
          "Anak mungkin mengalami stunting, berat badan anak ideal tapi tinggi anak kurang",
        heightRange: "Kurang",
        weightRange: "Normal",
        clustering: "Golongan 3",
      };
    } else if (weight < range.weight_min) {
      return {
        isStunting: true,
        tbBbRatio,
        message:
          "Anak mungkin mengalami stunting, tinggi badan anak ideal tapi berat anak kurang",
        heightRange: "Normal",
        weightRange: "Kurang",
        clustering: "Golongan 2",
      };
    } else if (weight > range.weight_max) {
      return {
        isStunting: true,
        tbBbRatio,
        message: "Anak tumbuh normal, berat badan anak berlebihan",
        heightRange: "Normal",
        weightRange: "Lebih",
        clustering: "Golongan 2",
      };
    } else if (height > range.height_max) {
      return {
        isStunting: true,
        tbBbRatio,
        message: "Anak tumbuh normal, tinggi badan anak diatas rata-rata",
        heightRange: "Lebih",
        weightRange: "Normal",
        clustering: "Golongan 1",
      };
    } else if (
      height >= range.height_min &&
      height <= range.height_max &&
      weight >= range.weight_min &&
      weight <= range.weight_max
    ) {
      return {
        isStunting: false,
        tbBbRatio,
        message: "Anak tumbuh dengan Normal",
        heightRange: "Normal",
        weightRange: "Normal",
        clustering: "Golongan 1",
      };
    } else {
      return {
        isStunting: true,
        tbBbRatio,
        message: "Anak mengalami stunting",
        heightRange: "Tidak Diketahui",
        weightRange: "Tidak Diketahui",
        clustering: "Golongan 4",
      };
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-10 md:flex-row bg-secondary">
      <div className="w-full md:w-[40rem] max-w-md p-8 bg-white border rounded shadow-md md:mr-5 h-full md:h-[44rem] font-poppins flex flex-col">
        <h2 className="mb-4 text-2xl font-bold text-center text-primary-500">
          Deteksi Stunting
        </h2>
        <div className="mb-4 flex-grow">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="gender"
          >
            Jenis Kelamin
          </label>
          <select
            className={`w-full p-2 border rounded ${
              validationErrors.gender ? "border-red-500" : ""
            }`}
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option>Pilih Jenis Kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
          {validationErrors.gender && (
            <p className="mt-1 text-xs text-red-500">
              {validationErrors.gender}
            </p>
          )}
        </div>

        <div className="mb-4 flex-grow">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="age"
          >
            Usia (bulan)
          </label>
          <input
            type="number"
            id="age"
            className={`w-full p-2 border rounded ${
              validationErrors.age ? "border-red-500" : ""
            }`}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          {validationErrors.age && (
            <p className="mt-1 text-xs text-red-500">{validationErrors.age}</p>
          )}
        </div>

        <div className="mb-4 flex-grow">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="height"
          >
            Tinggi Badan (cm)
          </label>
          <input
            type="number"
            id="height"
            className={`w-full p-2 border rounded ${
              validationErrors.height ? "border-red-500" : ""
            }`}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          {validationErrors.height && (
            <p className="mt-1 text-xs text-red-500">
              {validationErrors.height}
            </p>
          )}
        </div>

        <div className="mb-4 flex-grow">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="weight"
          >
            Berat Badan (kg)
          </label>
          <input
            type="number"
            id="weight"
            className={`w-full p-2 border rounded ${
              validationErrors.weight ? "border-red-500" : ""
            }`}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          {validationErrors.weight && (
            <p className="mt-1 text-xs text-red-500">
              {validationErrors.weight}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            className="px-6 py-2 text-white bg-primary-500 rounded hover:bg-primary-600 focus:outline-none"
            onClick={handleCalculate}
          >
            Hitung
          </button>
          <button
            className="px-6 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="w-full max-w-md md:w-[40rem] p-8 mt-10 bg-white border rounded shadow-md md:mt-0 h-full font-poppins flex flex-col">
        <h2 className="mb-4 text-2xl font-bold text-center text-primary-500">
          Hasil Analisis
        </h2>
        <div className="mb-4 flex-grow">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="status"
          >
            Status
          </label>
          <input
            type="text"
            id="status"
            className="w-full p-2 border rounded"
            value={
              analysisResult
                ? analysisResult.isStunting
                  ? "Stunting"
                  : "Normal"
                : ""
            }
            readOnly
          />
        </div>

        <div className="mb-4 flex-grow">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="ratio"
          >
            Tinggi Badan/Berat Badan
          </label>
          <input
            type="text"
            id="ratio"
            className="w-full p-2 border rounded"
            value={analysisResult?.tbBbRatio?.toFixed(2) || ""}
            readOnly
          />
        </div>

        <div className="mb-4 flex-grow">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="heightRange"
          >
            Rentang Tinggi Badan
          </label>
          <input
            type="text"
            id="heightRange"
            className="w-full p-2 border rounded"
            value={analysisResult?.heightRange || ""}
            readOnly
          />
        </div>

        <div className="mb-4 flex-grow">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="weightRange"
          >
            Rentang Berat Badan
          </label>
          <input
            type="text"
            id="weightRange"
            className="w-full p-2 border rounded"
            value={analysisResult?.weightRange || ""}
            readOnly
          />
        </div>

        <div className="mb-4 flex-grow">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="clustering"
          >
            Clustering
          </label>
          <input
            type="text"
            id="clustering"
            className="w-full p-2 border rounded"
            value={analysisResult?.clustering || ""}
            readOnly
          />
        </div>

        <div className="mb-4 flex-grow h-36">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="message"
          >
            Keterangan
          </label>
          <textarea
            id="message"
            className="w-full p-2 border rounded h-36"
            value={analysisResult?.message || ""}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default StuntingCalculator;
