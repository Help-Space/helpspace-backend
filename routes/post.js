import { Router } from "express";
import Post from "../models/post.js";
import LikedPost from "../models/likedPosts.js";
import { PostValidator } from "../validators/post.js";
import handleValidator from "../middlewares/handleValidator.js";
import getPostById from "../middlewares/post/getPostById.js";
import hasPermissionToModify from "../middlewares/post/hasPermissionToModify.js";
import { logged } from "../middlewares/user/auth.js";

const router = Router();
const withAuthRouter = Router();
const validator = new PostValidator();

withAuthRouter.use(logged);

router.get("/:id", validator.checkId(), handleValidator, getPostById, async (req, res) => {
    let isPostLiked = false;
    if (req.user) {
        const likedPost = await LikedPost.findOne({
            liked_by: req.user.id,
            post: req.post._id,
        });
        if (likedPost) {
            isPostLiked = true;
        }
    }
    res.status(200).json({ isError: false, data: { ...req.post.toObject(), liked: isPostLiked } });
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

withAuthRouter.post("/:id/like", validator.checkId(), handleValidator, async (req, res) => {
    const isLiked = await LikedPost.findOne({ liked_by: req.user.id, post: req.params.id });
    if (isLiked) {
        return res.status(404).send({ isError: true, message: "Post is currently liked!" });
    }
    const likedPost = new LikedPost({
        liked_by: req.user.id,
        post: req.params.id,
        like_date: new Date(),
    });
    const added = await likedPost.save();
    if (!added) {
        return res.status(500).json({ isError: true, message: "Something went wrong!" });
    }
    res.status(200).json({ isError: false, message: "Like added successfully" });
});

withAuthRouter.delete("/:id/like", validator.checkId(), handleValidator, async (req, res) => {
    const likedPost = await LikedPost.findOneAndDelete({
        liked_by: req.user.id,
        post: req.params.id,
    });
    if (!likedPost) {
        return res.status(500).json({ isError: true, message: "Something went wrong!" });
    }
    res.status(200).json({ isError: false, message: "Like deleted successfully!" });
});

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

export const postRoutes = router;

const postsRouter = Router();

postsRouter.get(
    "/",
    validator.checkAuthorId(),
    validator.checkPage(),
    handleValidator,
    async (req, res) => {
        const limit = 20;
        const { page, authorId } = req.query;
        let posts = await Post.find(authorId ? { author: authorId } : undefined)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("author", "_id first_name last_name")
            .sort({ last_refresh: -1 });
        if (req.user) {
            const likedPosts = await LikedPost.find({ liked_by: req.user.id });
            posts = posts.map((post) => {
                const isInLikedPosts = likedPosts.find(
                    (likedPost) => likedPost.post._id.toString() === post._id.toString()
                );
                return { ...post.toObject(), liked: !!isInLikedPosts };
            });
        } else {
            posts = posts.map((post) => ({ ...post.toObject(), liked: false }));
        }
        const postsData = { pages: Math.ceil(Post.length / limit), posts };
        res.status(200).json({ isError: false, data: postsData });
    }
);

postsRouter.get("/liked", logged, validator.checkPage(), handleValidator, async (req, res) => {
    const limit = 20;
    const { page } = req.query;
    let likedPosts = await LikedPost.find({ author: req.user.id })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ last_refresh: -1 })
        .populate({
            path: "post",
            populate: { path: "author", select: "_id first_name last_name" },
        });
    likedPosts = likedPosts.map((val) => ({ ...val.post.toObject(), liked: true }));
    const likedPostsCount = await LikedPost.find({ author: req.user.id }).count();
    res.status(200).json({
        isError: false,
        data: { pages: Math.ceil(likedPostsCount / limit), posts: likedPosts },
    });
});

export const postsRoutes = postsRouter;
