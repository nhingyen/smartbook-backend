// models/readingProgress.js
import mongoose from "mongoose";

const readingProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // UID từ Firebase
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    required: true,
  },
  lastReadAt: { type: Date, default: Date.now },
});

// Đánh index: Một user với một cuốn sách chỉ có 1 dòng record (lưu đè lên)
readingProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export default mongoose.model("ReadingProgress", readingProgressSchema);
