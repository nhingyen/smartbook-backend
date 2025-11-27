import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    uid: { type: String, required: true, unique: true }, // Firebase UID
    email: { type: String, required: true },
    displayName: { type: String },
    photoURL: { type: String },
    role: { type: String, default: "user" }, // admin hoặc user
    stats: {
      booksRead: { type: Number, default: 0 }, // Số sách đã xong
      dayStreak: { type: Number, default: 0 }, // Chuỗi ngày
      totalMinutes: { type: Number, default: 0 }, // Tổng phút đã đọc
      lastReadDate: { type: Date, default: null }, // Ngày đọc gần nhất để tính streak
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
