import DataOrangTuaTemp from "@/components/templates/DataOrangTuaTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const DataOrangTua = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Data Orang Tua</title>
      </Helmet>
      <DataOrangTuaTemp />
    </div>
  );
};

export default DataOrangTua;
