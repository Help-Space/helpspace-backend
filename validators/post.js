import { body, param, query } from "express-validator";

export class PostValidator {
    checkId() {
        return param("id").isString().isMongoId();
    }

    static checkAuthorId() {
        return query("authorId").optional().isMongoId();
    }

    static checkPage() {
        return query("page")
            .optional()
            .toInt()
            .customSanitizer((value) => {
                if (isNaN(value) || value < 1) {
                    return 1;
                }
                return value;
            });
    }

    checkIsOpen() {
        return body("isOpen").isBoolean();
    }

    checkTitle() {
        return body("title").isString();
    }

    checkContent() {
        return body("content").isString();
    }
}
