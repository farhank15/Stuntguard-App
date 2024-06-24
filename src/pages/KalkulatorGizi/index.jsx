import KalkulatorGiziTemp from "@/components/templates/KalkulatorGizi";
import React from "react";
import { Helmet } from "react-helmet-async";

const KalkulatorGizi = () => {
  return (
    <div className="pt-20">
      <Helmet>
        <title>Stuntguard - Kalkulator Gizi </title>
      </Helmet>

      <KalkulatorGiziTemp />
    </div>
  );
};

export default KalkulatorGizi;
