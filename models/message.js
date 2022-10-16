import { model, Schema } from "mongoose";

const Message = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date(),
    },
});

export default model("Message", Message);
