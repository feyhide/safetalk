import express from 'express'
import dotenv from 'dotenv'
import connectDB from './utils/connectDB.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import Redis from "ioredis"
import authRouter from './route/auth.js'
import userRouter from './route/user.js'

dotenv.config();

const app = express();
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

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});