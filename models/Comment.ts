import mongoose, { Schema, Document, Model } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

// Define an interface representing a document in MongoDB
interface IComment extends Document {
  content: string;
  video?: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
}

// Create a Schema corresponding to the document interface
const commentSchema: Schema<IComment> = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Apply the mongoose-aggregate-paginate-v2 plugin to the schema
commentSchema.plugin(mongooseAggregatePaginate);

// Create a Model
const Comment: Model<IComment> = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
