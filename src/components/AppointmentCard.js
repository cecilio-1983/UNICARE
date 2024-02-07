import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
dayjs.extend(isToday);

export default function AppointmentCard({
  data,
  shadow = true,
  sx,
  onClickCheck = (appointmentId) => {},
}) {
  const isToday = dayjs(data.startTime).isToday();

  return (
    <Card
      variant={shadow ? "elevation" : "outlined"}
      style={{
        ...(!shadow && {
          boxShadow: "none",
        }),
      }}
      sx={{ ...sx }}
    >
      <CardContent>
        <Typography variant="subtitle2">
          {`${
            isToday
              ? "Today"
              : dayjs(data.startTime).format("YYYY-MM-DD hh:mm A")
          } - ${dayjs(data.endTime).format("hh:mm A")}`}
        </Typography>
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

        <Box display="flex" justifyContent="right" mt={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<NoteAltIcon />}
            onClick={() => onClickCheck(data._id)}
          >
            Check Patient
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
