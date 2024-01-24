import { useEffect, useState } from "react";
import {
  Divider,
  Card,
  TextField,
  IconButton,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import "../../assets/css/Main.css";
import "../../assets/css/MessageBubble.css";

import SendIcon from "@mui/icons-material/Send";
import MessageBubble from "../../components/MessageBubble";
import NoMessages from "../../assets/images/NoMessages.svg";
import { useStudent } from "./StudentContext";
import { post, fetch } from "../../network/Request";
import { dateDiff } from "../../common/Common";

export default function Emergency() {
  const { student, showAlert, noAuth } = useStudent();
  var messageEnd = null;

  const [doctor, setDoctor] = useState({
    firstName: "",
    lastName: "",
    image: "",
    lastSeen: "",
  });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleMessageChange = (event) => setMessage(event.target.value);

  const sendMessage = () => {
    if (!message) {
      showAlert("warning", "Please enter a message to send.");
      return;
    }

    const data = { text: message };

    post(
      "tabs/students/emergency/send-message",
      data,
      (response) => {
        setMessages((prevMsgs) => [
          ...prevMsgs,
          {
            text: message,
            from: "student",
            to: "medical-centre",
            createdAt: new Date(),
          },
        ]);
        setMessage("");
        showAlert(response.status, response.message);
      },
      (error) => {
        if (error.status === "no-auth") noAuth();
        else showAlert(error.status, error.message);
      }
    );
  };

  useEffect(() => {
    if (messageEnd !== null) {
      messageEnd.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messageEnd]);

  useEffect(() => {
    fetch(
      "tabs/students/emergency",
      {},
      (response) => {
        setDoctor(response.doctor);
        setMessages(response.messages);
      },
      (error) => {
        if (error.status === "no-auth") noAuth();
        else showAlert(error.status, error.message);
      }
    );
  }, [noAuth, showAlert]);

  useEffect(() => {
    const channel = new BroadcastChannel("fcm-channel");

    const handleMessage = (event) => {
      console.log("Received message from service worker:", event.data);
      const data = event.data.data;
      if (data.task === "emergency" && data.fr === "medical-centre") {
        setMessages((prevMsgs) => [
          ...prevMsgs,
          { text: data.text, from: data.fr, to: data.to, time: data.createdAt },
        ]);
      }
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" rowGap={2}>
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          boxShadow: "none",
          position: "absolute",
          top: "88px",
          left: "24px",
          bottom: "24px",
          right: "24px",
        }}
      >
        <Box display="flex" alignItems="center" padding={1}>
          <Avatar src={doctor.image} />
          <Box display="flex" flexDirection="column" ml={1}>
            <Typography variant="subtitle2">
              Dr. {doctor.firstName} {doctor.lastName}
            </Typography>
            <Typography fontSize="10px" color="text.disabled">
              Last seen {dateDiff(doctor.lastSeen)}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box
          className="imessage"
          width="100%"
          height="100%"
          padding="0 16px"
          sx={{
            ...(messages.length === 0 && {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }),
            overflowY: "auto",
            overflowX: "hidden",
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
          {messages.map((msg, index) => {
            if (index < messages.length - 1) {
              if (msg.from === messages[index + 1].from) {
                return (
                  <MessageBubble
                    key={`message${index}`}
                    message={msg}
                    user="student"
                    image={student.image}
                  />
                );
              } else {
                return (
                  <MessageBubble
                    key={`message${index}`}
                    message={msg}
                    user="student"
                    image={student.image}
                    last
                  />
                );
              }
            } else {
              return (
                <MessageBubble
                  key={`message${index}`}
                  message={msg}
                  user="student"
                  image={student.image}
                  last
                />
              );
            }
          })}
          {messages.length === 0 ? (
            <img src={NoMessages} width="30%" alt="No Messages" />
          ) : (
            <></>
          )}
          <Box
            sx={{ float: "left", clear: "both" }}
            ref={(el) => {
              messageEnd = el;
            }}
          />
        </Box>
        <Divider />
        <Box
          display="flex"
          columnGap={1}
          padding={2}
          alignItems="end"
          width="100%"
        >
          <TextField
            value={message}
            placeholder="Type a message..."
            size="small"
            fullWidth
            multiline
            onChange={handleMessageChange}
            maxRows={4}
          />
          <IconButton onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
}
