import User from "../models/user.js";

export const syncUser = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user; // Lấy từ token đã decode

    // Tìm hoặc tạo mới user trong MongoDB
    const user = await User.findOneAndUpdate(
      { uid: uid },
      {
        email: email,
        displayName: name || "User",
        photoURL: picture || "",
      },
      { upsert: true, new: true } // upsert: tạo mới nếu chưa có
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
