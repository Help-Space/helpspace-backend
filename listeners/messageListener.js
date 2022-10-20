import Message from "../models/message.js";
import {io} from "../index.js";
import mongoose from "mongoose";
import Conversation from "../models/conversation.js";

const messageListener = async (socket, data) => {
    const userId = socket.user.id;
    const { conversationId, message } = data;
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return;
    }
    const select = "first_name last_name _id";
    const conversation = await Conversation.findById(conversationId).populate("post_owner", select).populate("user", select).exec();
    if (!conversation || (conversation.post_owner.toString() !== userId && conversation.user.toString() !== userId)) {
        return;
    }
    const newMessage = new Message({
        conversation: conversationId,
        author: userId,
        message,
    });
    await newMessage.save();
    io.to(conversationId).emit("message", {
        ...newMessage.toObject(),
        author: conversation.post_owner._id.toString() === userId ? conversation.post_owner : conversation.user
    });
}

export default messageListener;