import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Đảm bảo 1 user không thể thêm 1 cuốn sách 2 lần vào thư viện
librarySchema.index({ userId: 1, bookId: 1 }, { unique: true });

export default mongoose.model("Library", librarySchema);
