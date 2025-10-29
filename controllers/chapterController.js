import Author from "../models/author.js";
// import Category from "../models/category.js";
import Chapter from "../models/chapter.js";

export const createChapter = async (req, res) => {
  try {
    const chapter = new Chapter(req.body);
    await chapter.save();

    // Tự động cộng 1 vào chapterCount của Book
    await book.findByIdAndUpdate(chapter.bookId, {
      $inc: { totalChapters: 1 },
    });
    res.status(201).json(chapter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createManyChapters = async (req, res) => {
  // req.body bây giờ sẽ là một mảng [...]
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res
      .status(400)
      .json({ error: "Request body phải là một mảng và không được rỗng" });
  }

  try {
    // Dùng Author.insertMany() để chèn toàn bộ mảng
    const newChapters = await Chapter.insertMany(req.body);
    // Trả về một mảng chứa các tác giả vừa được tạo
    res.status(201).json(newChapters);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/chapters/:id (Lấy chi tiết nội dung chương)
export const getChapterContent = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
