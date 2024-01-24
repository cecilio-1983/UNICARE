import { Card, CardContent, Typography } from "@mui/material";
import Card2 from "../assets/images/Card2.svg";

export default function HealthDetailCard({ icon, title, value }) {
  return (
    <Card
      sx={{
        boxShadow: "none",
        background: `url(${Card2})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {icon}
        <Typography
          color="white"
          variant="caption"
          mt={1}
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>
        <Typography
          color="white"
          variant="body1"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
            textTransform: "capitalize",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
