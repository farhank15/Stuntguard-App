import AdminDashboardTemp from "@/components/templates/AdminDashboardTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const AdminDashboard = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Admin Dashboard</title>
      </Helmet>
      <AdminDashboardTemp />
    </div>
  );
};

export default AdminDashboard;
