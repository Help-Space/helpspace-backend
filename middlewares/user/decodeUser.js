import decodeToken from "../../utils/decodeToken.js";

export default function (req, res, next) {
    const { access_token } = req.cookies;
    if (access_token) {
        try {
            req.user = decodeToken(access_token);
        } catch {}
    }
    next();
}
