import { model, Schema } from "mongoose";

const Conversation = new Schema({
    participants: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: true,
        validate: [arrayMaxLength, "max limit of 2"],
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

const arrayMaxLength = (val) => {
    return val.length <= 2;
};

export default model("Conversation", Conversation);
