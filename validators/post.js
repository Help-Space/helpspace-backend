import { body, param } from "express-validator";
import mongoose from "mongoose";

export class PostValidator {
    checkId() {
        return param("id")
            .isString()
            .customSanitizer((value) => {
                if (!mongoose.isObjectIdOrHexString(value)) {
                    return Promise.reject("Id is not correct!");
                }
                return mongoose.Types.ObjectId.createFromHexString(value);
            });
    }

    checkAuthor() {
        return body("author").isString();
    }

    checkStatus() {
        return body("status").isBoolean();
    }

    checkTitle() {
        return body("title").isString();
    }

    checkContent() {
        return body("content").isString();
    }
}
