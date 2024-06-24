import RekapPosyanduTemp from "@/components/templates/RekapPosyanduTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const RekapPosyandu = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Rekap Posyandu</title>
      </Helmet>
      <RekapPosyanduTemp />
    </div>
  );
};

export default RekapPosyandu;
