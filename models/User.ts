//User Schema and it's type

import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  likedPosts: mongoose.Types.ObjectId[];
  subscribers: mongoose.Types.ObjectId[];
  subscribedTo: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}


// Interface for the User model
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  profilePicture: String,
  bio: String,
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  subscribedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {
  timestamps: true,
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);