// controllers/progressController.js
import ReadingProgress from "../models/readingProgress.js";

// Lưu tiến độ (Dùng cho cả tạo mới và cập nhật)
export const saveProgress = async (req, res) => {
  try {
    const { userId, bookId, chapterId } = req.body;

    // Tìm xem user này đã đọc sách này chưa
    // Nếu có rồi -> Update chapterId và thời gian
    // Nếu chưa -> Tạo mới (upsert: true)
    const progress = await ReadingProgress.findOneAndUpdate(
      { userId: userId, bookId: bookId },
      {
        chapterId: chapterId,
        lastReadAt: new Date(),
      },
      { upsert: true, new: true } // upsert: tạo mới nếu chưa có
    );

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách đang đọc (Dùng cho Home Screen)
export const getReadingList = async (req, res) => {
  try {
    const { userId } = req.query; // Lấy từ ?userId=...

    if (!userId) return res.status(400).json({ message: "Thiếu userId" });

    const list = await ReadingProgress.find({ userId })
      .sort({ lastReadAt: -1 }) // Mới đọc nhất lên đầu
      .populate({
        path: "bookId", // Join với bảng Book
        select: "title imgUrl authorName", // Lấy tên sách, ảnh bìa, author ID
        populate: {
          path: "author", // Từ author ID trong Book, Join tiếp với bảng Author
          select: "authorName", // Chỉ lấy tên tác giả (hoặc fullName)
        },
      })
      .populate("chapterId", "title chapterNumber"); // Lấy thông tin chương

    // Lọc bỏ các bản ghi null (phòng trường hợp sách bị xóa)
    const cleanList = list.filter((item) => item.bookId !== null);

    res.status(200).json(cleanList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
