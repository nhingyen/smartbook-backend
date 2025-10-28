import Book from "../models/book.js";
import Author from "../models/author.js";
// import Category from "../models/category.js";
import Chapter from "../models/chapter.js";

// API cho Home Screen
export const getHomeData = async (req, res) => {
  try {
    const categories = await Category.find().limit(6);
    const authors = await Author.find().limit(6);
    const newBooks = await Book.find()
      .sort({ createdAt: -1 })
      .populate("author")
      .limit(5);
    const specialBooks = await Book.find({ rating: -1 })
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

export const getBookDetails = async (req, res) => {
  try {
    const bookId = req.params.id;

    // 1. Lấy thông tin sách và tác giả
    const book = await Book.findById(bookId).populate("author");
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // 2. Lấy danh sách chương (chỉ info, không lấy content)
    const chapters = await Chapter.find({ book: bookId })
      .select("title order")
      .sort({ order: 1 });

    res.status(200).json({ ...book.toObject(), chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
