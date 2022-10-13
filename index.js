import express, { Express } from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import postRoutes from "./routes/post";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongodbUrl = process.env.MONGODB_URI;

if (!mongodbUrl) {
    throw new Error("Mongo URL is not provided");
}

app.use(express.json());

connect(mongodbUrl).catch((err) => {
    console.error(err);
    app.all("*", (req, res) => {
        res.status(500).send("Something went wrong");
    });
});

app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
