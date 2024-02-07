import React, { Fragment, useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";
import { fetch } from "../../network/Request";
import { useDoctor } from "./DoctorContext";

import "@fontsource/cabin/400.css";
import "@fontsource/cabin/600.css";
import "../../assets/css/Main.css";

import PersonIcon from "@mui/icons-material/Person";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckPatient from "./CheckPatient";

export default function Appointments() {
  const { showAlert, noAuth, openOtherTab } = useDoctor();
  const [events, setEvents] = useState([]);

  const getRemoteEvents = (data) => {
    fetch(
      "tabs/doctors/appointments",
      {
        start: data.start,
        end: data.end,
      },
      (response) => {
        let ets = [];

        response.appointments.forEach((a, i) => {
          ets.push({
            event_id: a._id,
            title: "Appointment",
            start: new Date(a.startTime),
            end: new Date(a.endTime),
            editable: false,
            deletable: false,
            draggable: false,
            avatar: a.student.image,
            admin_id: a.studentId,
            student_name: `${a.student.firstName} ${a.student.lastName}`,
            description: a.description,
          });
        });

        setEvents(ets);
      },
      (error) => {
        if (error.status === "no-auth") noAuth();
        else showAlert(error.status, error.message);
      }
    );
  };

  const browseCheckPatient = (appointmentId) => {
    openOtherTab(2, <CheckPatient appointmentId={appointmentId} />);
  };

  return (
    <Fragment>
      <div className="scheduler-wrapper">
        <Scheduler
          height={2000}
          view="day"
          day={{
            startHour: 8,
            endHour: 18,
            cellRenderer: ({ height, start, onClick, ...props }) => {
              return (
                <Button
                  style={{
                    height: "100%",
                    background: "transparent",
                    cursor: "default",
                  }}
                  disableRipple={true}
                  {...props}
                ></Button>
              );
            },
          }}
          week={{
            startHour: 8,
            endHour: 18,
            cellRenderer: ({ height, start, onClick, ...props }) => {
              return (
                <Button
                  style={{
                    height: "100%",
                    background: "transparent",
                    cursor: "default",
                  }}
                  disableRipple={true}
                  {...props}
                ></Button>
              );
            },
          }}
          month={{
            cellRenderer: ({ height, start, onClick, ...props }) => {
              return (
                <Button
                  style={{
                    height: "100%",
                    background: "transparent",
                    cursor: "default",
                  }}
                  disableRipple={true}
                  {...props}
                ></Button>
              );
            },
          }}
          events={events}
          viewerTitleComponent={(event) => {
            return (
              <Box display="flex" flexDirection="column" rowGap="5px">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" columnGap="5px" alignItems="center">
                    <PersonIcon fontSize="small" />
                    <Typography variant="caption">
                      {event.student_name}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => browseCheckPatient(event.event_id)}
                  >
                    <OpenInBrowserIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box display="flex" columnGap="5px">
                  <DescriptionIcon fontSize="small" />
                  <Typography variant="caption">{event.description}</Typography>
                </Box>
              </Box>
            );
          }}
          getRemoteEvents={getRemoteEvents}
        />
      </div>
    </Fragment>
  );
}
