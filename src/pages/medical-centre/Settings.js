import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  FormHelperText,
  Switch,
  List,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "../../theme/ThemeContext";
import TimeSlot from "../../components/TimeSlot";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCallback, useEffect, useState } from "react";
import validate from "../../validation/Validator";
import { timeToMinutes } from "../../common/Common";
import { put, fetch, remove } from "../../network/Request";
import { useDoctor } from "./DoctorContext";

const validations = {
  startTime: {
    type: "time",
    required: true,
    min: "08:00 AM",
    max: "05:00 PM",
  },
  endTime: {
    type: "time",
    required: true,
    min: "08:00 AM",
    max: "05:00 PM",
  },
};

export default function Settings() {
  const { showAlert, noAuth } = useDoctor();
  const { darkMode, toggleDarkMode } = useTheme();

  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState({ startTime: "", endTime: "" });
  const [errors, setErrors] = useState({ startTime: null, endTime: null });

  const handleDataChanged = (e) => {
    const { name, value } = e.target;

    setSlot((prevSlot) => ({ ...prevSlot, [name]: value }));

    const res = validate(validations[name], value);

    if (res.valid) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: res.msg }));
    }
  };

  const validateAll = () => {
    var ok = true;

    Object.entries(slot).forEach(([key, value]) => {
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

  const addTimeSlot = () => {
    if (validateAll()) {
      const body = {
        startTime: timeToMinutes(slot.startTime),
        endTime: timeToMinutes(slot.endTime),
      };

      put(
        "timeslots/add",
        body,
        (response) => {
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

  const onTimeSlotDelete = (_id) => {
    remove(
      "timeslots",
      { _id: _id },
      (response) => {
        loadData();
        showAlert(response.status, response.message);
      },
      (error) => {
        showAlert(error.status, error.message);
      }
    );
  };

  const loadData = useCallback(() => {
    fetch(
      "timeslots",
      {},
      (response) => {
        setSlots(response.slots);
      },
      (error) => {
        showAlert(error.status, error.message);
      }
    );
  }, [showAlert]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Theme</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption">Dark theme</Typography>
            <Switch checked={darkMode} onChange={toggleDarkMode} />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Notifications</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption">
                Appointment notification
              </Typography>
              <Switch />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption">Emergency notification</Typography>
              <Switch />
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Appointment time slots</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ boxShadow: "none" }}>
                  <CardHeader title="Add new slot" />
                  <CardContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <InputLabel>Start Time</InputLabel>
                          <TimePicker
                            slotProps={{
                              textField: {
                                size: "small",
                                placeholder: "Start Time",
                                error: errors.startTime !== null,
                              },
                            }}
                            sx={{ width: "100%" }}
                            value={slot.startTime}
                            onChange={(value) =>
                              handleDataChanged({
                                target: { name: "startTime", value: value },
                              })
                            }
                          />
                          <FormHelperText
                            sx={{
                              display:
                                errors.startTime === null ? "none" : "block",
                              color: "error.main",
                              margin: "4px 14px 0px 14px !important",
                            }}
                          >
                            {errors.startTime}
                          </FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                          <InputLabel>End Time</InputLabel>
                          <TimePicker
                            slotProps={{
                              textField: {
                                size: "small",
                                placeholder: "End Time",
                                error: errors.endTime !== null,
                              },
                            }}
                            sx={{ width: "100%" }}
                            value={slot.endTime}
                            onChange={(value) =>
                              handleDataChanged({
                                target: { name: "endTime", value: value },
                              })
                            }
                          />
                          <FormHelperText
                            sx={{
                              display:
                                errors.endTime === null ? "none" : "block",
                              color: "error.main",
                              margin: "4px 14px 0px 14px !important",
                            }}
                          >
                            {errors.endTime}
                          </FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            onClick={addTimeSlot}
                            fullWidth
                          >
                            Add Slot
                          </Button>
                        </Grid>
                      </Grid>
                    </LocalizationProvider>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={8}>
                <List sx={{ padding: 0 }}>
                  {slots.map((value, index) => {
                    if (index === slots.length - 1) {
                      return (
                        <TimeSlot
                          key={index}
                          data={value}
                          onClickDelete={onTimeSlotDelete}
                        />
                      );
                    } else {
                      return (
                        <Box marginBottom="8px" key={index}>
                          <TimeSlot
                            key={index}
                            data={value}
                            onClickDelete={onTimeSlotDelete}
                          />
                        </Box>
                      );
                    }
                  })}
                </List>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
}
