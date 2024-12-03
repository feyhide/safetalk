import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("CONNECTED TO DATABASE SUCCESSFULLY");
    } catch (err) {
        console.error(`Database connection error: ${err}`);
    }
};

export default connectDB