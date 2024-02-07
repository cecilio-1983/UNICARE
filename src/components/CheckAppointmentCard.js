import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  Tooltip,
} from "@mui/material";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import VerifiedIcon from "@mui/icons-material/Verified";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(isToday);

export default function CheckAppointmentCard({
  data,
  checkNow = (appointment) => {},
}) {
  const isToday = dayjs(data.startTime).isToday();

  return (
    <Card
      variant="outlined"
      sx={{
        display: "inline-block",
        boxShadow: "none",
        width: "350px",
        minWidth: "350px",
        maxWidth: "350px",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2">
            {isToday && "Today "}
            {dayjs(data.startTime).format(
              isToday ? "hh:mm A - " : "YYYY-MM-DD hh:mm A - "
            )}
            {dayjs(data.endTime).format("hh:mm A")}
          </Typography>
          {data.checked && (
            <Tooltip title="Checked Appointment">
              <VerifiedIcon fontSize="small" sx={{ color: "primary.main" }} />
            </Tooltip>
          )}
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
        >
          <Box display="flex" alignItems="center">
            <Avatar alt="Ahinsa Lakshani" src={data.image} />
            <Box display="flex" flexDirection="column" ml={1} mr={1}>
              <Typography
                variant="subtitle1"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  WebkitLineClamp: 1,
                  textOverflow: "ellipsis",
                }}
              >
                {data.firstName} {data.lastName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  WebkitLineClamp: 1,
                  textOverflow: "ellipsis",
                }}
              >
                {data.faculty}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography
          fontSize="10px"
          mt={1}
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

        <Typography
          fontSize="10px"
          color="text.disabled"
          mt={1}
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 2,
            textOverflow: "ellipsis",
          }}
        >
          {data.checked
            ? `Checked at ${dayjs(data.checkedAt).format("YYYY-MM-DD hh:mm A")}`
            : `Created at ${dayjs(data.createdAt).format(
                "YYYY-MM-DD hh:mm A"
              )}`}
        </Typography>

        {!data.checked && (
          <Box display="flex" justifyContent="right" mt={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<NoteAltIcon />}
              onClick={() => checkNow(data)}
            >
              Check Now
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
