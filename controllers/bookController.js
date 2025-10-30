import Book from "../models/book.js";
import Author from "../models/author.js";
import Category from "../models/Category.js";
import Chapter from "../models/chapter.js";

export const getAllBooks = async (req, res) => {
  try {
    const genre = req.query.genre;
    let query = {};

    if (genre) {
      query.genres = genre;
    }
    // .populate('author') để lấy thông tin tác giả
    const books = await Book.find(query).populate("author");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// API cho Home Screen
export const getHomeData = async (req, res) => {
  try {
    const categories = await Category.find().limit(6);
    const authors = await Author.find().limit(6);
    const newBooks = await Book.find()
      .sort({ createdAt: -1 })
      .populate("author")
      .limit(3);
    const specialBooks = await Book.find()
      .sort({ rating: -1 })
      .populate("author")
      .limit(5);

    res.status(200).json({
      categories,
      authors,
      newBooks,
      specialBooks,
      //continueReading
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createManyBooks = async (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res
      .status(400)
      .json({ error: "Request body phải là một mảng và không được rỗng" });
  }
  try {
    const newBooks = await Book.insertMany(req.body);
    res.status(201).json(newBooks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getBookDetails = async (req, res) => {
  try {
    const bookId = req.params.id;

    // 1. Lấy thông tin sách và tác giả
    const book = await Book.findById(bookId).populate("author");
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // 2. Lấy danh sách chương (chỉ info, không lấy content)
    const chapters = await Chapter.find({ bookId: bookId })
      .select("title order")
      .sort({ order: 1 });

    res.status(200).json({ ...book.toObject(), chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllBooks = async (req, res) => {
  try {
    const result = await Book.deleteMany({}); // {} nghĩa là "không có điều kiện", xóa tất cả
    res
      .status(200)
      .json({ message: `Đã xóa thành công ${result.deletedCount} sách.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
