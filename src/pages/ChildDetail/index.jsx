import ChildDetailTemp from "@/components/templates/ChildDetailTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const ChildDetail = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Child Detail</title>
      </Helmet>
      <ChildDetailTemp />
    </div>
  );
};

export default ChildDetail;
