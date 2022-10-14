import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import postRoutes, { getPosts } from "./routes/post.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongodbUrl = process.env.MONGODB_URI;

if (!mongodbUrl) {
    throw new Error("Mongo URL is not provided");
}

app.use(express.json());
app.use(cookieParser());

connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => {
    console.error(err);
    app.all("*", (req, res) => {
        res.status(500).send("Something went wrong");
    });
});

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.get("/posts", getPosts);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
