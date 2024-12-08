import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { redisClient } from '../server.js';
import User from '../model/user.js';
import dotenv from 'dotenv'
import { validateOtp, validateSignin, validateSignup } from '../utils/validation/auth_validator.js';
import { sendError, sendSuccess, sendValidationError } from '../utils/response.js';

dotenv.config();

export const sendUserInfo = async (user) => {
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const signup = async (req, res) => {
    const { email, password, username } = req.body;
    const {error,value} = validateSignup(req.body);
    
    if(error){
        const errorMessages = error.details.map(detail => detail.message);
        return sendValidationError(res,errorMessages,null,400);
    }
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already in use.' });

        const hashedPassword = bcryptjs.hashSync(password, 8);

        const otp = generateOTP();
        const otpKey = `otp:${email}`;
        const tempUserKey = `temp_user:${email}`;

        const pipeline = redisClient.pipeline();
        pipeline.del(otpKey);
        pipeline.del(tempUserKey);
        pipeline.setex(otpKey, 60, otp);
        pipeline.setex(tempUserKey, 600, JSON.stringify({ username, email, hashedPassword }));
        await pipeline.exec(); 

        await transporter.sendMail({
            to: email,
            subject: 'OTP for Account Verification',
            text: `Your OTP is ${otp}. It expires in 1 minute.`,
        });

        return sendSuccess(res,`OTP sent to ${email}. Please verify within 1 minute.`,null,200);
    } catch (error) {
        console.error('Signup Error:', error);
        return sendError(res,'Signup failed. Try again later',null,500)
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const {error,value} = validateOtp(req.body);

    if(error){
        const errorMessages = error.details.map(detail => detail.message);
        return sendValidationError(res,errorMessages,null,400);
    }

    try {
        const otpKey = `otp:${email}`;
        const tempUserKey = `temp_user:${email}`;

        const storedOtp = await redisClient.get(otpKey);
        const tempUserData = await redisClient.get(tempUserKey);

        if (!storedOtp || !tempUserData) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        if (storedOtp !== otp.toString()) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        const { username, email: userEmail, hashedPassword } = JSON.parse(tempUserData);
        const avatar = `https://robohash.org/${username}`;
        const newUser = new User({username,avatar,email: userEmail, password: hashedPassword });
        await newUser.save();

        await redisClient.del(otpKey);
        await redisClient.del(tempUserKey);

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure:false,
            sameSite: 'strict'
        })

        return sendSuccess(res,'User registered successfully!',await sendUserInfo(newUser),200);
    } catch (error) {
        console.error('OTP Verification Error:', error);
        if (error.code === 11000) { 
            return sendError(res, 'Username is taken.', null, 500);
        }
        return sendError(res,'An error occurred during OTP verification.',null,500)
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    
    const {error,value} = validateSignin(req.body);

    if(error){
        const errorMessages = error.details.map(detail => detail.message);
        return sendValidationError(res,errorMessages,null,400);
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return res.status(404).json({ message: 'Invalid credentials' });

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure:false,
            sameSite: 'strict'
        })

        return sendSuccess(res,'Logged in successfully.',await sendUserInfo(validUser),200);
    } catch (error) {
        console.log(error)
        return sendError(res,'Sign in failed. Try again later',null,500)
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        return sendSuccess(res,'Logged out successfully.',null,200);
    } catch (error) {
        return sendError(res,'Sign out failed. Try again later',null,500)
    }
};