import { validationResult } from "express-validator";

export default function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ isError: true, errors: errors.array() });
    }
    next();
}
