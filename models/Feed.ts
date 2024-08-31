//Feeds Schema and it's type

import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface for the Feed document
export interface IFeed extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  desc: string;
  file: string;
  videofile: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Feed Schema
const FeedSchema: Schema<IFeed> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  desc: { type: String, required: true },
  file: [{ type: String }],
  videofile: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create and export the Feed model
export const Feed = mongoose.models.Feed || mongoose.model<IFeed>('Feed', FeedSchema);