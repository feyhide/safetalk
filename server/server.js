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

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: true,
}));

app.use(xss());
app.use(mongoSantize());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});
app.use(limiter);
app.use(csurf({ cookie: true }));
const allowedOrigins = ['http://localhost:3000', 'https://your-frontend-domain.com'];
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

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

setUpSocket(server);