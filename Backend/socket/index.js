const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");
const getConversation = require("../helpers/getConversation");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const onlineUser = new Set();

io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;

  const user = await getUserDetailsFromToken(token);

  if (user && user._id) {
    socket.join(user._id.toString());
    onlineUser.add(user._id.toString());
  } else {
    console.error("User or user ID is undefined");
  }

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    const userDetails = await UserModel.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };
    socket.emit("message-user", payload);

    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.messages || []);
  });

  socket.on("new message", async (data) => {
    try {
      const { sender, receiver, text, imageUrl, videoUrl, msgByUserId } = data;

      if (!sender || !receiver || !msgByUserId) {
        console.error(
          "❌ Missing sender, receiver, or msgByUserId in message data:",
          data
        );
        return;
      }

      let conversation = await ConversationModel.findOne({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      });

      if (!conversation) {
        conversation = new ConversationModel({ sender, receiver });
        await conversation.save();
      }

      const message = new MessageModel({
        text,
        imageUrl,
        videoUrl,
        msgByUserId,
      });

      const savedMessage = await message.save();

      await ConversationModel.updateOne(
        { _id: conversation._id },
        { $push: { messages: savedMessage._id } }
      );

      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      io.to(sender).emit("message", getConversationMessage?.messages || []);
      io.to(receiver).emit("message", getConversationMessage?.messages || []);

      const conversationSender = await getConversation(sender);
      const conversationReceiver = await getConversation(receiver);

      io.to(sender).emit("conversation", conversationSender);
      io.to(receiver).emit("conversation", conversationReceiver);
    } catch (error) {
      console.error("❌ Error in new message handler:", error.message);
    }
  });

  socket.on("sidebar", async (currentUserId) => {
    const conversation = await getConversation(currentUserId);

    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });

    const conversationMessageId = conversation?.messages || [];

    const updateMessages = await MessageModel.updateMany(
      { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
      { $set: { seen: true } }
    );

    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReceiver);
  });

  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
  });
});

module.exports = {
  app,
  server,
};
