import Library from "../models/library.js";

// API 1: Thêm hoặc Xóa (Toggle)
export const toggleLibrary = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // Kiểm tra xem đã có chưa
    const existing = await Library.findOne({ userId, bookId });

    if (existing) {
      // Có rồi thì XÓA
      await Library.findByIdAndDelete(existing._id);
      return res
        .status(200)
        .json({ isAdded: false, message: "Đã xóa khỏi thư viện" });
    } else {
      // Chưa có thì THÊM
      const newItem = new Library({ userId, bookId });
      await newItem.save();
      return res
        .status(200)
        .json({ isAdded: true, message: "Đã thêm vào thư viện" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API 2: Lấy danh sách thư viện để hiện ở Home
export const getLibrary = async (req, res) => {
  try {
    const { userId } = req.query;
    // Lấy list và populate thông tin sách
    const list = await Library.find({ userId })
      .populate("bookId")
      .sort({ createdAt: -1 });

    // Lọc bỏ sách lỗi và chỉ trả về object sách
    const books = list.filter((item) => item.bookId).map((item) => item.bookId);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API 3: Kiểm tra trạng thái (Để hiển thị đúng nút lúc mới vào trang Detail)
export const checkStatus = async (req, res) => {
  try {
    const { userId, bookId } = req.query;
    const exists = await Library.exists({ userId, bookId });
    res.status(200).json({ isAdded: !!exists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
