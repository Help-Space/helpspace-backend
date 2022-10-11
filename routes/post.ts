import { Router } from "express";
import mongoose from "mongoose";
import Post, { IPost } from "../models/post";
import { Responses } from "../types/responses";

interface GetByIdParams {
    id: string;
}

const router = Router();

router.get<GetByIdParams, Responses<IPost>>("/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Id is missing" });
    }
    if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(400).json({ message: "Id is not correct" });
    }
    const post = await Post.findById(mongoose.Types.ObjectId.createFromHexString(id));
    if (!post) {
        return res.status(404).json({ message: "Post not found!" });
    }
    res.status(200).json({ data: post });
});

export default router;
