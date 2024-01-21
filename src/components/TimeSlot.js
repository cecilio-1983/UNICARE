import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { minutesToTime } from "../common/Common";

export default function TimeSlot({ data, onClickDelete = (_id) => {} }) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      border="1px solid rgba(128, 128, 128, 0.2)"
      padding="5px"
      borderRadius="3px"
    >
      <Typography variant="caption">{`From ${minutesToTime(
        data.startTime
      )} to ${minutesToTime(data.endTime)}`}</Typography>
      <Box display="flex" columnGap="5px">
        <IconButton onClick={() => onClickDelete(data._id)}>
          <DeleteIcon fontSize="small" color="red" />
        </IconButton>
      </Box>
    </Box>
  );
}
