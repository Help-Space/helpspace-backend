import Post from "../../models/post.js";

export default async function (req, res, next) {
    const post = await Post.findById(req.params.id).populate("author", "_id first_name last_name");
    if (!post) {
        return res.status(404).json({ isError: true, message: "Post not found!" });
    }
    req.post = post;
    next();
}
