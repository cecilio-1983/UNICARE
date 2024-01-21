import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import ReactApexCharts from "react-apexcharts";

import "@fontsource/cabin/400.css";
import "@fontsource/cabin/600.css";

import AppointmentCard from "../../components/AppointmentCard";
import { useStudent } from "./StudentContext";

const series = [
  {
    name: "Faculty of Science",
    data: [31, 40, 28, 51, 42, 109, 100],
  },
  {
    name: "Faculty of Technology",
    data: [11, 32, 45, 32, 34, 52, 41],
  },
  {
    name: "Faculty of Commerce",
    data: [5, 50, 21, 17, 47, 20, 10],
  },
];

export default function Home() {
  const theme = useTheme();
  const { student } = useStudent();

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [now, setNow] = useState(dayjs().format("HH:mm:ss A"));

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const options = {
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
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs().format("HH:mm:ss A"));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">
              Hi {student.firstName}, Good Morning
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography>{now}</Typography>
              <Typography>{dayjs().format("DD/MM/YYYY")}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>Upcomming Appointments</Typography>
          <Button variant="outlined">View all</Button>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <AppointmentCard
          id="0"
          time="12:05"
          image="../../profile1.png"
          name="Ahinsa Lakshani"
          faculty="Faculty of Science"
          note="Magna sit ullamco ipsum eu quis labore non sint. Labore culpa tempor
          excepteur ut sunt aliqua eu cillum."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AppointmentCard
          id="1"
          time="13:05"
          image="../../profile2.png"
          name="Pasindu Nethmina"
          faculty="Faculty of Agriculture"
          note="Magna sit ullamco ipsum eu quis labore non sint. Labore culpa tempor
          excepteur ut sunt aliqua eu cillum."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AppointmentCard
          id="2"
          time="12:35"
          image="../../profile3.png"
          name="Kasun Buddhika"
          faculty="Faculty of Art"
          note="Magna sit ullamco ipsum eu quis labore non sint. Labore culpa tempor
          excepteur ut sunt aliqua eu cillum."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AppointmentCard
          id="3"
          time="12:45"
          image="../../profile4.png"
          name="Imashi Perera"
          faculty="Faculty of Science"
          note="Magna sit ullamco ipsum eu quis labore non sint. Labore culpa tempor
          excepteur ut sunt aliqua eu cillum."
          checkPatient={(id) => {
            console.log(`Check patient clicked, Id: ${id}`);
          }}
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
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
        <Card>
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
              <DateCalendar value={selectedDate} onChange={handleDateChange} />
            </LocalizationProvider>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
