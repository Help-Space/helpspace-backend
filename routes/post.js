import { Router } from "express";
import mongoose from "mongoose";
import Post from "../models/post.js";
import { PostValidator } from "../validators/post.js";
import handleValidator from "../middlewares/handleValidator.js";

const router = Router();
const validator = new PostValidator();

router.get("/:id", validator.checkId(), handleValidator, async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        return res.status(404).json({ isError: true, message: "Post not found!" });
    }
    res.status(200).json({ isError: false, data: post });
});

router.post(
    "/",
    validator.checkTitle(),
    validator.checkContent(),
    handleValidator,
    async (req, res) => {
        const { title, content } = req.body;
        const post = new Post({
            author: mongoose.Types.ObjectId.createFromHexString("634060dd27fb099710af9d24"),
            title,
            content,
            is_open: true,
            last_refresh: new Date(),
        });
        const postWithId = await post.save();
        res.status(200).json({ isError: false, data: postWithId });
    }
);

router.patch(
    "/:id",
    validator.checkId(),
    validator.checkContent(),
    validator.checkTitle(),
    validator.checkIsOpen(),
    handleValidator,
    async (req, res) => {
        const { id } = req.params;
        const { content, title, isOpen } = req.body;
        const updated = await Post.findByIdAndUpdate(id, { content, title, is_open: isOpen });
        if (!updated) {
            return res.status(404).json({ isError: true, message: "Post not updated" });
        }
        res.status(200).json({ isError: false, message: "Successfully updated post" });
    }
);

router.patch("/:id/refresh", validator.checkId(), handleValidator, async (req, res) => {
    const { id } = req.params;
    const updated = await Post.findByIdAndUpdate(id, { last_refresh: new Date() });
    if (!updated) {
        return res.status(404).json({ isError: true, message: "Post not updated" });
    }
    res.status(200).json({ isError: false, message: "Successfully refreshed post" });
});

router.delete("/:id", validator.checkId(), handleValidator, async (req, res) => {
    const { id } = req.params;
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
        return res.status(404).json({ isError: true, message: "Post not deleted" });
    }
    res.status(200).json({ isError: false, message: "Post successfully deleted" });
});

export const getPosts = async (req, res) => {
    const limit = 20;
    const { page = 1 } = req.query;
    const posts = await Post.find()
        .skip((page - 1) * limit)
        .limit(limit);
    res.status(200).json({ isError: false, data: posts });
};

export default router;
