import React, { useState } from "react";
import Banner from "@/components/atoms/Banner";
import Clustering from "@/components/molecules/Clustering";
import StuntingCalculator from "@/components/molecules/Kalkulator-gizi";
import GrowthDataTable from "@/components/molecules/TableAnak";

const KalkulatorGiziTemp = () => {
  const [jenisKelamin, setJenisKelamin] = useState("male");

  return (
    <div className="space-y-6">
      <Banner
        classNamep="text-lg font-semibold"
        description="Kalkulator ini hanya berlaku untuk anak-anak hingga usia 5 tahun."
      />
      <StuntingCalculator />
      <Clustering />
      <div className="form-control px-4">
        <label className="label" htmlFor="jenisKelamin">
          <span className="label-text text-2xl font-bold">
            Pilih Jenis Kelamin
          </span>
        </label>
        <select
          className="select select-bordered w-full"
          id="jenisKelamin"
          value={jenisKelamin}
          onChange={(e) => setJenisKelamin(e.target.value)}
        >
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>
      <GrowthDataTable jenisKelamin={jenisKelamin} />
    </div>
  );
};

export default KalkulatorGiziTemp;
