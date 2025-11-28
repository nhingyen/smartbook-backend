import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    bookId: {
      type: String,
    },
    chapterId: {
      type: String,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    helpful: {
      type: Boolean,
      default: null, // null = chưa đánh giá, true = hữu ích, false = không hữu ích
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatHistory", chatHistorySchema);
