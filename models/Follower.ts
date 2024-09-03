//Subscription schema and it's type

import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface for the Subscribe document
export interface ISubscribe extends Document {
  follower: mongoose.Types.ObjectId;
  followedTo: mongoose.Types.ObjectId;
  createdAt: Date;
}

// Subscribe Schema
const SubscribeSchema: Schema<ISubscribe> = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  followedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create and export the Subscribe model
export const Subscribe =  mongoose.models.Subscribe || mongoose.model<ISubscribe>('Subscribe', SubscribeSchema);