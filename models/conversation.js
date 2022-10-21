import { model, Schema } from "mongoose";
import Message from "../models/message.js";

const Conversation = new Schema({
    post_owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
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

Conversation.index({_id: 1, post: 1}, {unique: true});

Conversation.pre("remove", async function () {
    try {
        await Message.deleteMany({ conversation: this._id });
    } catch(err) {
        console.error(err);
    }
})

export default model("Conversation", Conversation);
