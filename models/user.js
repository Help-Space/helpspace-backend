import { model, Schema } from "mongoose";

const User = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        min: 8,
        max: 72,
        required: true,
    },
    birth_date: {
        type: Date,
        required: true,
    },
});

export default model("User", User);
