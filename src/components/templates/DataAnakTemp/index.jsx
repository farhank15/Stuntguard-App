import DisplayChildren from "@/components/molecules/DisplayChildren";
import TambahAnak from "@/components/molecules/TambahAnak";
import React from "react";

const DataAnakTemp = () => {
  return (
    <div className="pt-24">
      <TambahAnak />
      <DisplayChildren />
    </div>
  );
};

export default DataAnakTemp;
