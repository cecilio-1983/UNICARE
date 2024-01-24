import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  InputLabel,
  FormControl,
  MenuItem,
  FormHelperText,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCallback, useEffect, useState } from "react";
import { fetch, put } from "../../network/Request";
import { useStudent } from "./StudentContext";
import { minutesToTime } from "../../common/Common";

import dayjs from "dayjs";

import validate from "../../validation/Validator";
import StudentAppointmentCard from "../../components/StudentAppointmentCard";
import EmptyList from "../../assets/images/EmptyList.svg";

const validations = {
  date: {
    type: "date",
    required: true,
    min: "today",
  },
  timeslotId: {
    type: "string",
    required: true,
  },
  description: {
    type: "string",
    required: true,
    min: 50,
    max: 500,
  },
};

export default function Apointments() {
  const { showAlert, noAuth } = useStudent();

  const [freeSlots, setFreeSlots] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [appointment, setAppointment] = useState({
    date: "",
    timeslotId: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    date: null,
    timeslotId: null,
    description: null,
  });

  const handleDataChanged = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      fetch(
        "tabs/students/appointments/free-slots",
        { date: value },
        (response) => {
          setAppointment((prevAppointment) => ({
            ...prevAppointment,
            timeslotId: "",
          }));
          setFreeSlots(response.freeSlots);
        },
        (error) => {
          showAlert(error.status, error.message);
        }
      );
    }

    setAppointment((prevAppointments) => ({
      ...prevAppointments,
      [name]: value,
    }));

    if (validations.hasOwnProperty(name)) {
      const res = validate(validations[name], value);

      if (res.valid) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: res.msg }));
      }
    }
  };

  const validateAll = () => {
    var ok = true;

    Object.entries(appointment).forEach(([key, value]) => {
      const res = validate(validations[key], value);

      if (res.valid) {
        setErrors((prevErrors) => ({ ...prevErrors, [key]: null }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [key]: [res.msg] }));
        ok = false;
      }
    });

    return ok;
  };

  const loadData = useCallback(
    () =>
      fetch(
        "tabs/students/appointments",
        {},
        (response) => {
          setUpcomingAppointments(response.upcomingAppointments);
          setPreviousAppointments(response.previousAppointments);
        },
        (error) => {
          if (error.status === "no-auth") noAuth();
          else showAlert(error.status, error.message);
        }
      ),
    [noAuth, showAlert]
  );

  const addAppointment = () => {
    if (validateAll()) {
      put(
        "tabs/students/appointments/add",
        {
          date: appointment.date,
          timeslotId: appointment.timeslotId,
          description: appointment.description,
        },
        (response) => {
          setAppointment({ date: "", timeslotId: "", description: "" });
          loadData();
          showAlert(response.status, response.message);
        },
        (error) => {
          if (error.status === "no-auth") noAuth();
          else showAlert(error.status, error.message);
        }
      );
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card variant="outlined" sx={{ boxShadow: "none" }}>
          <CardHeader title="Add Appointment" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <InputLabel>Date *</InputLabel>
                  <DatePicker
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "Date",
                        error: errors.date !== null,
                      },
                    }}
                    format="YYYY-MM-DD"
                    sx={{ width: "100%" }}
                    value={appointment.date}
                    onChange={(value) =>
                      handleDataChanged({
                        target: {
                          name: "date",
                          value: dayjs(value).format("YYYY-MM-DD"),
                        },
                      })
                    }
                    disablePast
                  />
                </LocalizationProvider>
                <FormHelperText
                  sx={{
                    display: errors.date === null ? "none" : "block",
                    color: "error.main",
                    margin: "4px 14px 0px 14px !important",
                  }}
                >
                  {errors.date}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Time *</InputLabel>
                <FormControl sx={{ width: "100%" }}>
                  <Select
                    name="timeslotId"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={appointment.timeslotId}
                    onChange={handleDataChanged}
                    error={errors.timeslotId !== null}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {freeSlots.map((slot, index) => (
                      <MenuItem key={index} value={slot._id}>
                        {`${minutesToTime(slot.startTime)} - ${minutesToTime(
                          slot.endTime
                        )}`}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText
                    sx={{
                      display: errors.timeslotId === null ? "none" : "block",
                      color: "error.main",
                    }}
                  >
                    {errors.timeslotId}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel>Description *</InputLabel>
                <TextField
                  name="description"
                  value={appointment.description}
                  placeholder="Description"
                  size="small"
                  rows={4}
                  onChange={handleDataChanged}
                  error={errors.description !== null}
                  helperText={errors.description}
                  multiline
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="end">
                  <Button variant="contained" onClick={addAppointment}>
                    Add Appointment
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Typography>Upcoming Appointments</Typography>
      </Grid>
      <Grid item xs={12} display="flex">
        <Box
          sx={{
            display: "inline-block",
            whiteSpace: "nowrap",
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
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((ap, index) => (
              <StudentAppointmentCard
                key={index}
                data={ap}
                mr={index !== upcomingAppointments.length - 1}
                upcoming
              />
            ))
          ) : (
            <img src={EmptyList} alt="Empty List" style={{ height: "200px" }} />
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography>Previous Appointments</Typography>
      </Grid>
      <Grid item xs={12} display="flex">
        <Box
          sx={{
            display: "inline-block",
            whiteSpace: "nowrap",
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
          {previousAppointments.length > 0 ? (
            previousAppointments.map((ap, index) => (
              <StudentAppointmentCard
                key={index}
                data={ap}
                mr={index !== previousAppointments.length - 1}
              />
            ))
          ) : (
            <img src={EmptyList} alt="Empty List" style={{ height: "200px" }} />
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
