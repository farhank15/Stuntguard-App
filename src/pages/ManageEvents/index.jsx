import ManageEventsTemp from "@/components/templates/ManageEventsTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const ManageEvents = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Manage Events</title>
      </Helmet>
      <ManageEventsTemp />
    </div>
  );
};

export default ManageEvents;
