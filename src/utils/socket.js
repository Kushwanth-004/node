const socket = require("socket.io");
const Chat = require("../models/chat");

const initialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "https://devtinder-web-p880.onrender.com",
      Credentials: true,
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userid, targetUserId, username }) => {
      const roomid = [userid, targetUserId].sort().join("-");
      socket.join(roomid);
    });
    socket.on(
      "send_message",
      async ({ newMessage, username, userid, targetUserId }) => {
        try {
          const roomid = [userid, targetUserId].sort().join("-");
          // console.log(username, " sent a msg  : ", newMessage);
          let chat = await Chat.findOne({
            participants: {
              $all: [userid, targetUserId],
            },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userid, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ senderId: userid, text: newMessage });
          await chat.save();

          socket.to(roomid).emit("message_received", {
            text: newMessage,
            sender: userid,
            senderName: username,
            time: new Date(),
          });
        } catch (err) {
          console.log(err.message);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initialiseSocket;
