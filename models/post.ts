import {model, Schema, Types} from "mongoose";

interface IPost {
    author: Types.ObjectId;
    status: boolean;
    title: string;
    content: string;
    last_refresh: Date;
}

const Post = new Schema<IPost>({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    last_refresh: {
        type: Date,
        required: true,
    },
});

export default model<IPost>('Post', Post);