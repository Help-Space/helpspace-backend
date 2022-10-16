import { Router } from "express";
import { body } from "express-validator";
import { hash } from "bcrypt";
import handleValidator from "../middlewares/handleValidator.js";
import generateAccesstoken from "../utils/generateToken.js";
import User from "../models/user.js";

const router = Router();

router.post(
    "/register",
    UserValidator.checkFirstName(),
    UserValidator.checkLastName(),
    UserValidator.checkEmail(),
    UserValidator.checkPassword(),
    UserValidator.checkBirthDate(),
    handleValidator,
    async (req, res) => {
        const { first_name, last_name, email, password, birth_date } = req.body;

        const passwordHash = await hash(password, 10);

        const user = new User({
            first_name,
            last_name,
            email,
            password: passwordHash,
            birth_date,
        });

        user.save().then(
            (user) => {
                delete user.password;
                const accessToken = generateAccesstoken({ id: user.id });
                res.cookie("access_token", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
                    path: "/",
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                })
                    .status(200)
                    .json({ isError: false, data: user });
            },
            (err) => {
                console.error(err);
                res.status(500).json({ isError: true, message: "Something went wrong!" });
            }
        );
    }
);

export default router;
