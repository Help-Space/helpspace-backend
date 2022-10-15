import { model, Schema } from "mongoose";

const LikedPost = new Schema({
    liked_by: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    like_date: {
        type: Date,
        required: true,
    },
});

LikedPost.index({ liked_by: 1, like_date: -1 });

export default model("Liked Post", LikedPost);
