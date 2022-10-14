import jwt from "jsonwebtoken";

export default function (token) {
    return jwt.verify(token, process.env.TOKEN_SECRET);
}
