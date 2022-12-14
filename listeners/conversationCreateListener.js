import Conversation from "../models/conversation.js";
import Post from "../models/post.js";
import mongoose from "mongoose";
import {io} from "../index.js";

const conversationCreateListener = async (socket, data) => {
    const {postId} = data;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        console.error("conversationCreateListener -> Invalid post id", postId);
        return;
    }
    const dbPost = await Post.findById(postId).exec();
    if (!dbPost) {
        console.error("conversationCreateListener -> Post not found", postId);
        return;
    }
    const user = socket.user.id;
    const dbConversation = await Conversation.findOne({post: postId, user});
    if (dbConversation) {
        console.error("conversationCreateListener -> Conversation already exists", dbConversation);
        return;
    }
    const conversation = new Conversation({
        post: postId,
        post_owner: dbPost.author,
        user,
    });
    await conversation.save();

    const conversationObj = (await conversation.populate("post", "title _id")).toObject();
    await Conversation.populate(conversation, {path: "user post_owner"});
    const target = conversation[conversation.post_owner._id.toString() === socket.user.id ? "user" : "post_owner"];
    const finalConversation = {
        ...conversationObj,
        targetUser: {first_name: target.first_name, last_name: target.last_name}
    };
    socket.join(conversation._id.toString());
    socket.emit("conversationCreated", finalConversation);
    io.sockets.sockets.forEach(authorSocket => {
        if (socket.user.id === dbPost.author.toString()) {
            authorSocket.join(conversation._id.toString());
            authorSocket.emit("conversationCreated", finalConversation);
        }
    })
}

export default conversationCreateListener;