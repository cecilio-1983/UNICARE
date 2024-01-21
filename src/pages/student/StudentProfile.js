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
import validate, { validations } from "../../validation/Validator";
import { fetch, put } from "../../network/Request";

export default function StudentProfile() {
  const { student, setStudent, noAuth, showAlert, startProgress, endProgress } =
    useStudent();
  const [tabIndex, setTabIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
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
  const [disabledButtons, setDisabledButtons] = useState({
    general: true,
    reg: true,
    health: true,
  });
  const [password, setPassword] = useState({
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
  });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleDataChanged = (e) => {
    const id = e.target.id;
    const val = e.target.value;

    setLocalStudent((prevStudent) => ({ ...prevStudent, [id]: val }));

    if (validations.hasOwnProperty(id)) {
      const res = validate(validations[id], val);

      if (res.valid) {
        setErrors((prevErrors) => ({ ...prevErrors, [id]: null }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [id]: res.msg }));
      }
    }

    if (
      [
        "firstName",
        "lastName",
        "gender",
        "birthday",
        "phone",
        "email",
        "address",
        "bio",
      ].includes(id)
    ) {
      setDisabledButtons((prevBtns) => ({ ...prevBtns, general: false }));
    } else if (["regNo", "indexNo", "faculty"].includes(id)) {
      setDisabledButtons((prevBtns) => ({ ...prevBtns, reg: false }));
    } else {
      setDisabledButtons((prevBtns) => ({ ...prevBtns, health: false }));
    }
  };

  const saveGeneral = () => {
    let valid = true;
    [
      "firstName",
      "lastName",
      "gender",
      "birthday",
      "phone",
      "email",
      "address",
      "bio",
    ].forEach((value) => {
      const res = validate(validations[value], localStudent[value]);
      if (res.valid) {
        setErrors((prevErrors) => ({ ...prevErrors, [value]: null }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [value]: [res.msg] }));
        valid = false;
      }
    });

    if (valid) {
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
    let valid = true;
    ["regNo", "indexNo", "faculty"].forEach((value) => {
      const res = validate(validations[value], localStudent[value]);
      if (res.valid) {
        setErrors((prevErrors) => ({ ...prevErrors, [value]: null }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [value]: [res.msg] }));
        valid = false;
      }
    });

    if (valid) {
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
    let valid = true;
    ["height", "weight", "bloodGroup", "diseases"].forEach((value) => {
      const res = validate(validations[value], localStudent[value]);
      if (res.valid) {
        setErrors((prevErrors) => ({ ...prevErrors, [value]: null }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [value]: [res.msg] }));
        valid = false;
      }
    });

    if (valid) {
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
    const id = e.target.id;
    const val = e.target.value;

    setPassword((prevPassword) => ({ ...prevPassword, [id]: val }));

    const res = validate(validations.password, val);

    if (res.valid) {
      setPasswordErrors((prevErrors) => ({ ...prevErrors, [id]: null }));
    } else {
      setPasswordErrors((prevErrors) => ({ ...prevErrors, [id]: res.msg }));
    }
  };

  const changePassword = () => {
    let valid = true;
    ["currentPassword", "newPassword", "confirmPassword"].forEach((value) => {
      const res = validate(validations.password, password[value]);
      if (res.valid) {
        setPasswordErrors((prevErrors) => ({ ...prevErrors, [value]: null }));
      } else {
        setPasswordErrors((prevErrors) => ({
          ...prevErrors,
          [value]: res.msg,
        }));
        valid = false;
      }
    });

    if (valid) {
      if (password.newPassword !== password.confirmPassword) {
        setPasswordErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Confirm password and password must same",
        }));
      } else {
        startProgress();

        put(
          "students/change-password",
          password,
          (response) => {
            endProgress();
            showAlert(response.status, response.message);
          },
          (error) => {
            endProgress();
            if (error.status === "no-auth") noAuth();
            else showAlert(error.status, error.message);
          }
        );
      }
    }
  };

  // #region select and crop image

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
      (uploadedSize, totalSize, percentage) => setUploadProgress(percentage),
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
      }
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
                          id="firstName"
                          value={localStudent.firstName}
                          size="small"
                          placeholder="First Name"
                          fullWidth
                          onChange={handleDataChanged}
                          helperText={errors.firstName}
                          error={errors.firstName !== null}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <InputLabel>Last Name *</InputLabel>
                        <TextField
                          id="lastName"
                          value={localStudent.lastName}
                          size="small"
                          placeholder="Last Name"
                          fullWidth
                          onChange={handleDataChanged}
                          helperText={errors.lastName}
                          error={errors.lastName !== null}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <InputLabel>Gender *</InputLabel>
                        <FormControl sx={{ width: "100%" }}>
                          <Select
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={localStudent.gender}
                            onChange={(e) => {
                              e.target = { ...e.target, id: "gender" };
                              handleDataChanged(e);
                            }}
                            error={errors.gender !== null}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                          </Select>
                          <FormHelperText
                            sx={{
                              display:
                                errors.gender === null ? "none" : "block",
                              color: "error.main",
                            }}
                          >
                            {errors.gender}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <InputLabel>Birthday *</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="DD/MM/YYYY"
                            slotProps={{
                              textField: {
                                size: "small",
                                placeholder: "Birthday",
                                error: errors.birthday !== null,
                              },
                            }}
                            sx={{
                              width: "100%",
                            }}
                            value={dayjs(localStudent.birthday)}
                            onChange={(value) => {
                              handleDataChanged({
                                target: { id: "birthday", value: value },
                              });
                            }}
                          />
                        </LocalizationProvider>
                        <FormHelperText
                          sx={{
                            display:
                              errors.birthday === null ? "none" : "block",
                            color: "error.main",
                            margin: "4px 14px 0px 14px !important",
                          }}
                        >
                          {errors.birthday}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <InputLabel>Phone Number *</InputLabel>
                        <TextField
                          id="phone"
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
                          id="email"
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
                          id="address"
                          size="small"
                          placeholder="Address"
                          multiline
                          rows={3}
                          fullWidth
                          value={localStudent.address}
                          onChange={handleDataChanged}
                          error={errors.address !== null}
                          helperText={errors.address}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputLabel>Bio *</InputLabel>
                        <TextField
                          id="bio"
                          size="small"
                          placeholder="Bio"
                          rows={3}
                          fullWidth
                          multiline
                          value={localStudent.bio}
                          onChange={handleDataChanged}
                          error={errors.bio !== null}
                          helperText={errors.bio}
                        />
                      </Grid>
                      <Grid item xs={12} display="flex" justifyContent="right">
                        <Button
                          onClick={saveGeneral}
                          variant="outlined"
                          disabled={disabledButtons.general}
                        >
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
                              id="regNo"
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
                              id="indexNo"
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
                            <Select
                              size="small"
                              placeholder="Faculty"
                              fullWidth
                              value={
                                faculties.length === 0
                                  ? ""
                                  : localStudent.faculty
                              }
                              onChange={(e) => {
                                e.target = { ...e.target, id: "faculty" };
                                handleDataChanged(e);
                              }}
                              error={errors.faculty !== null}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {faculties.map((faculty) => (
                                <MenuItem key={faculty._id} value={faculty._id}>
                                  {faculty.name}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText
                              sx={{
                                display:
                                  errors.faculty === null ? "none" : "block",
                                color: "error.main",
                              }}
                            >
                              {errors.faculty}
                            </FormHelperText>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            display="flex"
                            justifyContent="right"
                          >
                            <Button
                              onClick={saveReg}
                              variant="outlined"
                              disabled={disabledButtons.reg}
                            >
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
                            <OutlinedInput
                              id="height"
                              size="small"
                              placeholder="Height"
                              endAdornment={
                                <InputAdornment position="end">
                                  cm
                                </InputAdornment>
                              }
                              fullWidth
                              value={localStudent.height}
                              onChange={handleDataChanged}
                              error={errors.height !== null}
                            />
                            <FormHelperText
                              sx={{
                                display:
                                  errors.height === null ? "none" : "block",
                                color: "error.main",
                              }}
                            >
                              {errors.height}
                            </FormHelperText>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel>Weight *</InputLabel>
                            <OutlinedInput
                              id="weight"
                              size="small"
                              placeholder="Weight"
                              endAdornment={
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              }
                              fullWidth
                              value={localStudent.weight}
                              onChange={handleDataChanged}
                              error={errors.weight !== null}
                            />
                            <FormHelperText
                              sx={{
                                display:
                                  errors.weight === null ? "none" : "block",
                                color: "error.main",
                              }}
                            >
                              {errors.weight}
                            </FormHelperText>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <InputLabel>Blood Group *</InputLabel>
                            <Select
                              size="small"
                              placeholder="Blood Group"
                              fullWidth
                              value={localStudent.bloodGroup}
                              onChange={(e) => {
                                e.target = { ...e.target, id: "bloodGroup" };
                                handleDataChanged(e);
                              }}
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
                            <FormHelperText
                              sx={{
                                display:
                                  errors.bloodGroup === null ? "none" : "block",
                                color: "error.main",
                              }}
                            >
                              {errors.bloodGroup}
                            </FormHelperText>
                          </Grid>
                          <Grid item xs={12}>
                            <InputLabel>
                              Long Term Diseases (Optional)
                            </InputLabel>
                            <TextField
                              id="diseases"
                              size="small"
                              placeholder="Long Term Diseases"
                              multiline
                              rows={4}
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
                            <Button
                              onClick={saveHealth}
                              variant="outlined"
                              disabled={disabledButtons.health}
                            >
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
                  id="currentPassword"
                  size="small"
                  placeholder="Current Password"
                  type="password"
                  fullWidth
                  onChange={handlePasswordChanged}
                  helperText={passwordErrors.currentPassword}
                  error={passwordErrors.currentPassword !== null}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>New Password *</InputLabel>
                <TextField
                  id="newPassword"
                  size="small"
                  placeholder="New Password"
                  type="password"
                  fullWidth
                  onChange={handlePasswordChanged}
                  helperText={passwordErrors.newPassword}
                  error={passwordErrors.newPassword !== null}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Confirm Password *</InputLabel>
                <TextField
                  id="confirmPassword"
                  size="small"
                  placeholder="Confirm Password"
                  type="password"
                  fullWidth
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
