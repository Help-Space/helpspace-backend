import { Router } from "express";
import { body, validationResult } from "express-validator";
import User from "../models/user.js";

const router = Router();

router.post(
    "/register",
    body("first_name").isString().isLength({ min: 2, max: 20 }).trim(),
    body("last_name").isString().isLength({ min: 2, max: 30 }).trim(),
    body("email")
        .isEmail()
        .normalizeEmail()
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                return Promise.reject("Email already in use");
            }
        }),
    body("password")
        .isStrongPassword({ minLength: 6, minLowercase: 2, minUppercase: 2, minNumbers: 1 })
        .isLength({ min: 6, max: 128 }),
    body("birth_date").isISO8601(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        createUser(req.body).then(
            (ok) => {},
            (err) => {
                res.status(500).send(err);
            }
        );

        res.send("Hello World");
    }
);

export default router;
