import { model, Schema } from "mongoose";

const Conversation = new Schema({
    post_owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        default: function () {
            return this.post.author;
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date(),
    },
});

export default model("Conversation", Conversation);
