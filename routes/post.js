import { Router } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Post from "../models/post";
import { PostValidator } from "../validators/post";

const router = Router();
const validator = new PostValidator();

router.get("/:id", validator.checkId(), async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        return res.status(404).json({ message: "Post not found!" });
    }
    res.status(200).json({ data: post });
});

router.post("/", async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Fields are missing" });
    }
    const post = new Post({
        author: mongoose.Types.ObjectId.createFromHexString("634060dd27fb099710af9d24"),
        title,
        content,
        status: true,
        last_refresh: new Date(),
    });
    const postWithId = await post.save();
    res.status(200).json({ data: postWithId });
});

router.patch("/:id/refresh", validator.checkId(), async (req, res) => {
    const { id } = req.params;
});

export default router;
