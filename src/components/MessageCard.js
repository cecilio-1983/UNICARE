import { Avatar, Box, Button, Card, Typography } from "@mui/material";
import dayjs from "dayjs";

export default function MessageCard({
  data,
  mt = true,
  onClick = (student) => {},
}) {
  return (
    <Box display="block" pl={1} pr={1} pb={1}>
      <Button
        onClick={() =>
          onClick({
            _id: data._id,
            image: data.image,
            name: `${data.firstName} ${data.lastName}`,
            lastSeen: data.lastSeen,
          })
        }
        sx={{
          padding: 0,
          textTransform: "none",
        }}
        fullWidth
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            rowGap: "10px",
            width: "100%",
            boxShadow: "none",
            backgroundColor: "rgba(0, 0, 0, 0.03)",
            padding: 2,
          }}
        >
          <Box display="flex" columnGap={1} width="100%">
            <Avatar src={data.image} />
            <Box display="flex" flexDirection="column" width="100%">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
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
                <Typography fontSize="10px" color="text.disabled">
                  {data.lastMsg.createdAt
                    ? dayjs(data.lastMsg.createdAt).format("hh:mm A")
                    : "-"}
                </Typography>
              </Box>
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
                {data.lastMsg.text ?? "-"}
              </Typography>
            </Box>
          </Box>
          {data.unreadMsgCount > 0 && (
            <Box justifyContent="end">
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
          )}
        </Card>
      </Button>
    </Box>
  );
}
