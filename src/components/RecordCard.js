import { Avatar, Box, Card, Divider, Typography } from "@mui/material";
import dayjs from "dayjs";

export default function RecordCard({ dp, data }) {
  return (
    <Card>
      <Box p={2} display="flex">
        <Avatar src={dp} />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          ml={1}
        >
          <Typography variant="subtitle2">Dr. {data.doctorName}</Typography>
          <Typography fontSize="12px" color="text.disabled">
            {data.doctorRegNo}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box display="grid" gridTemplateColumns="min-content auto" gap={1} p={2}>
        <Typography variant="caption" color="text.disabled" minWidth={0}>
          Disease
        </Typography>
        <Typography variant="caption">{data.disease}</Typography>

        <Typography variant="caption" color="text.disabled" minWidth={0}>
          Description
        </Typography>
        <Typography variant="caption">{data.description}</Typography>

        <Typography variant="caption" color="text.disabled" minWidth={0}>
          Created at
        </Typography>
        <Typography variant="caption">
          {dayjs(data.createdAt).format("YYYY-MM-DD hh:mm A")}
        </Typography>
      </Box>
    </Card>
  );
}
