import { Card, CardContent, Grid, useTheme } from "@mui/material";

import ReactApexCharts from "react-apexcharts";

export default function Analysis() {
  const theme = useTheme();

  const series = [44, 55, 41, 17, 15];

  const options = {
    chart: {
      width: 100,
      type: "donut",
      background: "transparent",
      border: "none",
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: "8px",
        textShadow: "none",
      },
    },
    legend: {
      markers: {
        width: 12,
        height: 12,
        radius: 6,
        offsetX: 0,
        offsetY: 0,
        strokeWidth: 0,
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
    responsive: [
      {
        breakpoint: 800,
        options: {
          chart: {},
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    labels: ["Corona", "Fever", "Cold", "Eye Inflection", "Vomit"],
  };

  return (
    <Grid container>
      <Grid item xs="12" sm="12" md="6">
        <Card>
          <CardContent>
            <ReactApexCharts
              height={300}
              options={options}
              series={series}
              type="donut"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
