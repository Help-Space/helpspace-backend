import {body, param} from "express-validator";
import User from "../models/user.js";

export class UserValidator {
    static checkFirstName() {
        return body("first_name").isString().isLength({ min: 2, max: 20 }).trim();
    }

    static checkLastName() {
        return body("last_name").isString().isLength({ min: 2, max: 30 }).trim();
    }

    static checkEmail(isRegister = true) {
        return body("email")
            .isEmail()
            .normalizeEmail()
            .custom(async (value) => {
                const user = await User.findOne({ email: value });
                if (isRegister) {
                    if (user) {
                        return Promise.reject("Email already in use");
                    }
                } else {
                    if (!user) {
                        return Promise.reject("User not found");
                    }
                }
            });
    }

    static checkPassword(isRegister = true) {
        if (isRegister) {
            return body("password")
                .isStrongPassword({ minLength: 6, minLowercase: 2, minUppercase: 2, minNumbers: 1 })
                .isLength({ min: 6, max: 128 });
        } else {
            return body("password").notEmpty();
        }
    }

    static checkBirthDate() {
        return body("birth_date").isISO8601();
    }

    static checkId() {
        return param("id").isMongoId();
    }
}
