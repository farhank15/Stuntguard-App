import LogAktivitasTemp from "@/components/templates/LogAktivitasTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const LogAktivitas = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Log Aktivitas</title>
      </Helmet>
      <LogAktivitasTemp />
    </div>
  );
};

export default LogAktivitas;
