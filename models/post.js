import { model, Schema } from "mongoose";
import LikedPost from "../models/likedPosts.js";
import Conversation from "../models/conversation.js";

const Post = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    is_open: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    last_refresh: {
        type: Date,
        required: true,
    },
});

Post.pre("remove", async function () {
    try {
        await LikedPost.deleteMany({ post: this._id })
        await Conversation.deleteMany({ post: this._id });
    }
    catch(err) {
        console.error(err);
    }
})

Post.index({ last_refresh: -1 });

export default model("Post", Post);
