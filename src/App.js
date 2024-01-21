import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeContext";
import DoctorLogin from "./pages/medical-centre/DoctorLogin";
import StudentLogin from "./pages/student/StudentLogin";
import Signup from "./pages/student/Signup";
import MNavigationDrawer from "./pages/medical-centre/MNavigationDrawer";
import SNavigationDrawer from "./pages/student/SNavigationDrawer";
import { firebaseConfig } from "./config/Config";
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { put } from "./network/Request";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const channel = new BroadcastChannel("fcm-channel");

onMessage(messaging, (payload) => {
  console.log("Received foreground message:", payload);
  channel.postMessage(payload);
});

Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    console.log("Notification permission granted");
    getToken(messaging, {
      vapidKey:
        "BEV_Sn-yFFKkUU_NkSblUWiwBQv_Ijs63WiP-e02wGorGf-OOKQuKxXwPRdC7mwIF24pV36LAQyqeRKkZ38XYl4",
    })
      .then((token) => {
        if (token) {
          console.log("Fcm token:", token);
          put(
            `/${
              localStorage.getItem("loggedInAs") === "student"
                ? "students"
                : "doctors"
            }/update-token`,
            { token: token }
          );
        } else {
          console.log("Fcm token error");
        }
      })
      .catch((error) => {
        console.log("Fcm token error:", error.message);
      });
  }
});

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes path={"/"}>
          <Route path="/medical-centre/login" element={<DoctorLogin />} />
          <Route path="/medical-centre/home" element={<MNavigationDrawer />} />
          <Route path="/students/signup" element={<Signup />} />
          <Route path="/students/login" element={<StudentLogin />} />
          <Route path="/students/home" element={<SNavigationDrawer />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
