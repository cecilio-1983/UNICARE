import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Snackbar,
  Backdrop,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CssBaseline,
  useTheme,
} from "@mui/material";

import "@fontsource/cabin/400.css";
import "@fontsource/cabin/600.css";
import Logo from "../../assets/images/Logo.png";
import { post } from "../../network/Request";

export default function StudentLogin() {
  const theme = useTheme();
  const navigate = useNavigate();

  // #region backdrop

  const [backdropOpen, setBackdropOpen] = useState(false);

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

  const [openFP, setOpenFP] = useState(false);
  const [canLogin, setCanLogin] = useState(true);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const login = () => {
    setCanLogin(false);

    const data = {
      username: username,
      password: password,
    };

    startProgress();

    post(
      "students/login",
      data,
      (response) => {
        endProgress();
        localStorage.setItem("loggedInAs", "student");
        localStorage.setItem("token", response.token);
        showAlert(response.status, response.message);
        navigate("/students/home");
      },
      (error) => {
        endProgress();
        setCanLogin(true);
        showAlert(error.status, error.message);
      }
    );
  };

  const signup = () => navigate("/students/signup");

  const openForgotPassword = () => setOpenFP(true);

  const onCloseForgotPassword = () => setOpenFP(false);

  return (
    <React.Fragment>
      <CssBaseline />

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

      <Dialog open={openFP} onClose={onCloseForgotPassword}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you forgot the password please enter your email address below
            then click OK. You will recieve OTP with email.
          </DialogContentText>
          <TextField
            type="email"
            label="Email"
            size="small"
            fullWidth
            variant="standard"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseForgotPassword}>Cancel</Button>
          <Button onClick={onCloseForgotPassword}>OK</Button>
        </DialogActions>
      </Dialog>

      <Grid
        container
        color={theme.palette.background.paper}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Grid item>
          <Card sx={{ ml: 2, mr: 2 }}>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img src={Logo} alt="Logo" style={{ width: "50px" }} />
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
                  color={theme.palette.grey[400]}
                >
                  EUSL SRI LANKA
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  LOGIN
                </Typography>
              </div>
              <TextField
                onChange={(e) => setUsername(e.target.value)}
                label="Index number or email"
                type="email"
                size="small"
                fullWidth
                variant="outlined"
              />
              <TextField
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type="password"
                size="small"
                fullWidth
                sx={{ mt: 2 }}
              />
              <Typography
                onClick={openForgotPassword}
                fontSize="12px"
                color={theme.link}
                sx={{ textAlign: "end", mt: 2, cursor: "pointer" }}
              >
                Forgot password?
              </Typography>
              <Button
                disabled={!canLogin}
                onClick={login}
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                {canLogin ? "Sign in" : "Please wait..."}
              </Button>

              <Box display="flex" justifyContent="center" columnGap={1}>
                <Typography
                  onClick={openForgotPassword}
                  fontSize="12px"
                  sx={{ mt: 2 }}
                >
                  Don't have an account?
                </Typography>
                <Typography
                  onClick={signup}
                  fontSize="12px"
                  color={theme.link}
                  sx={{ mt: 2, cursor: "pointer" }}
                >
                  Sign up
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
