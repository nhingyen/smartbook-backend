import Author from "../models/author.js";

// Tạo tác giả mới
export const createAuthor = async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --- HÀM MỚI ĐỂ NHẬN ARRAY ---
// API mới: POST /api/authors/bulk (nhận 1 array)
export const createManyAuthors = async (req, res) => {
  // req.body bây giờ sẽ là một mảng [...]
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res
      .status(400)
      .json({ error: "Request body phải là một mảng và không được rỗng" });
  }

  try {
    // Dùng Author.insertMany() để chèn toàn bộ mảng
    const newAuthors = await Author.insertMany(req.body);
    // Trả về một mảng chứa các tác giả vừa được tạo
    res.status(201).json(newAuthors);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả tác giả
export const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/authors/:id (Lấy chi tiết tac gia)
export const getAuthorDetail = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;

    // Tìm và xóa
    const author = await Author.findByIdAndDelete(authorId);

    // Vẫn nên kiểm tra xem có tìm thấy để xóa không
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tác giả để xóa.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Đã xóa tác giả thành công.",
      // data: author, // Trả về data tác giả vừa bị xóa (tùy chọn)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi xóa tác giả.",
      error: error.message,
    });
  }
};
