import { useTheme } from "@mui/material";
import { Avatar } from "@mui/material";
import dayjs from "dayjs";

/*
 * @param {from} This can be 'me' or 'them'
 */

export default function MessageBubble({
  message,
  user = "student",
  image,
  last,
}) {
  const theme = useTheme();

  const bubbleStyle = {
    position: "relative",
    minWidth: "110px",
    backgroundColor:
      message.from === user
        ? theme.palette.primary.main
        : theme.palette.secondary.main,
    color: message.from === user ? "white" : "black",
    borderRadius: "1.15rem",
    lineHeight: 1.25,
    padding: "0.5rem 0.875rem 1rem 0.875rem",
    wordWrap: "break-word",
    fontSize: "0.7rem",
    margin: "0 5px",
  };

  const tailStyle = {
    display: last ? "block" : "none",
    position: "absolute",
    width: 0,
    height: "50%",
    bottom: 0,
    ...(message.from !== user && {
      left: 0,
      borderRight: `15px solid ${theme.palette.secondary.main}`,
      borderBottomRightRadius: "12px 10px",
    }),
    ...(message.from === user && {
      right: 0,
      borderLeft: `15px solid ${theme.palette.primary.main}`,
      borderBottomLeftRadius: "12px 10px",
    }),
  };

  const tailRemoverStyle = {
    display: last ? "block" : "none",
    position: "absolute",
    width: 0,
    height: "100%",
    bottom: "1px",
    ...(message.from !== user && {
      left: 0,
      borderRight: `5px solid ${theme.palette.background.default}`,
      borderBottomRightRadius: "5px",
    }),
    ...(message.from === user && {
      right: 0,
      borderLeft: `5px solid ${theme.palette.background.default}`,
      borderBottomLeftRadius: "5px",
    }),
  };

  return (
    <div
      className={`msg-from-${message.from === user ? "me" : "them"}`}
      style={{
        display: "flex",
        columnGap: "10px",
        alignItems: "end",
        ...(message.from === user && { flexDirection: "row-reverse" }),
      }}
    >
      <Avatar
        className="dp"
        src={image}
        style={{ width: "1.5rem", height: last ? "1.5rem" : 0 }}
      />
      <div
        style={{
          display: "flex",
          position: "relative",
          maxWidth: "60%",
          ...(message.from === user && { justifyContent: "end" }),
        }}
      >
        <p style={bubbleStyle}>
          {message.text}
          <br />
          <span
            style={{
              position: "absolute",
              bottom: "0.3rem",
              right: "0.875rem",
              fontSize: "0.4rem",
            }}
          >
            {dayjs(message.createdAt).format("DD/MM/YYYY hh:mm:ss A")}
          </span>
        </p>
        <div className="tail" style={tailStyle}></div>
        <div className="tail-remover" style={tailRemoverStyle}></div>
      </div>
    </div>
  );
}
