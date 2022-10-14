export default function (req, res, next) {
    if (req.post.author.toHexString() !== req.user.id) {
        return res.status(403).json({ isError: true, message: "You don't have permission" });
    }
    next();
}
