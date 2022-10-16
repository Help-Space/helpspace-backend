import { model, Schema } from "mongoose";

const Conversation = new Schema({
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
    }
});

export default model("Conversation", Conversation);
