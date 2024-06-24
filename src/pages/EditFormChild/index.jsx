import React from "react";
import EditFormChildTemp from "../../components/templates/EditFormChildTemp";
import { Helmet } from "react-helmet-async";

const EditFormChild = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Edit Form Child</title>
      </Helmet>
      <EditFormChildTemp />
    </div>
  );
};

export default EditFormChild;
