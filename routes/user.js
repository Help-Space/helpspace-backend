import { Router } from "express";
import { body } from "express-validator";
import { hash } from "bcrypt";
import handleValidator from "../middlewares/handleValidator.js";
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
                loginUser(res, user);
            },
            (err) => {
                console.error(err);
                res.status(500).json({ isError: true, message: "Something went wrong!" });
            }
        );
    }
);

export default router;
