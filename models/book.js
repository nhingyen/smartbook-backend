import mongoose from "mongoose";
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId, //1. Phải là ObjectId
      ref: "Author", // 2. Phải có 'ref' để liên kết với Model 'Auth
      required: true,
    },
    imgUrl: { type: String, required: true },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    description: { type: String, default: "" },
    genres: [{ type: String }],
  },
  { timestamps: true }
);
export default mongoose.model("Book", bookSchema);
