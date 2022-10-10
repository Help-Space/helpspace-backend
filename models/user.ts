import {model, Schema} from "mongoose";

interface IUser {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birth_date: Date;
}

const User = new Schema<IUser>({
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
        unique: true
    },
    password: {
        type: String,
        min: 8,
        max: 72,
        required: true
    },
    birth_date: {
        type: Date,
        required: true,
    },
});

export default model<IUser>('User', User);