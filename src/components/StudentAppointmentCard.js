import { Card, CardHeader, CardContent, Typography, Box } from "@mui/material";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { timeRemaining } from "../common/Common";

dayjs.extend(isToday);

export default function StudentAppointmentCard({ data, shadow, mr, upcoming }) {
  const today = dayjs(data.date).isToday();

  return (
    <Card
      variant={shadow ? "elevation" : "outlined"}
      sx={{
        display: "inline-block",
        whiteSpace: "break-spaces",
        width: "400px",
        ...(!shadow && {
          boxShadow: "none",
        }),
        ...(mr && {
          marginRight: "10px",
        }),
      }}
    >
      <CardHeader title="Appointment" />
      <CardContent>
        <Typography variant="subtitle2">
          {`${
            today ? "Today" : dayjs(data.startTime).format("YYYY-MM-DD hh:mm A")
          } - ${dayjs(data.endTime).format("hh:mm A")}`}
        </Typography>
        {upcoming ? (
          <Typography variant="caption">
            Time remaining: {timeRemaining(data.startTime)}
          </Typography>
        ) : (
          <></>
        )}
        <Typography
          mt={2}
          fontSize="10px"
          color="text.disabled"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 2,
            textOverflow: "ellipsis",
          }}
        >
          {data.description}
        </Typography>
        <Box display="flex" justifyContent="end" mt={2}>
          <Typography fontSize="10px" color="text.disabled">
            Created at {dayjs(data.createdAt).format("YYYY-MM-DD hh:mm a")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
