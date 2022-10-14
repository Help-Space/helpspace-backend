import { Router } from "express";
import { body } from "express-validator";
import {hash} from "bcrypt";
import handleValidator from "../middlewares/handleValidator.js";
import generateAccesstoken from "../utils/generateToken.js";
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
    handleValidator,
    async (req, res) => {
        const {first_name, last_name, email, password, birth_date} = req.body;

        const passwordHash = await hash(password, 10);

        const user = new User({
            first_name,
            last_name,
            email,
            password: passwordHash,
            birth_date,
        });

        user.save().then((user) => {
            const accessToken = generateAccesstoken({id: user.id});
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
                path: "/",
                maxAge: 1000 * 60 * 60 * 24 * 7,
            }).status(200).json({isError: false, data: user});
        }, (err) => {
            console.error(err);
            res.status(500).json({isError: true, message: "Something went wrong!"});
        });

    }
);

export default router;
