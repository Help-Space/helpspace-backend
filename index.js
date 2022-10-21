import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import { postRoutes, postsRoutes } from "./routes/post.js";
import userRoutes from "./routes/user.js";
import decodeUser from "./middlewares/user/decodeUser.js";
import decodeSocketUser from "./middlewares/user/decodeSocketUser.js";
import { Server } from "socket.io";
import logger from "morgan";
import { createServer } from "http";
import cors from "cors";
import conversationCreateListener from "./listeners/conversationCreateListener.js";
import messageListener from "./listeners/messageListener.js";
import messagesRequestListener from "./listeners/messagesRequestListener.js";
import Conversation from "./models/conversation.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongodbUrl = process.env.MONGODB_URI;

if (!mongodbUrl) {
    throw new Error("Mongo URL is not provided");
}

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(decodeUser);
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => {
    console.error(err);
    app.all("*", (req, res) => {
        res.status(500).send("Something went wrong");
    });
});

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/posts", postsRoutes);

app.use((req, res) => {
    res.status(404).json({ isError: true, message: "Route not found or method is not correct!" });
});

const socketCors = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
};

const server = createServer(app);
export const io = new Server(server, {
    cors: socketCors,
});

io.use(decodeSocketUser);

io.on("connection", async (socket) => {
    const userId = socket.user.id;
    console.log(userId + " connected");
    const conversations = await Conversation.find({ $or: [{post_owner: userId}, {user: userId}] }).populate("post", "title _id").exec();
    const conversationsObj = conversations.map((conversation) => conversation.toObject());
    await Conversation.populate(conversations, {path: "user post_owner"});
    conversations.forEach((conversation) => {
        socket.join(conversation._id.toString());
    })

    socket.emit("conversations", conversations.map((conversation, i) => {
        const target = conversation[conversation.post_owner._id.toString() === userId ? "user" : "post_owner"];
        return ({
            ...conversationsObj[i],
            targetUser: {first_name: target.first_name, last_name: target.last_name}
        })
    }));
    socket.on("messagesRequest", (data) => messagesRequestListener(socket, data));
    socket.on("conversationCreate", (data) => conversationCreateListener(socket, data));
    socket.on("message", (data) => messageListener(socket, data));

    socket.on("disconnect", () => console.log(userId + " disconnected"));
});

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
