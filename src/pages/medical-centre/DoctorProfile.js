import React, { Fragment, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  Avatar,
  CircularProgress,
  IconButton,
  Box,
  Button,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

import ImageCropDialog from "../../dialogs/ImageCropDialog";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VerifiedIcon from "@mui/icons-material/Verified";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WcIcon from "@mui/icons-material/Wc";

import dayjs from "dayjs";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDoctor } from "./DoctorContext";
import {
  dataUrlToBlob,
  randomText,
  firstLetterUppercase,
} from "../../common/Common";
import validate from "../../validation/Validator";
import { put, uploadFile } from "../../network/Request";

const validations = {
  firstName: { type: "string", required: true, max: 30 },
  lastName: { type: "string", required: true, max: 30 },
  gender: { type: "string", required: true, enum: ["male", "female"] },
  birthday: {
    type: "date",
    required: true,
    min: "1980-01-01",
    max: "today",
  },
  phone: {
    type: "string",
    required: true,
    regex: /^0\d{9}$/,
    regexError: "Phone number must start with 0 and must contain 10 digits",
  },
  email: {
    type: "string",
    required: true,
    max: 50,
    regex: /^\S+@\S+\.\S+$/,
  },
  bio: {
    type: "string",
    required: true,
    min: 100,
    max: 500,
  },
  mcRegNo: {
    type: "string",
    required: true,
    max: 50,
  },
  specialize: {
    type: "string",
    required: false,
    max: 100,
  },
};

const passwordValidations = {
  currentPassword: {
    type: "string",
    required: true,
  },
  newPassword: {
    type: "string",
    required: true,
    min: 8,
    max: 20,
    regex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    regexError:
      "The password must contain at least one symbol, one digit, one lowercase letter and one uppercase letter",
  },
  confirmPassword: {
    type: "string",
    required: true,
    min: 8,
    max: 20,
    regex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    regexError:
      "The password must contain at least one symbol, one digit, one lowercase letter and one uppercase letter",
  },
};

export default function DoctorProfile() {
  const { doctor, setDoctor, noAuth, showAlert, startProgress, endProgress } =
    useDoctor();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthday: "",
    phone: "",
    email: "",
    bio: "",
    mcRegNo: "",
    specialize: "",
  });
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    gender: null,
    birthday: null,
    phone: null,
    email: null,
    bio: null,
    mcRegNo: null,
    specialize: null,
  });
  const [pwd, setPwd] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdErrors, setPwdErrors] = useState({
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
  });

  const handleTabChange = (_, newValue) => {
    setTabIndex(newValue);
  };

  const handleDataChanged = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({ ...prevData, [name]: value }));

    if (validations.hasOwnProperty(name)) {
      const res = validate(validations[name], value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: res.valid ? null : res.msg,
      }));
    }
  };

  const validateAll = (start, offSet) => {
    let valid = true;
    for (let i = start; i < start + offSet; i++) {
      const validation = Object.entries(validations)[i];
      const res = validate(validation[1], data[validation[0]]);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [validation[0]]: res.valid ? null : res.msg,
      }));
      if (!res.valid) valid = false;
    }
    return valid;
  };

  const saveGenInfo = () => {
    if (validateAll(0, 7)) {
      startProgress();

      put(
        "doctors/update-general",
        data,
        (response) => {
          endProgress();
          setDoctor(response.doctor);
          showAlert(response.status, response.message);
        },
        (error) => {
          endProgress();
          if (error.status === "no-auth") noAuth();
          else showAlert(error.status, error.message);
        }
      );
    }
  };

  const saveProInfo = () => {
    if (validateAll(7, 2)) {
      startProgress();

      put(
        "doctors/update-pro",
        data,
        (response) => {
          endProgress();
          setDoctor(response.doctor);
          showAlert(response.status, response.message);
        },
        (error) => {
          endProgress();
          if (error.status === "no-auth") noAuth();
          else showAlert(error.status, error.message);
        }
      );
    }
  };

  const handlePwdChanged = (e) => {
    const { name, value } = e.target;

    setPwd((prevPwd) => ({ ...prevPwd, [name]: value }));

    if (passwordValidations.hasOwnProperty(name)) {
      const res = validate(passwordValidations[name], value);
      setPwdErrors((prevErrors) => ({
        ...prevErrors,
        [name]: res.valid ? null : res.msg,
      }));
    }
  };

  const updatePassword = () => {
    let valid = true;

    Object.entries(pwd).forEach(([key, value]) => {
      const res = validate(passwordValidations[key], value);

      setPwdErrors((prevErrors) => ({
        ...prevErrors,
        [key]: res.valid ? null : res.msg,
      }));
      if (!res.valid) valid = false;
    });

    if (valid) {
      if (pwd.newPassword !== pwd.confirmPassword) {
        setPwdErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Confirm password and password must same",
        }));
        return;
      }

      startProgress();

      put(
        "doctors/change-password",
        pwd,
        (response) => {
          endProgress();
          setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
          showAlert(response.status, response.message);
        },
        (error) => {
          endProgress();
          if (error.status === "no-auth") noAuth();
          else showAlert(error.status, error.message);
        }
      );
    }
  };

  // #region change dp

  const [uploadProgress, setUploadProgress] = useState(0);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [dp, setDp] = useState(null);

  const browseDp = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.addEventListener("change", (changeEvent) => {
      const file = changeEvent.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setDp(e.target.result);
          handleCropDialogOpen();
        };

        reader.readAsDataURL(file);
      }
    });

    fileInput.click();
  };

  const handleCropDialogOpen = () => setCropDialogOpen(true);

  const handleCropDialogClose = () => setCropDialogOpen(false);

  const onCropped = (image) => {
    const file = dataUrlToBlob(image);

    if (file.size > 3145728) {
      showAlert("error", "Profile picture cannot exceed 3MB.");
      return;
    }

    uploadFile(
      "doctors/change-dp",
      { key: "image", value: file },
      {},
      () => {
        setDoctor({
          ...doctor,
          ...{ image: `${doctor.image}?${randomText(10)}` },
        });
      },
      (error) => {
        if (error.status === "no-auth") noAuth();
        else showAlert(error.status, error.message);
      },
      (uploadedSize, totalSize, percentage) => setUploadProgress(percentage)
    );
  };

  // #endregion

  useEffect(() => {
    setData(doctor);
  }, [doctor]);

  return (
    <Fragment>
      <ImageCropDialog
        open={cropDialogOpen}
        onClose={handleCropDialogClose}
        image={dp}
        onCropped={onCropped}
      />

      <Box display="flex" flexDirection="column">
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="General Information" />
          <Tab label="Change Password" />
        </Tabs>

        <Grid container spacing={2} display={tabIndex === 0 ? "flex" : "none"}>
          <Grid item md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" flexDirection="column">
                  <Box
                    position="relative"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100px"
                    height="100px"
                  >
                    <CircularProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{
                        display:
                          uploadProgress === 0 || uploadProgress === 100
                            ? "none"
                            : "block",
                        position: "absolute",
                        width: "100px !important",
                        height: "100px !important",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                      }}
                    />
                    <Avatar
                      sx={{ width: "93px", height: "93px" }}
                      src={doctor.image}
                    />
                    <IconButton
                      onClick={browseDp}
                      sx={{
                        position: "absolute",
                        right: "-3px",
                        bottom: "-3px",
                      }}
                    >
                      <CameraAltIcon />
                    </IconButton>
                  </Box>
                  <Typography mt={2} variant="h6">
                    {doctor.firstName} {doctor.lastName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    lineHeight={1}
                  >
                    Doctor
                  </Typography>
                  <Typography variant="caption" textAlign="center" mt={2}>
                    {doctor.bio}
                  </Typography>
                  <Divider />

                  <List sx={{ mt: 2 }}>
                    <ListItem>
                      <Box display="flex" columnGap={1} alignItems="center">
                        <PhoneIcon fontSize="small" />
                        <Typography variant="caption">
                          {doctor.phone}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Box display="flex" columnGap={1} alignItems="center">
                        <EmailIcon fontSize="small" />
                        <Typography variant="caption">
                          {doctor.email}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Box display="flex" columnGap={1} alignItems="center">
                        <WcIcon fontSize="small" />
                        <Typography variant="caption">
                          {firstLetterUppercase(doctor.gender)}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Box display="flex" columnGap={1} alignItems="center">
                        <LocalHospitalIcon fontSize="small" />
                        <Typography variant="caption">
                          {doctor.mcRegNo}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Box display="flex" columnGap={1} alignItems="center">
                        <VerifiedIcon fontSize="small" />
                        <Typography variant="caption">
                          {doctor.specialize
                            ? doctor.specialize
                            : "No specialization"}
                        </Typography>
                      </Box>
                    </ListItem>
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={12}>
                <Card>
                  <CardHeader title="General Information" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <InputLabel>First Name *</InputLabel>
                        <TextField
                          name="firstName"
                          size="small"
                          placeholder="First Name"
                          fullWidth
                          value={data.firstName}
                          onChange={handleDataChanged}
                          error={errors.firstName !== null}
                          helperText={errors.firstName}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InputLabel>Last Name *</InputLabel>
                        <TextField
                          name="lastName"
                          size="small"
                          placeholder="Last Name"
                          fullWidth
                          value={data.lastName}
                          onChange={handleDataChanged}
                          error={errors.lastName !== null}
                          helperText={errors.lastName}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InputLabel>Gender *</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            name="gender"
                            size="small"
                            placeholder="Gender"
                            value={data.gender}
                            onChange={handleDataChanged}
                            error={errors.gender !== null}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                          </Select>
                          <FormHelperText error>{errors.gender}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InputLabel>Birthday *</InputLabel>
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              slotProps={{
                                textField: {
                                  size: "small",
                                  placeholder: "Birthday",
                                  error: errors.birthday !== null,
                                },
                              }}
                              format="YYYY-MM-DD"
                              value={dayjs(data.birthday)}
                              onChange={(value) =>
                                handleDataChanged({
                                  target: {
                                    name: "birthday",
                                    value: value,
                                  },
                                })
                              }
                            />
                          </LocalizationProvider>
                          <FormHelperText error>
                            {errors.birthday}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InputLabel>Phone Number *</InputLabel>
                        <TextField
                          name="phone"
                          size="small"
                          placeholder="Phone Number"
                          fullWidth
                          value={data.phone}
                          onChange={handleDataChanged}
                          error={errors.phone !== null}
                          helperText={errors.phone}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InputLabel>Email Address *</InputLabel>
                        <TextField
                          name="email"
                          size="small"
                          placeholder="Email Address"
                          fullWidth
                          value={data.email}
                          onChange={handleDataChanged}
                          error={errors.email !== null}
                          helperText={errors.email}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputLabel>Bio *</InputLabel>
                        <TextField
                          size="small"
                          placeholder="Bio"
                          multiline
                          fullWidth
                          rows={4}
                          value={data.bio}
                          onChange={handleDataChanged}
                          error={errors.bio !== null}
                          helperText={errors.bio}
                        />
                      </Grid>
                      <Grid item xs={12} display="flex" justifyContent="right">
                        <Button variant="outlined" onClick={saveGenInfo}>
                          Save Changes
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
                <Card>
                  <CardHeader title="Professional Information" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>MC Registration Number *</InputLabel>
                        <TextField
                          name="mcRegNo"
                          size="small"
                          placeholder="MC Registration Number"
                          fullWidth
                          value={data.mcRegNo}
                          onChange={handleDataChanged}
                          error={errors.mcRegNo !== null}
                          helperText={errors.mcRegNo}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>Specialization</InputLabel>
                        <TextField
                          name="specialize"
                          size="small"
                          placeholder="Specialization"
                          fullWidth
                          value={data.specialize ?? ""}
                          onChange={handleDataChanged}
                          error={errors.specialize !== null}
                          helperText={errors.specialize}
                        />
                      </Grid>
                      <Grid item xs={12} display="flex" justifyContent="right">
                        <Button variant="outlined" onClick={saveProInfo}>
                          Save Changes
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Card
          sx={{
            ...(tabIndex !== 1 && { display: "none" }),
          }}
        >
          <CardHeader title="Change Password" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel>Current Password *</InputLabel>
                <TextField
                  name="currentPassword"
                  type="password"
                  size="small"
                  placeholder="Current Password"
                  fullWidth
                  value={pwd.currentPassword}
                  onChange={handlePwdChanged}
                  error={pwdErrors.currentPassword !== null}
                  helperText={pwdErrors.currentPassword}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>New Password *</InputLabel>
                <TextField
                  name="newPassword"
                  type="password"
                  size="small"
                  placeholder="New Password"
                  fullWidth
                  value={pwd.newPassword}
                  onChange={handlePwdChanged}
                  error={pwdErrors.newPassword !== null}
                  helperText={pwdErrors.newPassword}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Confirm Password *</InputLabel>
                <TextField
                  name="confirmPassword"
                  type="password"
                  size="small"
                  placeholder="Confirm Password"
                  fullWidth
                  value={pwd.confirmPassword}
                  onChange={handlePwdChanged}
                  error={pwdErrors.confirmPassword !== null}
                  helperText={pwdErrors.confirmPassword}
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="right">
                <Button variant="outlined" onClick={updatePassword}>
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Fragment>
  );
}
