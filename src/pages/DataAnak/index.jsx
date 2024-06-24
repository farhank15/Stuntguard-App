import DataAnakTemp from "@/components/templates/DataAnakTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const DataAnak = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Data Anak</title>
      </Helmet>
      <DataAnakTemp />
    </div>
  );
};

export default DataAnak;
