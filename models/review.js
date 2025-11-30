import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  userId: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  comment: { type: String, required: true, trim: true, maxlength: 500 }, // Comment là bắt buộc
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);
