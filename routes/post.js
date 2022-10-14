import { Router } from "express";
import Post from "../models/post.js";
import { PostValidator } from "../validators/post.js";
import handleValidator from "../middlewares/handleValidator.js";
import getPostById from "../middlewares/post/getPostById.js";
import hasPermissionToModify from "../middlewares/post/hasPermissionToModify.js";
import authMiddleware from "../middlewares/user/auth.js";

const router = Router();
const withAuthRouter = Router();
const validator = new PostValidator();

withAuthRouter.use(authMiddleware);

router.get("/:id", validator.checkId(), handleValidator, getPostById, async (req, res) => {
    res.status(200).json({ isError: false, data: req.post });
});

withAuthRouter.post(
    "/",
    validator.checkTitle(),
    validator.checkContent(),
    handleValidator,
    async (req, res) => {
        const { title, content } = req.body;
        const post = new Post({
            author: req.user.id,
            title,
            content,
            is_open: true,
            last_refresh: new Date(),
        });
        const postWithId = await post.save();
        res.status(200).json({ isError: false, data: postWithId });
    }
);

withAuthRouter.patch(
    "/:id",
    validator.checkId(),
    validator.checkContent(),
    validator.checkTitle(),
    validator.checkIsOpen(),
    handleValidator,
    getPostById,
    hasPermissionToModify,
    async (req, res) => {
        const { content, title, isOpen } = req.body;
        let { post } = req;
        post.content = content;
        post.title = title;
        post.is_open = isOpen;
        const updated = await post.save();
        if (!updated) {
            return res.status(404).json({ isError: true, message: "Post not updated" });
        }
        res.status(200).json({ isError: false, message: "Successfully updated post" });
    }
);

withAuthRouter.patch(
    "/:id/refresh",
    validator.checkId(),
    handleValidator,
    getPostById,
    hasPermissionToModify,
    async (req, res) => {
        let { post } = req;
        post.last_refresh = new Date();
        const updated = await post.save();
        if (!updated) {
            return res.status(404).json({ isError: true, message: "Post not updated" });
        }
        res.status(200).json({ isError: false, message: "Successfully refreshed post" });
    }
);

withAuthRouter.delete(
    "/:id",
    validator.checkId(),
    handleValidator,
    getPostById,
    hasPermissionToModify,
    async (req, res) => {
        const deleted = await req.post.remove();
        if (!deleted) {
            return res.status(404).json({ isError: true, message: "Post not deleted" });
        }
        res.status(200).json({ isError: false, message: "Post successfully deleted" });
    }
);

router.use("/", withAuthRouter);

const postsRouter = Router();

postsRouter.get(
    "/",
    validator.checkAuthorId(),
    validator.checkPage(),
    handleValidator,
    async (req, res) => {
        const limit = 20;
        let { page, authorId } = req.query;
        const posts = await Post.find(authorId ? { author: authorId } : undefined)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ last_refresh: -1 });
        res.status(200).json({ isError: false, data: posts });
    }
);

export const postsRoutes = postsRouter;

export default router;
