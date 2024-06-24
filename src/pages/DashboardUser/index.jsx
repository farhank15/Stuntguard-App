import DashboardUserTemp from "@/components/templates/DashboardUserTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const DashboardUser = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Dashboard User</title>
      </Helmet>
      <DashboardUserTemp />
    </div>
  );
};

export default DashboardUser;
