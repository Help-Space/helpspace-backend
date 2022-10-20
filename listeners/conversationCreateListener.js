import Conversation from "../models/conversation.js";
import Post from "../models/post.js";
import mongoose from "mongoose";

const conversationCreateListener = async (socket, data) => {
        const { postId } = data;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return;
        }
        const dbPost = await Post.findById(postId);
        if (!dbPost) {
            return;
        }
        const user = socket.user.id;
        const dbConversation = await Conversation.findOne({ post: postId, user });
        if (dbConversation) {
            return;
        }
        const conversation = new Conversation({
            post: postId,
            user,
        });
        await conversation.save();
}

export default conversationCreateListener;