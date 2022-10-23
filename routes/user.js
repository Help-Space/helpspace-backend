import { Router } from "express";
import { hash, compare } from "bcrypt";
import handleValidator from "../middlewares/handleValidator.js";
import User from "../models/user.js";
import loginUser from "../utils/loginUser.js";
import { logged, notLogged } from "../middlewares/user/auth.js";
import { UserValidator } from "../validators/user.js";

const router = Router();

router.post(
    "/register",
    notLogged,
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

router.post(
    "/login",
    notLogged,
    UserValidator.checkEmail(false),
    UserValidator.checkPassword(false),
    handleValidator,
    async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).exec();

        let isPassCorr = await compare(password, user.password);
        if (!isPassCorr) {
            return res.status(403).json({ isError: true, message: "Incorrect password" });
        }

        loginUser(res, user);
    }
);

router.delete("/logout", logged, (req, res) => {
    res.clearCookie("access_token");
    res.status(200).json({ isError: false, message: "Successfully logged out" });
});

router.get("/", logged, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ isError: false, data: user });
});

router.get("/:id", UserValidator.checkId(), handleValidator, async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        return res.status(404).json({ isError: true, message: "User not found" });
    }
    res.status(200).json({ isError: false, data: user });
});

export default router;
