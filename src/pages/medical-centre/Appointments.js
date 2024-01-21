import React from "react";
import { Scheduler } from "@aldabil/react-scheduler";

import "@fontsource/cabin/400.css";
import "@fontsource/cabin/600.css";

import "../../assets/css/Main.css";

export default function Appointments() {
  return (
    <div className="scheduler-wrapper">
      <Scheduler
        view="month"
        events={[
          {
            event_id: 1,
            title: "Kasun Buddhika - Prithi Kasana",
            start: new Date("2023/12/21 09:30"),
            end: new Date("2023/12/21 10:30"),
          },
          {
            event_id: 2,
            title: "Imashi Perera - Eye Infection",
            start: new Date("2023/12/21 12:00"),
            end: new Date("2023/12/21 13:00"),
          },
        ]}
      />
    </div>
  );
}
