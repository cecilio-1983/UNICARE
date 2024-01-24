import React, { Fragment, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Divider,
  InputAdornment,
  FormControl,
  FormHelperText,
  InputLabel,
  Box,
  Avatar,
  Typography,
  Button,
  Dialog,
  Slide,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import StudentCard from "../../components/StudentCard";
import HealthDetailCard from "../../components/HealthDetailCard";
import "../../assets/css/Main.css";

import SearchIcon from "@mui/icons-material/Search";
import NumbersIcon from "@mui/icons-material/Numbers";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import SchoolIcon from "@mui/icons-material/School";
import ScaleIcon from "@mui/icons-material/Scale";
import HeightIcon from "@mui/icons-material/Height";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import WcIcon from "@mui/icons-material/Wc";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { useDoctor } from "./DoctorContext";
import { fetch, put } from "../../network/Request";
import dayjs from "dayjs";

import Students from "../../assets/images/Students.svg";
import EmptyList from "../../assets/images/EmptyList.svg";
import OnGoingAppointmentCard from "../../components/OnGoingAppointmentCard";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import validate from "../../validation/Validator";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const filter = createFilterOptions();

const healthRecordValidations = {
  disease: {
    type: "string",
    required: true,
    max: 50,
  },
  description: {
    type: "string",
    required: true,
    min: 30,
    max: 1000,
  },
};

export default function CheckPatient({ appointmentId = null }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const { noAuth, showAlert } = useDoctor();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthday: "",
    phone: "",
    email: "",
    address: "",
    bio: "",
    image: "",
    regNo: "",
    indexNo: "",
    faculty: "",
    height: "",
    weight: "",
    bloodGroup: "",
    diseases: "",
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [ongoingAppointments, setOngoingAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [addHealthRecordOpen, setAddHealthRecordOpen] = useState(false);

  const [addDiseaseOpen, setAddDiseaseOpen] = useState(false); // add new disease dialog open
  const [newDisease, setNewDisease] = useState(""); // add new disease dialog textfield

  const [diseaseSuggestions, setDiseaseSuggestions] = useState([]); // disease suggestions list
  const [autoCompleteValue, setAutoCompleteValue] = useState(null); // auto complete value

  const [healthRecordErrors, setHealthRecordErrors] = useState({
    disease: null,
    description: null,
  });
  const [newDiseaseError, setNewDiseaseError] = useState(null);

  const [healthRecord, setHealthRecord] = useState({
    disease: "",
    description: "",
  }); // final health record values

  const onStudentClick = (studentId) => {
    fetch(
      "tabs/doctors/check-patient/student",
      { studentId: studentId },
      (response) => {
        setSelectedStudent(response.student);
        let onAps = [];
        let upAps = [];
        let prAps = [];
        response.ongoingAppointments.forEach((ap) => {
          onAps.push({
            _id: ap._id,
            startTime: ap.startTime,
            endTime: ap.endTime,
            description: ap.description,
            checked: ap.checked,
            image: response.student.image,
            firstName: response.student.firstName,
            lastName: response.student.lastName,
            faculty: response.student.faculty,
          });
        });
        response.upcomingAppointments.forEach((ap) => {
          upAps.push({
            _id: ap._id,
            startTime: ap.startTime,
            endTime: ap.endTime,
            description: ap.description,
            checked: ap.checked,
            image: response.student.image,
            firstName: response.student.firstName,
            lastName: response.student.lastName,
            faculty: response.student.faculty,
          });
        });
        response.previousAppointments.forEach((ap) => {
          prAps.push({
            _id: ap._id,
            startTime: ap.startTime,
            endTime: ap.endTime,
            description: ap.description,
            checked: ap.checked,
            image: response.student.image,
            firstName: response.student.firstName,
            lastName: response.student.lastName,
            faculty: response.student.faculty,
          });
        });
        setOngoingAppointments(onAps);
        setUpcomingAppointments(upAps);
        setPreviousAppointments(prAps);
      },
      (error) => {
        if (error.status === "no-auth") noAuth();
        else showAlert(error.status, error.message);
      }
    );
  };

  const handleAddHealthRecordOpen = () => {
    setAddHealthRecordOpen(true);
  };

  const handleAddHealthRecordClose = () => {
    setAddHealthRecordOpen(false);
    setSelectedAppointment(null);
    setHealthRecord({ disease: "", description: "" });
    setAutoCompleteValue(null);
  };

  const handleAddDiseaseOpen = () => {
    setAddDiseaseOpen(true);
  };

  const handleAddDiseaseClose = () => {
    setAddDiseaseOpen(false);
    setNewDisease("");
  };

  const checkNow = (appointment) => {
    setSelectedAppointment(appointment);
    handleAddHealthRecordOpen();
  };

  const onDiseaseChange = (event, newValue) => {
    if (typeof newValue === "string") {
      setAutoCompleteValue(newValue);
      setHealthRecord((prev) => ({ ...prev, disease: newValue }));
      const res = validate(healthRecordValidations.disease, newValue);
      setHealthRecordErrors((prev) => ({
        ...prev,
        disease: res.valid ? null : res.msg,
      }));
    } else if (newValue && newValue.inputValue) {
      setTimeout(() => {
        setNewDisease(newValue.inputValue);
        handleAddDiseaseOpen();
      });
    }
  };

  const diseaseFilter = (options, params) => {
    const filtered = filter(options, params);

    if (params.inputValue !== "") {
      filtered.push({
        inputValue: params.inputValue,
        name: `Add "${params.inputValue}"`,
      });
    }

    return filtered;
  };

  const handleNewDiseaseChange = (e) => {
    setNewDisease(e.target.value);
    const res = validate(healthRecordValidations.disease, e.target.value);
    setNewDiseaseError(res.valid ? null : res.msg);
  };

  const addNewDisease = () => {
    const res = validate(healthRecordValidations.disease, newDisease);
    setNewDiseaseError(res.valid ? null : res.msg);
    if (res.valid) {
      put(
        "diseases/add",
        { disease: newDisease },
        (response) => {
          const disArray = response.diseases.map((dis) => dis.name);
          setDiseaseSuggestions(disArray);
          handleAddDiseaseClose();
          showAlert(response.status, response.message);
        },
        (error) => {
          if (error.status === "no-auth") noAuth();
          else showAlert(error.status, error.message);
        }
      );
    }
  };

  const saveHealthRecord = () => {
    let valid = true;

    Object.entries(healthRecordValidations).forEach(([key, validation]) => {
      const res = validate(validation, healthRecord[key]);
      setHealthRecordErrors((prev) => ({
        ...prev,
        [key]: res.valid ? null : res.msg,
      }));
      if (!res.valid) valid = false;
    });

    if (valid) {
      if (selectedStudent._id === "") {
        showAlert("warning", "Please select student first.");
        return;
      }

      put(
        "tabs/doctors/check-patient/add-record",
        {
          studentId: selectedStudent._id,
          disease: healthRecord.disease,
          description: healthRecord.description,
          ...(selectedAppointment && {
            appointmentId: selectedAppointment._id,
          }),
        },
        (response) => {
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
    if (appointmentId) {
      fetch(
        "tabs/doctors/check-patient/appointment",
        { appointmentId: appointmentId },
        (response) => {
          setSelectedStudent(response.student);
          let onAps = [];
          let upAps = [];
          let prAps = [];
          response.ongoingAppointments.forEach((ap) => {
            onAps.push({
              _id: ap._id,
              startTime: ap.startTime,
              endTime: ap.endTime,
              description: ap.description,
              image: response.student.image,
              firstName: response.student.firstName,
              lastName: response.student.lastName,
              faculty: response.student.faculty,
            });
          });
          response.upcomingAppointments.forEach((ap) => {
            upAps.push({
              _id: ap._id,
              startTime: ap.startTime,
              endTime: ap.endTime,
              description: ap.description,
              image: response.student.image,
              firstName: response.student.firstName,
              lastName: response.student.lastName,
              faculty: response.student.faculty,
            });
          });
          response.previousAppointments.forEach((ap) => {
            prAps.push({
              _id: ap._id,
              startTime: ap.startTime,
              endTime: ap.endTime,
              description: ap.description,
              image: response.student.image,
              firstName: response.student.firstName,
              lastName: response.student.lastName,
              faculty: response.student.faculty,
            });
          });
          setOngoingAppointments(onAps);
          setUpcomingAppointments(upAps);
          setPreviousAppointments(prAps);
        },
        (error) => {
          if (error.status === "no-auth") noAuth();
          else showAlert(error.status, error.message);
        }
      );
    }
  }, [appointmentId, noAuth, showAlert]);

  useEffect(() => {
    fetch(
      "tabs/doctors/check-patient",
      {},
      (response) => {
        setStudents(response.students);
      },
      (error) => {
        if (error.status === "no-auth") noAuth();
        else showAlert(error.status, error.message);
      }
    );
  }, [noAuth, showAlert]);

  useEffect(() => {
    fetch("diseases/all", {}, (response) => {
      const disArray = response.diseases.map((dis) => dis.name);
      setDiseaseSuggestions(disArray);
    });
  }, []);

  return (
    <Fragment>
      <Dialog open={addDiseaseOpen} onClose={handleAddDiseaseClose}>
        <DialogTitle>Add a new disease</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Did you miss any disease in the list? Please, add it!
          </DialogContentText>
          <TextField
            name="disease"
            autoFocus
            margin="dense"
            type="text"
            variant="standard"
            placeholder="Disease"
            fullWidth
            value={newDisease}
            onChange={handleNewDiseaseChange}
            error={newDiseaseError !== null}
            helperText={newDiseaseError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDiseaseClose}>Cancel</Button>
          <Button onClick={addNewDisease}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={addHealthRecordOpen}
        onClose={handleAddHealthRecordClose}
        TransitionComponent={Transition}
        fullWidth
      >
        <DialogTitle>Add Health Record</DialogTitle>
        <Divider />
        <DialogContent>
          <Box display="flex">
            <Box display="flex" justifyContent="start" flex={7}>
              <Avatar src={selectedStudent.image} />
              <Box display="flex" flexDirection="column" ml={2}>
                <Typography>
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {selectedStudent.faculty}
                </Typography>
              </Box>
            </Box>
            {selectedAppointment && (
              <>
                <Divider
                  orientation="vertical"
                  sx={{ margin: "0px 16px" }}
                  flexItem
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="start"
                  flex={13}
                >
                  <Typography>Appointment </Typography>
                  <Box
                    display="flex"
                    justifyContent="start"
                    alignItems="start"
                    mt={2}
                  >
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      flex={1}
                    >
                      Start time
                    </Typography>
                    <Typography variant="caption" ml={1}>
                      {dayjs(selectedAppointment.startTime).format(
                        "YYYY-MM-DD hh:mm A"
                      )}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="start" alignItems="start">
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      flex={1}
                    >
                      End time
                    </Typography>
                    <Typography variant="caption" ml={1}>
                      {dayjs(selectedAppointment.endTime).format(
                        "YYYY-MM-DD hh:mm A"
                      )}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="start" alignItems="start">
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      flex={1}
                    >
                      Description
                    </Typography>
                    <Typography variant="caption" textAlign="justify" ml={1}>
                      {selectedAppointment.description}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="start" alignItems="start">
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      flex={1}
                    >
                      Created at
                    </Typography>
                    <Typography variant="caption" ml={1}>
                      {dayjs(selectedAppointment.createdAt).format(
                        "YYYY-MM-DD hh:mm A"
                      )}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
              <InputLabel>Disease *</InputLabel>
              <FormControl fullWidth>
                <Autocomplete
                  size="small"
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  freeSolo
                  value={autoCompleteValue}
                  onChange={onDiseaseChange}
                  filterOptions={diseaseFilter}
                  options={diseaseSuggestions}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") return option;
                    if (option && option.name) return option.name;
                  }}
                  renderOption={(props, option) => {
                    if (typeof option === "string")
                      return <li {...props}>{option}</li>;
                    else if (option && option.name)
                      return <li {...props}>{option.name}</li>;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Disease"
                      error={healthRecordErrors.disease !== null}
                    />
                  )}
                />
                <FormHelperText error>
                  {healthRecordErrors.disease}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Description *</InputLabel>
              <TextField
                size="small"
                placeholder="Description"
                rows={4}
                multiline
                fullWidth
                value={healthRecord.description}
                error={healthRecordErrors.description !== null}
                helperText={healthRecordErrors.description}
                onChange={(e) => {
                  setHealthRecord((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                  const res = validate(
                    healthRecordValidations.description,
                    e.target.value
                  );
                  setHealthRecordErrors((prev) => ({
                    ...prev,
                    description: res.valid ? null : res.msg,
                  }));
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleAddHealthRecordClose}>
            Cancel
          </Button>
          <Button onClick={saveHealthRecord} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Box display="flex" flexDirection="column" rowGap={2}>
        <Card
          className="check-patient-student-list"
          variant="outlined"
          sx={{
            display: "flex",
            boxShadow: "none",
            position: "absolute",
            top: "88px",
            left: "24px",
            bottom: "24px",
            width: "300px",
          }}
        >
          <Box display="flex" flexDirection="column" width="100%">
            <TextField
              placeholder="Search student..."
              variant="outlined"
              size="small"
              sx={{ margin: "16px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: "block",
                overflowY: "auto",
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  width: "5px",
                  display: "none",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "transparent",
                  transition: "background-color 0.3s ease",
                },
                "&:hover::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(128, 128, 128, 0)",
                },
              }}
            >
              {students.map((student, index) => (
                <StudentCard
                  key={index}
                  data={student}
                  marginBottom
                  onClick={onStudentClick}
                />
              ))}
            </Box>
          </Box>
        </Card>

        <Card
          className="check-patient-content"
          variant="outlined"
          sx={{
            boxShadow: "none",
            position: "absolute",
            top: "88px",
            left: "340px",
            bottom: "24px",
            right: "24px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "transparent",
              transition: "background-color 0.3s ease",
            },
            "&:hover::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(128, 128, 128, 0.5)",
            },
            ...(selectedStudent._id === "" && {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }),
          }}
        >
          {selectedStudent._id !== "" && (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mr={1}
              >
                <CardHeader title="Selected Student" />
                <Box display="flex" columnGap="3px">
                  <Tooltip title="Add Health Record">
                    <IconButton onClick={handleAddHealthRecordOpen}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Health Records">
                    <IconButton>
                      <FolderSharedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <CardContent>
                <Box display="flex" columnGap={1}>
                  <Avatar src={selectedStudent.image} />
                  <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle2">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </Typography>
                    <Typography
                      fontSize="10px"
                      color="text.disabled"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        WebkitLineClamp: 2,
                        textOverflow: "ellipsis",
                      }}
                    >
                      {selectedStudent.bio}
                    </Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid item>
                        <Box display="flex" columnGap={1}>
                          <NumbersIcon fontSize="small" />
                          <Typography variant="caption">
                            {selectedStudent.indexNo}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box display="flex" columnGap={1}>
                          <HowToRegIcon fontSize="small" />
                          <Typography variant="caption">
                            {selectedStudent.regNo}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box display="flex" columnGap={1}>
                          <SchoolIcon fontSize="small" />
                          <Typography variant="caption">
                            {selectedStudent.faculty}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12}>
                    <Typography>General Details</Typography>
                  </Grid>
                  <Grid item flex={1}>
                    <HealthDetailCard
                      icon={<WcIcon sx={{ color: "white" }} />}
                      title="GENDER"
                      value={selectedStudent.gender}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <HealthDetailCard
                      icon={<HeightIcon sx={{ color: "white" }} />}
                      title="HEIGHT"
                      value={`${selectedStudent.height}cm`}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <HealthDetailCard
                      icon={<ScaleIcon sx={{ color: "white" }} />}
                      title="WEIGHT"
                      value={`${selectedStudent.weight}kg`}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <HealthDetailCard
                      icon={<BloodtypeIcon sx={{ color: "white" }} />}
                      title="BLOOD GROUP"
                      value={`${selectedStudent.bloodGroup}`}
                    />
                  </Grid>
                  <Grid item flex={1}>
                    <HealthDetailCard
                      icon={<AccessAlarmIcon sx={{ color: "white" }} />}
                      title="AGE"
                      value={
                        dayjs(selectedStudent.birthday).isValid()
                          ? dayjs().diff(
                              dayjs(selectedStudent.birthday),
                              "years"
                            )
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Ongoing Appointments</Typography>
                  </Grid>
                  <Grid item xs={12} display="flex">
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "10px",
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
                      {ongoingAppointments.map((ap, index) => (
                        <OnGoingAppointmentCard
                          key={index}
                          data={ap}
                          checkNow={checkNow}
                          marginRight={index !== ongoingAppointments.length - 1}
                        />
                      ))}
                      {ongoingAppointments.length === 0 && (
                        <img
                          src={EmptyList}
                          alt="No Appointments"
                          height="150px"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Upcoming Appointments</Typography>
                  </Grid>
                  <Grid item xs={12} display="flex">
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "10px",
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
                      {upcomingAppointments.map((ap, index) => (
                        <OnGoingAppointmentCard
                          key={index}
                          data={ap}
                          checkNow={checkNow}
                          marginRight={
                            index !== upcomingAppointments.length - 1
                          }
                        />
                      ))}
                      {upcomingAppointments.length === 0 && (
                        <img
                          src={EmptyList}
                          alt="No Appointments"
                          height="150px"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Previous Appointments</Typography>
                  </Grid>
                  <Grid item xs={12} display="flex">
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "10px",
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
                      {previousAppointments.map((ap, index) => (
                        <OnGoingAppointmentCard
                          key={index}
                          data={ap}
                          marginRight={
                            index !== upcomingAppointments.length - 1
                          }
                        />
                      ))}
                      {previousAppointments.length === 0 && (
                        <img
                          src={EmptyList}
                          alt="No Appointments"
                          height="150px"
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </>
          )}
          {selectedStudent._id === "" && (
            <img src={Students} alt="Students" width="40%" />
          )}
        </Card>
      </Box>
    </Fragment>
  );
}
