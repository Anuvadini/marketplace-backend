const userList = {};

const socketHandler = (socket) => {
  const GLOBAL_ROOM = "LokSabha";

  socket.on("joinRoom", (userId) => {
    socket.join(GLOBAL_ROOM);
    userList[userId] = socket.id;
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(userList).find(
      (key) => userList[key] === socket.id
    );
    delete userList[userId];
  });

  socket.on("send-message", (data) => {
    const { receiver_id, message, sender } = data;
    socket.broadcast
      .to(userList[receiver_id])
      .emit("receive-message", { receiver_id, message, sender });
  });

  socket.on("send-speak-request", async (arg) => {
    const { admin } = arg;
    const targetAdmin = userList[admin];
    socket.broadcast.to(targetAdmin).emit("request-received");
  });

  socket.on("new-speaker-request-response", async (params) => {
    const { id, status } = params;
    const targetUser = userList[id];
    if (status === 3) {
      socket.broadcast.to(targetUser).emit("speaker-response", {
        status: "error",
        message: "Speaker Rejected Your Request!",
      });
    } else {
      const data = await SpeakRequestListRepo(Number(status));
      io.emit("speaker-response", {
        status: "success",
        message: "Speaker accepted your request.",
        data,
      });
    }
  });

  socket.on("change-session-status", async (params) => {
    const output = await EndSessionController(params);
    socket.broadcast.to(GLOBAL_ROOM).emit("update-session-status", {
      status: output.status,
      message: output.message,
      session_status: params.status,
    });
  });
};

export default socketHandler;
