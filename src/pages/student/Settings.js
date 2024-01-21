import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Switch,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useTheme } from "../../theme/ThemeContext";

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Theme</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption">Dark theme</Typography>
            <Switch checked={darkMode} onChange={toggleDarkMode} />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Notifications</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption">
                Appointment notification
              </Typography>
              <Switch />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption">Emergency notification</Typography>
              <Switch />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption">Maximum patient warning</Typography>
              <Box display="flex" columnGap={1} alignItems="center">
                <Typography variant="caption">More than</Typography>
                <TextField
                  placeholder="patients"
                  type="number"
                  size="small"
                  variant="outlined"
                />
                <Typography variant="caption">patients in a</Typography>
                <Select size="small" value="">
                  <MenuItem value="">time period</MenuItem>
                  <MenuItem value={0}>day</MenuItem>
                  <MenuItem value={1}>week</MenuItem>
                  <MenuItem value={2}>month</MenuItem>
                </Select>
                <Switch />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
}
