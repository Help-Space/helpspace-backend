import generateAccesstoken from "./generateToken.js";

const loginUser = (res, user) => {
    const accessToken = generateAccesstoken({id: user.id});
    const data = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        birth_date: user.birth_date,
    };
    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })
        .status(200)
        .json({isError: false, data})
};

export default loginUser;