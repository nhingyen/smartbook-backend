// controllers/userController.js
import User from "../models/user.js";

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy từ url /:userId

    const user = await User.findOne({ uid: userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReadingStats = async (req, res) => {
  try {
    const { userId, minutesRead, isBookFinished } = req.body;

    let user = await User.findOne({ uid: userId });
    if (!user) {
      console.log("User chưa tồn tại, đang tạo mới...");
      user = new User({
        uid: userId,
        email: "user_from_app@example.com", // Email giả định hoặc gửi từ App lên nếu cần
        stats: {
          booksRead: 0,
          dayStreak: 0,
          totalMinutes: 0,
          lastReadDate: null,
        },
      });
      // Không cần save ngay ở đây, xuống dưới save 1 thể cũng được
    }

    // 1. CỘNG THỜI GIAN ĐỌC
    if (minutesRead > 0) {
      user.stats.totalMinutes += minutesRead;
    }

    // 2. CỘNG SÁCH ĐÃ ĐỌC (Nếu Frontend báo là vừa đọc xong chương cuối)
    if (isBookFinished) {
      user.stats.booksRead += 1;
    }

    // 3. TÍNH CHUỖI NGÀY (STREAK)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 0h00 hôm nay

    let lastRead = null;
    if (user.stats.lastReadDate) {
      const d = new Date(user.stats.lastReadDate);
      lastRead = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    if (!lastRead) {
      // Lần đầu đọc
      user.stats.dayStreak = 1;
    } else {
      const diffTime = Math.abs(today - lastRead);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Đọc ngày hôm qua -> Tăng chuỗi
        user.stats.dayStreak += 1;
      } else if (diffDays > 1) {
        // Bỏ đọc quá 1 ngày -> Reset về 1
        user.stats.dayStreak = 1;
      }
      // Nếu diffDays === 0 (Đọc tiếp trong ngày) -> Giữ nguyên
    }

    // Cập nhật ngày đọc mới nhất
    user.stats.lastReadDate = now;

    await user.save();

    // Trả về data mới để App cập nhật UI
    res.status(200).json(user.stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ URL
    const updateData = req.body; // Lấy dữ liệu cần sửa (vd: { photoURL: "..." })

    // Tìm và update theo uid của Firebase
    const updatedUser = await User.findOneAndUpdate(
      { uid: userId },
      { $set: updateData },
      { new: true } // Trả về dữ liệu mới sau khi update
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
