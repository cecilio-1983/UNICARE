import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Backdrop,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Box,
  Grid,
  FormHelperText,
  FormControl,
  TextField,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  IconButton,
  Select,
  MenuItem,
  Button,
  Stepper,
  Typography,
  Step,
  StepLabel,
  Snackbar,
  useMediaQuery,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ImageCropDialog from "../../dialogs/ImageCropDialog";
import validate, { validations } from "../../validation/Validator";
import { fetch, uploadFile } from "../../network/Request";
import { dataUrlToBlob } from "../../common/Common";

export default function Signup() {
  const navigate = useNavigate();

  const isMore600 = useMediaQuery("(min-width: 600px)");
  const steps = [
    { text: "General information", optional: false },
    { text: "Registration information", optional: false },
    { text: "Health information", optional: false },
  ];

  // #region dialog

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    title: "",
    message: "",
    positiveActionText: "",
    positiveAction: () => closeDialog(),
    negativeActionText: "",
    negativeAction: () => closeDialog(),
  });

  const openDialog = (
    title = "",
    message = "",
    positiveActionText = "",
    positiveAction = closeDialog,
    negativeActionText = "",
    negativeAction = closeDialog
  ) => {
    setDialogProps({
      title: title,
      message: message,
      positiveActionText: positiveActionText,
      positiveAction: positiveAction,
      negativeActionText: negativeActionText,
      negativeAction: negativeAction,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  // #endregion

  // #region backdrop

  const [backdropOpen, setBackdropOpen] = useState(true);

  const startProgress = () => setBackdropOpen(true);

  const endProgress = () => setBackdropOpen(false);

  // #endregion

  // #region snackbar

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarProps, setSnackbarProps] = useState({
    severity: "success",
    text: "",
  });

  const showAlert = (severity, text) => {
    setSnackbarProps({ severity: severity, text: text });
    setSnackbarOpen(true);
  };

  const hideAlert = () => setSnackbarOpen(false);

  // #endregion

  // #region select and crop image

  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [dp, setDp] = useState(null);
  const [croppedDp, setCroppedDp] = useState(null);
  const [dpError, setDpError] = useState(null);

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
    setCroppedDp(image);
    setDpError(null);
  };

  // #endregion

  const [activeStep, setActiveStep] = useState(0);
  const [faculties, setFaculties] = useState([]);
  const [data, setData] = useState({
    firstName: null,
    lastName: null,
    gender: "",
    birthday: null,
    phone: null,
    email: null,
    password: null,
    confirmPassword: null,
    address: null,
    bio: null,
    regNo: null,
    indexNo: null,
    faculty: "",
    height: null,
    weight: null,
    bloodGroup: "",
    diseases: null,
  });
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

  const handleDataChanged = (e) => {
    const { name, value } = e.target;

    setData({ ...data, [name]: value });

    if (validations.hasOwnProperty(name)) {
      const res = validate(validations[name], value);

      if (res.valid) {
        setErrors({ ...errors, [name]: null });
      } else {
        setErrors({ ...errors, [name]: res.msg });
      }
    }
  };

  const validateAll = (step) => {
    var ok = true;
    var x = 0;

    Object.entries(data).forEach(([key, value]) => {
      if (step === 0 && x <= 9) {
        const res = validate(validations[key], value);
        if (res.valid) {
          setErrors((prevErrors) => ({ ...prevErrors, [key]: null }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, [key]: [res.msg] }));
          ok = false;
        }
      } else if (step === 1 && x <= 12) {
        const res = validate(validations[key], value);
        if (res.valid) {
          setErrors((prevErrors) => ({ ...prevErrors, [key]: null }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, [key]: [res.msg] }));
          ok = false;
        }
      } else if (step === 2 && x <= 16) {
        const res = validate(validations[key], value);
        if (res.valid) {
          setErrors((prevErrors) => ({ ...prevErrors, [key]: null }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, [key]: [res.msg] }));
          ok = false;
        }
      }
      x += 1;
    });

    return ok;
  };

  const next = () => {
    if (croppedDp === null) {
      setDpError("Please select a picture");
      return;
    }

    const file = dataUrlToBlob(croppedDp);

    if (file.size > 3145728) {
      showAlert("error", "Profile picture cannot exceed 3MB.");
      return;
    }

    if (activeStep < steps.length - 1) {
      if (validateAll(activeStep)) {
        if (data.password === data.confirmPassword) {
          setActiveStep(activeStep + 1);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: "Confirm password and password must same",
          }));
        }
      }
    } else {
      if (validateAll(activeStep)) {
        startProgress();
        uploadFile(
          "students/signup",
          { key: "image", value: file },
          data,
          (uploadedSize, totalSize, percentage) => {},
          (response) => {
            endProgress();
            showAlert(response.status, response.message);
            openDialog(
              "Signup Success",
              response.message,
              "Login",
              () => navigate("/students/login"),
              "Cancel"
            );
          },
          (error) => {
            endProgress();
            showAlert(error.status, error.message);
          }
        );
      }
    }
  };

  const back = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        "faculties/all",
        {},
        (response) => {
          setFaculties(response.faculties);
          endProgress();
        },
        (error) => {
          endProgress();
          showAlert(error.status, error.message);
        }
      );
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />

      <ImageCropDialog
        open={cropDialogOpen}
        onClose={handleCropDialogClose}
        image={dp}
        onCropped={onCropped}
      />

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={hideAlert}>
        <Alert
          onClose={hideAlert}
          severity={snackbarProps.severity}
          sx={{ width: "100%" }}
        >
          {snackbarProps.text}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{
          color: (theme) => theme.palette.primary.main,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogProps.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogProps.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={dialogProps.negativeAction}>
            {dialogProps.negativeActionText}
          </Button>
          <Button onClick={dialogProps.positiveAction} autoFocus>
            {dialogProps.positiveActionText}
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        width="100%"
        height="100vh"
        sx={{
          padding: isMore600 ? "24px 20%" : "24px 24px",
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
        }}
      >
        <Box display="flex" flexDirection="column" width="100%">
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src="../../logo192.png"
              alt="Logo"
              style={{ width: "50px", height: "50px" }}
            />
            <Typography
              variant="h4"
              fontFamily="Cabin"
              letterSpacing="9px"
              fontWeight="600"
            >
              UNICARE
            </Typography>
            <Typography
              fontSize="12px"
              fontFamily="Cabin"
              letterSpacing="8px"
              fontWeight="400"
              color="text.disabled"
            >
              EUSL SRI LANKA
            </Typography>

            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
              SIGN UP
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ width: "100%" }}>
            {steps.map((step, index) => {
              const stepProps = {};
              const labelProps = {};

              if (step.optional) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }

              return (
                <Step key={step.text} {...stepProps}>
                  <StepLabel {...labelProps}>{step.text}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {/* Contents */}
          <Grid
            container
            spacing={2}
            mt={1}
            display={activeStep === 0 ? "flex" : "none"}
          >
            <Grid item xs={12} sm={12} md={12}>
              <Box position="relative" width="100px" mt={2}>
                <Avatar
                  src={croppedDp}
                  sx={{ width: "100px", height: "100px" }}
                />
                <IconButton
                  sx={{ position: "absolute", bottom: "-5px", right: "-5px" }}
                  onClick={browseDp}
                >
                  <CameraAltIcon />
                </IconButton>
              </Box>
              <FormHelperText
                sx={{
                  display: dpError === null ? "none" : "block",
                  color: "error.main",
                  margin: "4px 14px 0 14px",
                }}
              >
                {dpError}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>First Name *</InputLabel>
              <TextField
                name="firstName"
                size="small"
                placeholder="First Name"
                fullWidth
                onChange={handleDataChanged}
                error={errors.firstName !== null}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Last Name *</InputLabel>
              <TextField
                name="lastName"
                size="small"
                placeholder="Last Name"
                fullWidth
                onChange={handleDataChanged}
                error={errors.lastName !== null}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Gender *</InputLabel>
              <FormControl sx={{ width: "100%" }}>
                <Select
                  name="gender"
                  variant="outlined"
                  size="small"
                  fullWidth
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
                <FormHelperText
                  sx={{
                    display: errors.gender === null ? "none" : "block",
                    color: "error.main",
                  }}
                >
                  {errors.gender}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Birthday *</InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
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
                  format="YYYY-MM-DD"
                  value={data.birthday}
                  onChange={(value) =>
                    handleDataChanged({
                      target: { name: "birthday", value: value },
                    })
                  }
                />
              </LocalizationProvider>
              <FormHelperText
                sx={{
                  display: errors.birthday === null ? "none" : "block",
                  color: "error.main",
                  margin: "4px 14px 0px 14px !important",
                }}
              >
                {errors.birthday}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Phone Number *</InputLabel>
              <TextField
                name="phone"
                size="small"
                placeholder="Phone Number"
                fullWidth
                onChange={handleDataChanged}
                error={errors.phone !== null}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Email Address *</InputLabel>
              <TextField
                name="email"
                size="small"
                placeholder="Email Address"
                fullWidth
                onChange={handleDataChanged}
                error={errors.email !== null}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Password *</InputLabel>
              <TextField
                name="password"
                size="small"
                type="password"
                placeholder="Password"
                fullWidth
                onChange={handleDataChanged}
                error={errors.password !== null}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Confirm Password *</InputLabel>
              <TextField
                name="confirmPassword"
                size="small"
                type="password"
                placeholder="Confirm Password"
                fullWidth
                onChange={handleDataChanged}
                error={errors.confirmPassword !== null}
                helperText={errors.confirmPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Address *</InputLabel>
              <TextField
                name="address"
                size="small"
                placeholder="Address"
                multiline
                rows={3}
                fullWidth
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
                multiline
                rows={3}
                fullWidth
                onChange={handleDataChanged}
                error={errors.bio !== null}
                helperText={errors.bio}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            mt={1}
            display={activeStep === 1 ? "flex" : "none"}
          >
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Registration No *</InputLabel>
              <TextField
                name="regNo"
                size="small"
                placeholder="Registration No"
                fullWidth
                onChange={handleDataChanged}
                error={errors.regNo !== null}
                helperText={errors.regNo}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Index No *</InputLabel>
              <TextField
                name="indexNo"
                size="small"
                placeholder="Index No"
                fullWidth
                onChange={handleDataChanged}
                error={errors.indexNo !== null}
                helperText={errors.indexNo}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Faculty *</InputLabel>
              <Select
                name="faculty"
                size="small"
                placeholder="Faculty"
                fullWidth
                value={data.faculty}
                onChange={handleDataChanged}
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
                  display: errors.faculty === null ? "none" : "block",
                  color: "error.main",
                }}
              >
                {errors.faculty}
              </FormHelperText>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            mt={1}
            display={activeStep === 2 ? "flex" : "none"}
          >
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Height *</InputLabel>
              <OutlinedInput
                name="height"
                size="small"
                placeholder="Height"
                endAdornment={
                  <InputAdornment position="end">cm</InputAdornment>
                }
                fullWidth
                onChange={handleDataChanged}
                error={errors.height !== null}
              />
              <FormHelperText
                sx={{
                  display: errors.height === null ? "none" : "block",
                  color: "error.main",
                }}
              >
                {errors.height}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Weight *</InputLabel>
              <OutlinedInput
                name="weight"
                size="small"
                placeholder="Weight"
                endAdornment={
                  <InputAdornment position="end">kg</InputAdornment>
                }
                fullWidth
                onChange={handleDataChanged}
                error={errors.weight !== null}
              />
              <FormHelperText
                sx={{
                  display: errors.weight === null ? "none" : "block",
                  color: "error.main",
                }}
              >
                {errors.weight}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputLabel>Blood Group *</InputLabel>
              <Select
                name="bloodGroup"
                size="small"
                placeholder="Blood Group"
                fullWidth
                value={data.bloodGroup}
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
              <FormHelperText
                sx={{
                  display: errors.bloodGroup === null ? "none" : "block",
                  color: "error.main",
                }}
              >
                {errors.bloodGroup}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <InputLabel>Long Term Diseases (Optional)</InputLabel>
              <TextField
                id="diseases"
                size="small"
                placeholder="Long Term Diseases"
                multiline
                rows={4}
                fullWidth
                onChange={handleDataChanged}
                error={errors.diseases !== null}
                helperText={errors.diseases}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Box display="flex" justifyContent="right" columnGap={2} mt={2}>
            <Button
              variant="contained"
              onClick={back}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button variant="contained" onClick={next}>
              {activeStep === 2 ? "Signup" : "Next"}
            </Button>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
