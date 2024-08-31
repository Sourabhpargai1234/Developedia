//Likes Schema and it's type

import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface for the Like document
export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  feed: mongoose.Types.ObjectId;
  createdAt: Date;
}


// Like Schema
const LikeSchema: Schema<ILike> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  feed: { type: Schema.Types.ObjectId, ref: 'Feed', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create and export the Like model
export const Like =  mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);