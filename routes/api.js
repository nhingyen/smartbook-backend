import express from "express";
const router = express.Router();

// Import controllers
// (Tự import bookCtrl khi bạn tạo nó)
// import * as bookCtrl from '../controllers/bookController.js';
import * as authorCtrl from "../controllers/authorController.js";
import * as bookCtrl from "../controllers/bookController.js";
import * as categoryCtrl from "../controllers/categoryController.js";
import * as chapterCtrl from "../controllers/chapterController.js";
import * as progressCtrl from "../controllers/progressController.js";
import * as libCtrl from "../controllers/libraryController.js";
import * as userCtrl from "../controllers/userController.js";

// === API CHO HOME ===
router.get("/home", bookCtrl.getHomeData);

// === API CHO SÁCH ===

// API Tìm kiếm (Đặt trước các route có :id để tránh nhầm lẫn)
router.get("/books/search", bookCtrl.searchBooks);
router.get("/books", bookCtrl.getAllBooks);
router.get("/books/:id", bookCtrl.getBookDetails);
// Khi nhận 'POST' đến URL '/api/book', gọi hàm 'createBook'
router.post("/book/", bookCtrl.createBook);
router.post("/books", bookCtrl.createManyBooks);
router.delete("/books", bookCtrl.deleteAllBooks);

// === API CHO TÁC GIẢ ===
// GET /api/authors
router.get("/authors", authorCtrl.getAllAuthors);
router.get("/authors/:id", authorCtrl.getAuthorDetail);
// POST /api/authors
router.post("/authors", authorCtrl.createManyAuthors);
router.post("/author", authorCtrl.createAuthor);
router.delete("/authors/:id", authorCtrl.deleteAuthor);

// === API THỂ LOẠI (CATEGORY) ===
router.get("/categories", categoryCtrl.getAllCategories);
router.post("/categories", categoryCtrl.createManyCategories);

// === API CHƯƠNG (CHAPTER) ===
router.post("/chapter", chapterCtrl.createChapter);
router.post("/chapters", chapterCtrl.createManyChapters);
router.get("/chapters/:id", chapterCtrl.getChapterContent);
router.delete("/chapters", chapterCtrl.deleteAllChapters);

// === API TIẾN ĐỘ ĐỌC ===
router.post("/progress", progressCtrl.saveProgress); // Lưu
router.get("/progress", progressCtrl.getReadingList); // Lấy danh sách

// === API LƯU THƯ VIỆN ===
router.post("/library/toggle", libCtrl.toggleLibrary);
router.get("/library", libCtrl.getLibrary);
router.get("/library/check", libCtrl.checkStatus);

// === API LƯU STATS ===
router.post("/users/stats", userCtrl.updateReadingStats);

router.get("/users/:userId", userCtrl.getUserProfile);

// Phải export default
export default router;
