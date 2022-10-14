import jwt from "jsonwebtoken";

const generateAccesstoken = (data) => {
    return jwt.sign(
        {
            ...data,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "1w" }
    );
};

export default generateAccesstoken;