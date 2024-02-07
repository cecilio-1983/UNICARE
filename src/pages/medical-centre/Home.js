import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Switch,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import ReactApexCharts from "react-apexcharts";

import "@fontsource/cabin/400.css";
import "@fontsource/cabin/600.css";

import AppointmentCard from "../../components/AppointmentCard";
import { useDoctor } from "./DoctorContext";
import { fetch, put } from "../../network/Request";
import CheckPatient from "./CheckPatient";
import Appointments from "./Appointments";

export default function Home({ openCheckPatient = (appointmentId) => {} }) {
  const theme = useTheme();
  const { doctor, noAuth, showAlert, openOtherTab } = useDoctor();

  const [online, setOnline] = useState(false);
  const [selectedDate] = useState(dayjs().format("DD/MM/YYYY"));
  const [now, setNow] = useState(dayjs().format("HH:mm:ss A"));
  const [appointments, setAppointments] = useState([]);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "area",
      background: "rgba(0, 0, 0, 0)",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    xaxis: {
      type: "year",
      categories: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
    },
    tooltip: {
      x: {
        format: "yyyy",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      markers: {
        width: 12,
        height: 12,
        radius: 6,
        offsetX: 0,
        offsetY: 1,
        strokeWidth: 0,
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
  });

  const changeOnlineStatus = () => {
    put(
      "tabs/doctors/home/status",
      {},
      (response) => {
        setOnline(response.online);
        showAlert(response.status, response.message);
      },
      (error) => {
        if (error.status === "no-auth") noAuth();
        else showAlert(error.status, error.message);
      }
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs().format("HH:mm:ss A"));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    fetch(
      "tabs/doctors/home",
      {},
      (response) => {
        setOnline(response.online);
        setAppointments(response.appointments);
        let sd = [];
        let xaxis = {
          type: "year",
          categories: [],
        };
        response.graph.forEach((e) => {
          let dt = {
            name: e.faculty,
            data: [],
          };
          e.years.forEach((f) => {
            xaxis.categories = [...xaxis.categories, f.year];
            dt.data = [...dt.data, f.count];
          });
          sd.push(dt);
        });
        setOptions((prev) => ({ ...prev, xaxis: xaxis }));
        setSeries(sd);
      },
      (error) => {
        if (error.status === "no-auth") noAuth();
        else showAlert(error.status, error.message);
      }
    );
  }, [noAuth, showAlert]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9}>
        <Card>
          <CardContent>
            <Typography variant="h6">
              Hi {doctor.firstName}, Good Morning
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography>{now}</Typography>
              <Typography>{selectedDate}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CardContent
            sx={{
              width: "100%",
              paddingBottom: "16px !important",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              fontWeight="600"
              fontSize="18px"
              color={online ? "green" : "red"}
            >
              {online ? "ONLINE" : "OFFLINE"}
            </Typography>
            <Switch checked={online} onChange={changeOnlineStatus} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>Upcomming Appointments</Typography>
          <Button
            variant="outlined"
            onClick={() => openOtherTab(1, <Appointments />)}
          >
            View all
          </Button>
        </Box>
      </Grid>
      {appointments.length > 0 && (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {appointments.map((appointment, index) => (
              <Grid key={index} item xs={12} sm={6} md={3}>
                <AppointmentCard
                  data={appointment}
                  shadow
                  onClickCheck={(apId) =>
                    openOtherTab(2, <CheckPatient appointmentId={apId} />)
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: "100%" }}>
          <CardHeader title="Patients" subheader="(+42%) than last year" />
          <CardContent>
            <ReactApexCharts
              options={options}
              series={series}
              type="area"
              height={262}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ height: "100%" }}>
          <CardContent
            sx={{
              overflowX: "auto",
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                height: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "transparent",
                transition: "background-color 0.3s ease",
              },
              "&:hover::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(128, 128, 128, 0.5)",
              },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
