import { body, param, query } from "express-validator";

export class PostValidator {
    checkId() {
        return param("id").isString().isMongoId();
    }

    checkAuthor() {
        return body("author").isString();
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

    static checkPage() {
        return query("page").isNumeric();
    }
}
