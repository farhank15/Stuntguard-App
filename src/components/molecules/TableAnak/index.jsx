import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "@/components/atoms/DynamicTable";

const GrowthDataTable = ({ jenisKelamin }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const apiKey = import.meta.env.VITE_API_KEY;

        const response = await axios.get(
          `${apiUrl}/rest/v1/growth_data_gender?gender=eq.${jenisKelamin}`,
          {
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          }
        );

        // Transformasi data di sini
        const transformedData = response.data.map((item) => ({
          id: item.id,
          usia: item.age,
          jenis_kelamin: item.gender === "male" ? "Laki-laki" : "Perempuan",
          tinggi_min: item.height_min,
          tinggi_max: item.height_max,
          berat_min: item.weight_min,
          berat_max: item.weight_max,
        }));

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [jenisKelamin]);

  return <DynamicTable data={data} />;
};

export default GrowthDataTable;
