import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";

export default function MessageCard({ data, onClick = (student) => {} }) {
  return (
    <Card
      onClick={() =>
        onClick({
          _id: data._id,
          image: data.image,
          name: `${data.firstName} ${data.lastName}`,
          lastSeen: data.lastSeen,
        })
      }
      sx={{
        display: "block",
        width: "100%",
        borderRadius: 0,
        boxShadow: "none",
        cursor: "pointer",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          rowGap: "10px",
        }}
      >
        <Box display="flex" justifyContent="space-between" columnGap="10px">
          <Box display="flex" alignItems="center">
            <Avatar src={data.image} />
            <Box display="flex" flexDirection="column" ml={1}>
              <Typography
                variant="subtitle2"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {data.firstName} {data.lastName}
              </Typography>
              <Typography
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
                {data.lastMsg.text ?? "-"}
              </Typography>
            </Box>
          </Box>
          <Typography fontSize="10px" color="text.disabled">
            {data.lastMsg.createdAt
              ? dayjs(data.lastMsg.createdAt).format("hh:mm A")
              : "-"}
          </Typography>
        </Box>
        <Box
          display={data.unreadMsgCount > 0 ? "flex" : "none"}
          justifyContent="end"
        >
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "15px",
              height: "15px",
              fontFamily: "Roboto",
              fontSize: "8px",
              color: "white",
              borderRadius: "100%",
              backgroundColor: "rgba(15, 112, 42, 0.2)",
            }}
          >
            {data.unreadMsgCount}
          </span>
        </Box>
      </CardContent>
    </Card>
  );
}
