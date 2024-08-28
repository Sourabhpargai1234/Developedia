import { Schema, model, models } from "mongoose";

export interface UserFeeds {
  email: string;
  image: string;
  video: string,
  title: string,
  desc: string,
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedsSchema = new Schema<UserFeeds>({
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    image:{
        type: String,
        required: [true, "At least a single image is required"]
    },
    video: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Title is a must"],
      minlength: [1, "Must be atleast 10 characters"],
      maxlength: [30, "Must not exceed 30 characters"]
    },
    desc: {
        type: String,
        required: [true, "Description is compulsory"],
        minlength: [5, "Must be atleast 50 characters"],
        maxlength: [200, "Explaination must not exceed 200 characters"]
    }
  },
  {
    timestamps: true,
  }
);

const Feed = models.Feed || model<UserFeeds>('Feed', FeedsSchema);
export default Feed;