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
    // todo resend conversation to user (conversationCreated)
    socket.join(conversation._id.toString());
    io.sockets.sockets.forEach(authorSocket => {
        if (socket.user.id === dbPost.author.toString()) {
            authorSocket.join(conversation._id.toString());
        }
    })
}

export default conversationCreateListener;