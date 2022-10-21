import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

const messagesRequestListener = async (socket, data) => {
    const user = socket.user.id;
    const {conversationId} = data;
    const select = "first_name last_name _id";
    const conversation = await Conversation.findById(conversationId).populate("post_owner", select).populate("user", select).exec();
    if (!conversation || (conversation.post_owner.toString() !== user && conversation.user.toString() !== user)) {
        return;
    }
    const messages = await Message.find({conversation: conversationId}).exec();
    socket.emit("messages", messages.map((message) => ({
        ...message.toObject(),
        author: conversation.post_owner._id.toString() === message.author.toString() ? conversation.post_owner : conversation.user,
    })));
}

export default messagesRequestListener;