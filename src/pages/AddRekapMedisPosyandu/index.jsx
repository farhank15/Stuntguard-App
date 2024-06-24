import AddRekapMedisPosyanduTemp from "@/components/templates/AddRekapMedisPosyanduTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const AddRekapMedisPosyandu = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Add Rekap Medis Posyandu</title>
      </Helmet>
      <AddRekapMedisPosyanduTemp />
    </div>
  );
};

export default AddRekapMedisPosyandu;
