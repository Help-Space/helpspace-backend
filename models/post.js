import { model, Schema } from "mongoose";

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

Post.index({ last_refresh: -1 });

export default model("Post", Post);
