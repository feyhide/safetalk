import express from 'express'
import dotenv from 'dotenv'
import connectDB from './utils/connectDB.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import Redis from "ioredis"
import authRouter from './route/auth.js'
import userRouter from './route/user.js'
import chatRouter from './route/Chat.js'
import setUpSocket from './socket/socket.js';
import groupRouter from './route/group.js'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSantize from 'express-mongo-sanitize'
import csurf from 'csurf'
import path from 'path';

dotenv.config();
//const _dirname = path.resolve();
const app = express();
app.use(cookieParser());
app.use(express.json());
//app.use(express.static(path.join(_dirname, "/client/dist")));
// app.use(helmet({
//     contentSecurityPolicy: false,
//     crossOriginEmbedderPolicy: true,
// }));

//app.use(xss());
//app.use(mongoSantize());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});
//app.use(limiter);
//app.use(csurf({ cookie: true }));
const allowedOrigins = [
    'https://safetalk-y30j.onrender.com',
    'http://localhost:5173',
];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));



const PORT = process.env.PORT || 3000;

connectDB();

export const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
    console.log("Redis Connected");
});

redisClient.on("error", (err) => {
    console.error(`Redis connection error: ${err}`);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/group", groupRouter);


app.get('*', (req, res) => {
    res.sendFile(path.join(_dirname, 'client', 'dist', "index.html"));
});
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

setUpSocket(server);