import RekapPosyandu from "@/components/molecules/RekapPosyandu";
import TambahRekapPosyandu from "@/components/molecules/TambahRekapPosyandu";
import React from "react";

const RekapPosyanduTemp = () => {
  return (
    <div className="py-20 mx-auto font-poppins ">
      <TambahRekapPosyandu />
      <RekapPosyandu />
    </div>
  );
};

export default RekapPosyanduTemp;
