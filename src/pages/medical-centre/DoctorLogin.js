import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CssBaseline,
  Snackbar,
  Alert,
  Backdrop,
  useTheme,
} from "@mui/material";

import { post } from "../../network/Request";
import Logo from "../../assets/images/Logo.png";

import "@fontsource/cabin/400.css";
import "@fontsource/cabin/600.css";

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [openFP, setOpenFP] = useState(false);
  const [canLogin, setCanLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  const login = () => {
    setCanLogin(false);

    const data = {
      username: username,
      password: password,
    };

    startProgress();

    post(
      "doctors/login",
      data,
      (response) => {
        endProgress();
        localStorage.setItem("loggedInAs", "doctor");
        localStorage.setItem("token", response.token);
        showAlert(response.status, response.message);
        navigate("/medical-centre/home");
      },
      (error) => {
        endProgress();
        setCanLogin(true);
        showAlert(error.status, error.message);
      }
    );
  };

  const openForgotPassword = () => {
    setOpenFP(true);
  };

  const onCloseForgotPassword = () => {
    setOpenFP(false);
  };

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

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Email address"
              type="email"
              size="small"
              fullWidth
              variant="outlined"
            />
            <TextField
              value={password}
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
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
}
