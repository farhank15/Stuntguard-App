import EventTempTemp from "@/components/templates/EventScheduleTemp";
import React from "react";
import { Helmet } from "react-helmet-async";

const EventSchedule = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Event Schedule</title>
      </Helmet>
      <EventTempTemp />
    </div>
  );
};

export default EventSchedule;
