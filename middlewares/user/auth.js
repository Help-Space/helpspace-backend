export default function (req, res, next) {
    if (!req.user) {
        return res.status(401).json({ isError: true, message: "Unauthorized" });
    }
    next();
}
