import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";

dotenv.config();

connect("mongodb://localhost:27017");

const app: Express = express();
const port = process.env.PORT || 3001;

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
