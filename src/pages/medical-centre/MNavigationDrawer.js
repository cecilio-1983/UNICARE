import {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Backdrop,
  CircularProgress,
  Drawer,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Tooltip,
  Popover,
  Button,
  Snackbar,
  styled,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import SegmentIcon from "@mui/icons-material/Segment";
import BarChartIcon from "@mui/icons-material/BarChart";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";

import Home from "./Home";
import Appointments from "./Appointments";
import DoctorProfile from "./DoctorProfile";
import CheckPatient from "./CheckPatient";

import NotificationCard from "../../components/NotificationCard";
import Settings from "./Settings";
import Emergency from "./Emergency";
import Analysis from "./Analysis";

import Logo from "../../assets/images/Logo.png";

import { DoctorProvider } from "./DoctorContext";
import { fetch } from "../../network/Request";

import "@fontsource/cabin/600.css";

const drawerWidth = 240;
const menu = [
  "Home",
  "Appointments",
  "Check Patient",
  "Emergency",
  "Analysis",
  "Settings",
  "Profile",
];

// #region styled components

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => {
    if (prop === "open" || prop === "overlay") return false;
    return true;
  },
})(({ theme, open, overlay }) => ({
  display: "block",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open &&
    !overlay && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "20px 12px",
  justifyContent: "space-between",
}));

const Main = styled("main", {
  shouldForwardProp: (prop) => {
    if (prop === "open" || prop === "overlay") return false;
    return true;
  },
})(({ theme, open, overlay }) => ({
  flexGrow: 1,
  height: "100vh",
  overflowY: "auto",
  scrollbarWidth: "thin",
  position: "relative",
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
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open &&
    !overlay && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
}));

// #endregion

export default function MNavigationDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [drawerOverlay, setDrawerOverlay] = useState(window.innerWidth <= 600);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [content, setContent] = useState(<Home />);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [doctor, setDoctor] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthday: "",
    phone: "",
    email: "",
    address: "",
    bio: "",
    image: "",
    mcRegNo: "",
    specialize: "",
  });

  // #region snackbar

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarProps, setSnackbarProps] = useState({
    severity: "success",
    text: "",
  });

  const showAlert = useCallback((severity, text) => {
    setSnackbarProps({ severity: severity, text: text });
    setSnackbarOpen(true);
  }, []);

  const hideAlert = useCallback(() => setSnackbarOpen(false), []);

  // #endregion

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

  const closeDialog = useCallback(() => setDialogOpen(false), []);

  const openDialog = useCallback(
    (
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
    },
    [closeDialog]
  );

  // #endregion

  // #region backdrop

  const [backdropOpen, setBackdropOpen] = useState(false);

  const startProgress = useCallback(() => setBackdropOpen(true), []);

  const endProgress = useCallback(() => setBackdropOpen(false), []);

  // #endregion

  // #region handlers

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuSelection = (index) => {
    setSelectedMenu(index);
    switch (index) {
      case 0:
        setContent(<Home />);
        break;
      case 1:
        setContent(<Appointments />);
        break;
      case 2:
        setContent(<CheckPatient />);
        break;
      case 3:
        setContent(<Emergency />);
        break;
      case 4:
        setContent(<Analysis />);
        break;
      case 5:
        setContent(<Settings />);
        break;
      case 6:
        setContent(<DoctorProfile />);
        break;
      default:
        break;
    }
  };

  const handlePopoverOpen = (popover, event) => {
    switch (popover) {
      case 0:
        setAnchorElNotifications(event.currentTarget);
        break;
      case 1:
        setAnchorElProfile(event.currentTarget);
        break;
      default:
        break;
    }
  };

  const handlePopoverClose = (popover) => {
    switch (popover) {
      case 0:
        setAnchorElNotifications(null);
        break;
      case 1:
        setAnchorElProfile(null);
        break;
      default:
        break;
    }
  };

  // #endregion

  const noAuth = useCallback(
    () =>
      openDialog(
        "Access Restricted",
        "You are restricted to access this page without login, please login first.",
        "Login",
        () => navigate("/medical-centre/login"),
        "Cancel",
        () => navigate("/medical-centre/login")
      ),
    [openDialog, navigate]
  );

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/medical-centre/login");
  };

  useLayoutEffect(() => {
    function updateSize() {
      setDrawerOverlay(window.innerWidth <= 600);
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    fetch(
      "doctors/current",
      {},
      (response) => {
        setDoctor(response.doctor);
      },
      (error) => {
        if (error.status === "no-auth") {
          noAuth();
        } else {
          showAlert(error.status, error.message);
        }
      }
    );
  }, [noAuth, showAlert]);

  const openOtherTab = (index, content) => {
    setSelectedMenu(index);
    setContent(content);
  };

  return (
    <Fragment>
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

      <Backdrop
        sx={{
          color: (theme) => theme.palette.primary.main,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box display="flex">
        <AppBar position="fixed" open={open} overlay={drawerOverlay}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box style={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                {menu[selectedMenu]}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "30px",
              }}
            >
              <IconButton onClick={(event) => handlePopoverOpen(0, event)}>
                <Tooltip title="Notifications" placement="bottom">
                  <Badge badgeContent={4} color="secondary">
                    <NotificationsIcon sx={{ color: "white" }} />
                  </Badge>
                </Tooltip>
              </IconButton>
              <Popover
                open={anchorElNotifications !== null}
                anchorEl={anchorElNotifications}
                onClose={() => handlePopoverClose(0)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <List>
                  <ListItem disablePadding>
                    <NotificationCard />
                  </ListItem>
                  <Divider />
                  <ListItem disablePadding>
                    <NotificationCard />
                  </ListItem>
                </List>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml={1}
                  mb={1}
                  mr={1}
                >
                  <Button variant="text">View All</Button>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Typography sx={{ p: 2 }} display="none">
                  No new notifications
                </Typography>
              </Popover>

              <Avatar sx={{ ml: 1 }} src={doctor.image} />
              <IconButton
                onClick={(event) => handlePopoverOpen(1, event)}
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <ExpandMoreIcon sx={{ color: "white" }} />
              </IconButton>
              <Popover
                open={anchorElProfile !== null}
                anchorEl={anchorElProfile}
                onClose={() => handlePopoverClose(1)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <List>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        handlePopoverClose(1);
                        handleMenuSelection(6);
                      }}
                    >
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary="View Profile" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={logout}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Popover>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            position: "relative",
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <Box sx={{ display: "flex" }}>
              <img
                src={Logo}
                alt="Logo"
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography fontFamily="Cabin" letterSpacing="0.4rem">
                  UNICARE
                </Typography>
                <Typography
                  fontFamily="Cabin"
                  fontSize="10px"
                  letterSpacing="0.15rem"
                >
                  EUSL SRI LANKA
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>

          <Divider />

          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuSelection(0)}
                sx={{
                  ...(selectedMenu === 0 && {
                    backgroundColor: theme.selectedMenu,
                  }),
                }}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuSelection(1)}
                sx={{
                  ...(selectedMenu === 1 && {
                    backgroundColor: theme.selectedMenu,
                  }),
                }}
              >
                <ListItemIcon>
                  <SegmentIcon />
                </ListItemIcon>
                <ListItemText primary="Appointments" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuSelection(2)}
                sx={{
                  ...(selectedMenu === 2 && {
                    backgroundColor: theme.selectedMenu,
                  }),
                }}
              >
                <ListItemIcon>
                  <NoteAltIcon />
                </ListItemIcon>
                <ListItemText primary="Check Patient" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuSelection(3)}
                sx={{
                  ...(selectedMenu === 3 && {
                    backgroundColor: theme.selectedMenu,
                  }),
                }}
              >
                <ListItemIcon>
                  <MonitorHeartIcon />
                </ListItemIcon>
                <ListItemText primary="Emergency" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuSelection(4)}
                sx={{
                  ...(selectedMenu === 4 && {
                    backgroundColor: theme.selectedMenu,
                  }),
                }}
              >
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Analysis" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuSelection(5)}
                sx={{
                  ...(selectedMenu === 5 && {
                    backgroundColor: theme.selectedMenu,
                  }),
                }}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
          </List>

          <Typography
            fontSize="11px"
            color="text.disabled"
            position="absolute"
            bottom="10px"
            left="10px"
            right="10px"
          >
            Copyright © 19/20 Batch EUSL All Rights Reserved
          </Typography>
        </Drawer>

        <Main open={open} overlay={drawerOverlay}>
          <Box height="64px" />
          <DoctorProvider
            value={{
              doctor,
              setDoctor,
              showAlert,
              hideAlert,
              openDialog,
              closeDialog,
              noAuth,
              startProgress,
              endProgress,
              openOtherTab,
            }}
          >
            {content}
          </DoctorProvider>
        </Main>
      </Box>
    </Fragment>
  );
}
