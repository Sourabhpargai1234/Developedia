import { ObjectId } from "mongodb"

export interface Feed {
  _id: ObjectId;
  email: string;
  image: string;
  video?: string;
  title: string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
}