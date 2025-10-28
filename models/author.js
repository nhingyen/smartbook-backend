import mongoose from "mongoose";
const Schema = mongoose.Schema;

const authorSchema = new Schema(
  {
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorBio: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Author", authorSchema);
