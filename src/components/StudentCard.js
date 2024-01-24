import {
  Button,
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
} from "@mui/material";

import NumbersIcon from "@mui/icons-material/Numbers";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function StudentCard({
  data,
  marginBottom,
  onClick = (studentId) => {},
}) {
  return (
    <Box
      sx={{
        display: "block",
        width: "100%",
        pl: 1,
        pr: 1,
        ...(marginBottom && { pb: 1 }),
      }}
    >
      <Button
        onClick={() => onClick(data._id)}
        sx={{ padding: 0, textTransform: "none" }}
        fullWidth
      >
        <Card
          elevation={1}
          sx={{
            boxShadow: "none",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.03)",
            borderRadius: 1,
          }}
        >
          <CardContent>
            <Box display="flex" columnGap={1}>
              <Avatar src={data.image} />
              <Box display="flex" flexDirection="column" alignItems="start">
                <Typography variant="subtitle2">
                  {data.firstName} {data.lastName}
                </Typography>
                <Typography
                  fontSize="10px"
                  color="text.disabled"
                  textAlign="start"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: 2,
                    textOverflow: "ellipsis",
                  }}
                >
                  {data.bio}
                </Typography>
                <Box display="flex" columnGap={1} mt={1}>
                  <NumbersIcon fontSize="small" />
                  <Typography variant="caption">{data.indexNo}</Typography>
                </Box>
                <Box display="flex" columnGap={1} mt={1}>
                  <HowToRegIcon fontSize="small" />
                  <Typography variant="caption">{data.regNo}</Typography>
                </Box>
                <Box display="flex" columnGap={1} mt={1}>
                  <BarChartIcon fontSize="small" />
                  <Typography variant="caption" textAlign="left">
                    {data.upcomingAppointments - data.onGoingAppointments}{" "}
                    upcoming appointments
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="caption"
                color="primary.main"
                sx={{
                  writingMode: "vertical-lr",
                  transform: "rotate(-180deg)",
                  display: data.onGoingAppointments > 0 ? "block" : "none",
                }}
              >
                ONGOING APPOINTMENT
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Button>
    </Box>
  );
}
