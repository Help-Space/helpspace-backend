import decodeToken from "../../utils/decodeToken.js";

export default function (socket, next) {
    let access_token = socket.handshake.headers.cookie;
    if (access_token) {
        try {
            access_token = access_token.split("=")[1];
            socket.user = decodeToken(access_token);
        } catch {
            console.error("Invalid token", access_token);
            next(new Error('Error decoding token'));
            return;
        }
    } else {
        next(new Error('Authentication error'));
        return;
    }
    next();
}
