import { useCallback, useEffect, useState } from "react";

import {
  Divider,
  Card,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import MessageCard from "../../components/MessageCard";
import "../../assets/css/Main.css";
import "../../assets/css/MessageBubble.css";

import Placeholder from "../../assets/images/Placeholder.png";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import MessageBubble from "../../components/MessageBubble";

import { useDoctor } from "./DoctorContext";
import { fetch, post } from "../../network/Request";
import { dateDiff } from "../../common/Common";
import update from "immutability-helper";

export default function Emergency() {
  const { doctor, showAlert, noAuth } = useDoctor();
  var messageEnd = null;

  const [msgOverviews, setMsgOverviews] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({
    _id: null,
    image: Placeholder,
    name: "Student not selected",
    lastSeen: null,
  });
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleMessageChange = (event) => setMessage(event.target.value);

  const sendMessage = () => {
    if (!message) {
      showAlert("warning", "Please enter a message to send.");
      return;
    }

    if (!selectedStudent._id) {
      showAlert("warning", "Please select a student before send a message.");
      return;
    }

    const data = { studentId: selectedStudent._id, text: message };

    post(
      "tabs/doctors/emergency/send-message",
      data,
      (response) => {
        setMessages((prevMsgs) => [
          ...prevMsgs,
          {
            text: message,
            from: "medical-centre",
            to: "student",
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

  const loadMessages = useCallback(
    (studentId) => {
      fetch(
        "tabs/doctors/emergency/messages",
        { studentId: studentId },
        (response) => {
          setMessages(response.messages);
          const index = msgOverviews.findIndex((mo) => mo._id === studentId);
          const updatedOverview = update(msgOverviews[index], {
            unreadMsgCount: { $set: 0 },
          });
          const newOverviews = update(msgOverviews, {
            $splice: [[index, 1, updatedOverview]],
          });
          setMsgOverviews(newOverviews);
        },
        (error) => {
          if (error.status === "no-auth") noAuth();
          else showAlert(error.status, error.message);
        }
      );
    },
    [msgOverviews, noAuth, showAlert]
  );

  const search = (keyWord) => {
    fetch(
      "tabs/doctors/emergency/search",
      { keyWord: keyWord },
      (response) => {
        setMsgOverviews(response.overviews);
      },
      (error) => {
        if (error.status === "no-auth") noAuth();
        else showAlert(error.status, error.message);
      }
    );
  };

  const msgOverviewClicked = (student) => {
    setMessages([]);
    setSelectedStudent(student);
    loadMessages(student._id);
  };

  const handleOnSearchChange = (e) => {
    search(e.target.value);
  };

  useEffect(() => {
    if (messageEnd !== null) {
      messageEnd.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messageEnd]);

  useEffect(() => {
    fetch(
      "tabs/doctors/emergency",
      {},
      (response) => {
        setMsgOverviews(response.overviews);
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

      if (data.task === "emergency" && selectedStudent._id === data._id) {
        // when do like this doctor msg seen not update
        // setMessages((prevMsgs) => [
        //   ...prevMsgs,
        //   {
        //     text: data.text,
        //     from: data.fr,
        //     to: data.to,
        //     time: data.createdAt,
        //   },
        // ]);
        loadMessages(data._id);
      } else {
        const index = msgOverviews.findIndex((mo) => mo._id === data._id);
        const updatedOverview = update(msgOverviews[index], {
          lastMsg: {
            text: { $set: data.text },
            createdAt: { $set: data.createdAt },
          },
          unreadMsgCount: { $set: msgOverviews[index].unreadMsgCount + 1 },
        });
        const newOverviews = update(msgOverviews, {
          $splice: [[index, 1, updatedOverview]],
        });
        setMsgOverviews(newOverviews);
      }
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [selectedStudent._id, msgOverviews, loadMessages]);

  console.log(doctor);

  return (
    <Box display="flex" flexDirection="column" rowGap={2}>
      <Card
        className="emergency-student-list"
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          boxShadow: "none",
          position: "absolute",
          top: "88px",
          left: "24px",
          bottom: "24px",
          width: "300px",
        }}
      >
        <Box display="flex" flexDirection="column">
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
            onChange={handleOnSearchChange}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
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
            {msgOverviews.map((value, index) => {
              if (index === msgOverviews.length - 1) {
                return (
                  <MessageCard
                    key={index}
                    data={value}
                    onClick={msgOverviewClicked}
                  />
                );
              } else {
                return (
                  <span key={index}>
                    <MessageCard data={value} onClick={msgOverviewClicked} />
                    <Divider />
                  </span>
                );
              }
            })}
          </Box>
        </Box>
      </Card>

      <Card
        className="emergency-content"
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          boxShadow: "none",
          position: "absolute",
          top: "88px",
          left: "340px",
          bottom: "24px",
          right: "24px",
        }}
      >
        <Box display="flex" alignItems="center" padding={1}>
          <Avatar src={selectedStudent.image} />
          <Box display="flex" flexDirection="column" ml={1}>
            <Typography variant="subtitle2">{selectedStudent.name}</Typography>
            <Typography fontSize="10px" color="text.disabled">
              {`Last seen ${dateDiff(selectedStudent.lastSeen)}`}
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
          {messages.map((value, index) => {
            if (index < messages.length - 1) {
              return (
                <MessageBubble
                  key={index}
                  message={value}
                  user="medical-centre"
                  image={
                    value.from === "student"
                      ? selectedStudent.image
                      : doctor.image
                  }
                  last={value.from !== messages[index + 1].from}
                />
              );
            } else {
              return (
                <MessageBubble
                  key={index}
                  message={value}
                  user="medical-centre"
                  image={
                    value.from === "student"
                      ? selectedStudent.image
                      : doctor.image
                  }
                  last
                />
              );
            }
          })}
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
