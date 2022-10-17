export const logged = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ isError: true, message: "Unauthorized" });
    }
    next();
}

export const notLogged = (req, res, next) => {
    if (req.user) {
        return res.status(403).json({ isError: true, message: "Already authorized" });
    }
    next();
}