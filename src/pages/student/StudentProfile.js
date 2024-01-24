import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import WcIcon from "@mui/icons-material/Wc";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NumbersIcon from "@mui/icons-material/Numbers";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import ImageCropDialog from "../../dialogs/ImageCropDialog";
import { useStudent } from "./StudentContext";
import { uploadFile } from "../../network/Request";
import { firstLetterUppercase } from "../../common/Common";
import { dataUrlToBlob, randomText } from "../../common/Common";
import validate from "../../validation/Validator";
import { fetch, put } from "../../network/Request";

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
  address: {
    type: "string",
    required: true,
    max: 200,
  },
  bio: {
    type: "string",
    required: true,
    min: 100,
    max: 500,
  },
  regNo: {
    type: "string",
    required: true,
    max: 30,
  },
  indexNo: {
    type: "string",
    required: true,
    max: 20,
  },
  faculty: {
    type: "string",
    required: true,
  },
  height: {
    type: "float",
    required: true,
    min: 0.0,
    max: 300.0,
  },
  weight: {
    type: "float",
    required: true,
    min: 0.0,
    max: 500.0,
  },
  bloodGroup: {
    type: "string",
    required: true,
    enum: ["a+", "a-", "b+", "b-", "o+", "o-", "ab+", "ab-"],
  },
  diseases: {
    type: "string",
    max: 1000,
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

export default function StudentProfile() {
  const { student, setStudent, noAuth, showAlert, startProgress, endProgress } =
    useStudent();
  const [tabIndex, setTabIndex] = useState(0);
  const [faculties, setFaculties] = useState([]);
  const [localStudent, setLocalStudent] = useState(student);
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    gender: null,
    birthday: null,
    phone: null,
    email: null,
    password: null,
    confirmPassword: null,
    address: null,
    bio: null,
    regNo: null,
    indexNo: null,
    faculty: null,
    height: null,
    weight: null,
    bloodGroup: null,
    diseases: null,
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
  });

  const handleTabChange = (_, newValue) => {
    setTabIndex(newValue);
  };

  const handleDataChanged = (e) => {
    const { name, value } = e.target;

    setLocalStudent((prevStudent) => ({ ...prevStudent, [name]: value }));

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
      const res = validate(validation[1], localStudent[validation[0]]);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [validation[0]]: res.valid ? null : res.msg,
      }));
      if (!res.valid) valid = false;
    }
    return valid;
  };

  const saveGeneral = () => {
    if (validateAll(0, 8)) {
      startProgress();

      put(
        "students/update-general",
        localStudent,
        (response) => {
          endProgress();
          showAlert(response.status, response.message);
          setStudent(response.student);
        },
        (error) => {
          endProgress();
          if (error.status === "no-auth") noAuth();
          else showAlert(error.status, error.message);
        }
      );
    }
  };

  const saveReg = () => {
    if (validateAll(8, 3)) {
      startProgress();

      put(
        "students/update-reg",
        localStudent,
        (response) => {
          endProgress();
          showAlert(response.status, response.message);
          setStudent(response.student);
        },
        (error) => {
          endProgress();
          if (error.status === "no-auth") noAuth();
          else showAlert(error.status, error.message);
        }
      );
    }
  };

  const saveHealth = () => {
    if (validateAll(11, 4)) {
      startProgress();

      put(
        "students/update-health",
        localStudent,
        (response) => {
          endProgress();
          showAlert(response.status, response.message);
          setStudent(response.student);
        },
        (error) => {
          endProgress();
          if (error.status === "no-auth") noAuth();
          else showAlert(error.status, error.message);
        }
      );
    }
  };

  const handlePasswordChanged = (e) => {
    const { name, value } = e.target;

    setPassword((prevPassword) => ({ ...prevPassword, [name]: value }));

    const res = validate(passwordValidations[name], value);
    setPasswordErrors((prevErrors) => ({
      ...prevErrors,
      [name]: res.valid ? null : res.msg,
    }));
  };

  const changePassword = () => {
    let valid = true;

    Object.entries(password).forEach(([key, value]) => {
      const res = validate(passwordValidations[key], value);

      setPasswordErrors((prevErrors) => ({
        ...prevErrors,
        [key]: res.valid ? null : res.msg,
      }));
      if (!res.valid) valid = false;
    });

    if (valid) {
      if (password.newPassword !== password.confirmPassword) {
        setPasswordErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Confirm password and password must same",
        }));
        return;
      }

      startProgress();

      put(
        "students/change-password",
        password,
        (response) => {
          endProgress();
          setPassword({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
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

  // #region select and crop image

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
      "students/change-dp",
      { key: "image", value: file },
      {},
      () => {
        setStudent({
          ...student,
          ...{ image: `${student.image}?${randomText(10)}` },
        });
      },
      (error) => {
        if (error.status === "no-auth") {
          noAuth();
        } else {
          showAlert(error.status, error.message);
        }
      },
      (uploadedSize, totalSize, percentage) => setUploadProgress(percentage)
    );
  };

  // #endregion

  useEffect(() => {
    fetch(
      "faculties/all",
      {},
      (response) => {
        setFaculties(response.faculties);
        // endProgress();
      },
      (error) => {
        // endProgress();
        // showAlert(error.status, error.message);
      }
    );
  }, []);

  return (
    <React.Fragment>
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
          {/* Student Details */}
          <Grid item sm={12} md={4}>
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
                      src={student.image}
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
                    {student.firstName + " " + student.lastName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    lineHeight={1}
                  >
                    Student
                  </Typography>
                  <Typography variant="caption" textAlign="center" mt={2}>
                    {student.bio}
                  </Typography>
                  <Divider />

                  <List sx={{ mt: 2 }}>
                    <ListItem>
                      <Box display="flex" columnGap={1} alignItems="center">
                        <NumbersIcon fontSize="small" />
                        <Typography variant="caption">
                          {student.indexNo}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Box display="flex" columnGap={1} alignItems="center">
                        <HowToRegIcon fontSize="small" />
                        <Typography variant="caption">
                          {student.regNo}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Box display="flex" columnGap={1} alignItems="center">
                        <PhoneIcon fontSize="small" />
                        <Typography variant="caption">
                          {student.phone}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Box display="flex" columnGap={1} alignItems="center">
                        <EmailIcon fontSize="small" />
                        <Typography variant="caption">
                          {student.email}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Box display="flex" columnGap={1} alignItems="center">
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="caption">
                          {student.address}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <Box display="flex" columnGap={1} alignItems="center">
                        <WcIcon fontSize="small" />
                        <Typography variant="caption">
                          {firstLetterUppercase(student.gender)}
                        </Typography>
                      </Box>
                    </ListItem>
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item sm={12} md={8}>
            <Grid container spacing={2}>
              {/* General Information */}
              <Grid item xs={12} sm={6} md={12}>
                <Card>
                  <CardHeader title="General Information" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <InputLabel>First Name *</InputLabel>
                        <TextField
                          name="firstName"
                          size="small"
                          placeholder="First Name"
                          fullWidth
                          value={localStudent.firstName}
                          onChange={handleDataChanged}
                          helperText={errors.firstName}
                          error={errors.firstName !== null}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <InputLabel>Last Name *</InputLabel>
                        <TextField
                          name="lastName"
                          size="small"
                          placeholder="Last Name"
                          fullWidth
                          value={localStudent.lastName}
                          onChange={handleDataChanged}
                          helperText={errors.lastName}
                          error={errors.lastName !== null}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <InputLabel>Gender *</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            name="gender"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={localStudent.gender}
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
                      <Grid item xs={12} md={4}>
                        <InputLabel>Birthday *</InputLabel>
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="YYYY-MM-DD"
                              slotProps={{
                                textField: {
                                  size: "small",
                                  placeholder: "Birthday",
                                  error: errors.birthday !== null,
                                },
                              }}
                              value={dayjs(localStudent.birthday)}
                              onChange={(value) => {
                                handleDataChanged({
                                  target: { name: "birthday", value: value },
                                });
                              }}
                            />
                          </LocalizationProvider>
                          <FormHelperText error>
                            {errors.birthday}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <InputLabel>Phone Number *</InputLabel>
                        <TextField
                          name="phone"
                          size="small"
                          placeholder="Phone Number"
                          fullWidth
                          value={localStudent.phone}
                          onChange={handleDataChanged}
                          error={errors.phone !== null}
                          helperText={errors.phone}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <InputLabel>Email Address *</InputLabel>
                        <TextField
                          name="email"
                          size="small"
                          placeholder="Email Address"
                          fullWidth
                          value={localStudent.email}
                          onChange={handleDataChanged}
                          error={errors.email !== null}
                          helperText={errors.email}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputLabel>Address *</InputLabel>
                        <TextField
                          name="address"
                          size="small"
                          placeholder="Address"
                          multiline
                          fullWidth
                          rows={3}
                          value={localStudent.address}
                          onChange={handleDataChanged}
                          error={errors.address !== null}
                          helperText={errors.address}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputLabel>Bio *</InputLabel>
                        <TextField
                          name="bio"
                          size="small"
                          placeholder="Bio"
                          fullWidth
                          multiline
                          rows={3}
                          value={localStudent.bio}
                          onChange={handleDataChanged}
                          error={errors.bio !== null}
                          helperText={errors.bio}
                        />
                      </Grid>
                      <Grid item xs={12} display="flex" justifyContent="right">
                        <Button onClick={saveGeneral} variant="outlined">
                          Save Changes
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={12}>
                <Grid container spacing={2}>
                  {/* Registration Information */}
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Registration Information" />
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <InputLabel>Registration No *</InputLabel>
                            <TextField
                              name="regNo"
                              size="small"
                              placeholder="Registration No"
                              fullWidth
                              value={localStudent.regNo}
                              onChange={handleDataChanged}
                              error={errors.regNo !== null}
                              helperText={errors.regNo}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel>Index No *</InputLabel>
                            <TextField
                              name="indexNo"
                              size="small"
                              placeholder="Index No"
                              fullWidth
                              value={localStudent.indexNo}
                              onChange={handleDataChanged}
                              error={errors.indexNo !== null}
                              helperText={errors.indexNo}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel>Faculty *</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                name="faculty"
                                size="small"
                                placeholder="Faculty"
                                value={
                                  faculties.length === 0
                                    ? ""
                                    : localStudent.faculty
                                }
                                onChange={handleDataChanged}
                                error={errors.faculty !== null}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {faculties.map((faculty) => (
                                  <MenuItem
                                    key={faculty._id}
                                    value={faculty._id}
                                  >
                                    {faculty.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText error>
                                {errors.faculty}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            display="flex"
                            justifyContent="right"
                          >
                            <Button onClick={saveReg} variant="outlined">
                              Save Changes
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Health Information */}
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Health Information" />
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <InputLabel>Height *</InputLabel>
                            <FormControl fullWidth>
                              <OutlinedInput
                                name="height"
                                size="small"
                                placeholder="Height"
                                endAdornment={
                                  <InputAdornment position="end">
                                    cm
                                  </InputAdornment>
                                }
                                value={localStudent.height}
                                onChange={handleDataChanged}
                                error={errors.height !== null}
                              />
                              <FormHelperText error>
                                {errors.height}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel>Weight *</InputLabel>
                            <FormControl fullWidth>
                              <OutlinedInput
                                name="weight"
                                size="small"
                                placeholder="Weight"
                                endAdornment={
                                  <InputAdornment position="end">
                                    kg
                                  </InputAdornment>
                                }
                                value={localStudent.weight}
                                onChange={handleDataChanged}
                                error={errors.weight !== null}
                              />
                              <FormHelperText error>
                                {errors.weight}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel>Blood Group *</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                name="bloodGroup"
                                size="small"
                                placeholder="Blood Group"
                                value={localStudent.bloodGroup}
                                onChange={handleDataChanged}
                                error={errors.bloodGroup !== null}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value="a+">A+</MenuItem>
                                <MenuItem value="a-">A-</MenuItem>
                                <MenuItem value="b+">B+</MenuItem>
                                <MenuItem value="b-">B-</MenuItem>
                                <MenuItem value="o+">O+</MenuItem>
                                <MenuItem value="o-">O-</MenuItem>
                                <MenuItem value="ab+">AB+</MenuItem>
                                <MenuItem value="ab-">AB-</MenuItem>
                              </Select>
                              <FormHelperText error>
                                {errors.bloodGroup}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <InputLabel>Long Term Diseases</InputLabel>
                            <TextField
                              name="diseases"
                              size="small"
                              placeholder="Long Term Diseases"
                              rows={4}
                              multiline
                              fullWidth
                              value={localStudent.diseases}
                              onChange={handleDataChanged}
                              error={errors.diseases !== null}
                              helperText={errors.diseases}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            display="flex"
                            justifyContent="right"
                          >
                            <Button onClick={saveHealth} variant="outlined">
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
                  size="small"
                  placeholder="Current Password"
                  type="password"
                  fullWidth
                  value={password.currentPassword}
                  onChange={handlePasswordChanged}
                  helperText={passwordErrors.currentPassword}
                  error={passwordErrors.currentPassword !== null}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>New Password *</InputLabel>
                <TextField
                  name="newPassword"
                  size="small"
                  placeholder="New Password"
                  type="password"
                  fullWidth
                  value={password.newPassword}
                  onChange={handlePasswordChanged}
                  helperText={passwordErrors.newPassword}
                  error={passwordErrors.newPassword !== null}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Confirm Password *</InputLabel>
                <TextField
                  name="confirmPassword"
                  size="small"
                  placeholder="Confirm Password"
                  type="password"
                  fullWidth
                  value={password.confirmPassword}
                  onChange={handlePasswordChanged}
                  helperText={passwordErrors.confirmPassword}
                  error={passwordErrors.confirmPassword !== null}
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="right">
                <Button onClick={changePassword} variant="outlined">
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
}
