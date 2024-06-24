import React from "react";
import { useParams } from "react-router-dom";
import DynamicCardAdd from "@/components/atoms/DynamicCardAdd";

const TambahRekapPosyandu = () => {
  const { id } = useParams();

  return (
    <div>
      <DynamicCardAdd link={`/form-rekap-medis-posyandu/${id}`} />
    </div>
  );
};

export default TambahRekapPosyandu;
