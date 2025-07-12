const socket = require("socket.io");
const Chat = require("../models/chat");

const initialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "https://devtinder-web-p880.onrender.com",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    socket.on("joinChat", ({ userid, targetUserId, username }) => {
      if (!userid || !targetUserId) {
        console.log("❌ Invalid room join - Missing user ID");
        return;
      }

      const roomid = [userid, targetUserId].sort().join("-");
      socket.join(roomid);
      console.log(`✅ ${username} joined room: ${roomid}`);
    });

    socket.on("send_message", async ({ newMessage, username, userid, targetUserId }) => {
      try {
        const roomid = [userid, targetUserId].sort().join("-");
        let chat = await Chat.findOne({
          participants: { $all: [userid, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userid, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({ senderId: userid, text: newMessage });
        await chat.save();

        const messagePayload = {
          text: newMessage,
          sender: userid,
          senderName: username,
          time: new Date(),
        };

        // ✅ Send to everyone in the room (including sender)
        io.to(roomid).emit("message_received", messagePayload);
        console.log(` Message sent in room ${roomid}:`, messagePayload.text);
      } catch (err) {
        console.log(" Socket send_message error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(" A user disconnected:", socket.id);
    });
  });
};

module.exports = initialiseSocket;
