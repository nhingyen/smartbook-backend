import mongoose from "mongoose";
import Review from "../models/review.js";

// API 1: Gửi/Cập nhật bình luận
// controllers/reviewController.js (Chỉ cần thay đổi hàm submitReview)

export const submitReview = async (req, res) => {
  try {
    const { userId, bookId, comment } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ error: "Bình luận không được để trống" });
    }

    // THAY THẾ findOneAndUpdate BẰNG CREATE
    const newComment = await Review.create({
      userId,
      bookId,
      comment,
      createdAt: new Date(),
    });

    res
      .status(200)
      .json({ message: "Bình luận đã được lưu", review: newComment });
  } catch (error) {
    console.error("Lỗi tạo comment:", error.message);
    res.status(500).json({ error: error.message || "Lỗi gửi bình luận" });
  }
};

// API 2: Lấy danh sách bình luận (ĐÃ SỬA DÙNG $LOOKUP)
export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.aggregate([
      { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },

      // 1. Tra cứu thông tin người dùng
      {
        $lookup: {
          from: "users", // Tên collection User của bạn trong MongoDB
          localField: "userId",
          foreignField: "uid", // Trường lưu UID Firebase trong bảng users
          as: "userProfile", // Đặt tên kết quả tra cứu là 'userProfile'
        },
      },

      // 2. Phá vỡ mảng tra cứu (để có thể truy cập userProfile.displayName)
      { $unwind: { path: "$userProfile", preserveNullAndEmptyArrays: true } },

      // 3. Chọn các trường cần trả về và đổi tên
      {
        $project: {
          _id: 1,
          comment: 1,
          createdAt: 1,
          userId: 1,

          // 🎯 Lấy Tên và Ảnh từ userProfile (các trường trong model User)
          userName: "$userProfile.displayName",
          userPhoto: "$userProfile.photoURL",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Lỗi get reviews:", error);
    res.status(500).json({ error: error.message });
  }
};
