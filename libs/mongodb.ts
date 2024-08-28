import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI must be defined");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
      console.log("MongoDB Connected");
    }
    return mongoose.connection; // Return the connection object
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
