import express from "express";
const router = express.Router();

// Import controllers
// (Tự import bookCtrl khi bạn tạo nó)
// import * as bookCtrl from '../controllers/bookController.js';
import * as authorCtrl from "../controllers/authorController.js";
import * as bookCtrl from "../controllers/bookController.js";
import * as categoryCtrl from "../controllers/categoryController.js";
import * as chapterCtrl from "../controllers/chapterController.js";

// === API CHO SÁCH ===
router.get("/home", bookCtrl.getHomeData);
router.get("/books/:id", bookCtrl.getBookDetails);
// Khi nhận 'POST' đến URL '/api/books', gọi hàm 'createBook'
router.post("/books", bookCtrl.createBook);

// === API CHO TÁC GIẢ ===
// GET /api/authors
router.get("/authors", authorCtrl.getAllAuthors);
// POST /api/authors
router.post("/authors", authorCtrl.createManyAuthors);
router.delete("/authors/:id", authorCtrl.deleteAuthor);

// === API THỂ LOẠI (CATEGORY) ===
router.get("/categories", categoryCtrl.getAllCategories);
router.post("/categories", categoryCtrl.createManyCategories);

// === API CHƯƠNG (CHAPTER) ===
router.post("/chapters", chapterCtrl.createChapter);
router.get("/chapters/:id", chapterCtrl.getChaptersByBook);

// Phải export default
export default router;
