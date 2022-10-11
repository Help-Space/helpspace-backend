import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";

dotenv.config();

const mongodbUrl = process.env.MONGODB_URI;
if(!mongodbUrl) {
    throw new Error("Mongo URL is not provided");
}

connect(mongodbUrl).catch((err) => {
    throw err
})

const app: Express = express();
const port = process.env.PORT || 3001;

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
