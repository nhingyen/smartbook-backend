import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// --- IMPORT CÁC ROUTE ---
// import bookRoutes from "./routes/bookRoutes.js";

// Cấu hình để dùng file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- MIDDLEWARE ---
app.use(cors()); // Cho phép tất cả các nguồn gọi API
app.use(express.json()); // Giúp server đọc được JSON từ request

// --- KẾT NỐI MONGODB ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    // Dòng này sẽ thông báo cho bạn biết đã kết nối thành công
    console.log(">>> Đã kết nối thành công tới MongoDB");
  })
  .catch((err) => {
    console.error(">>> Lỗi kết nối MongoDB:", err.message);
  });
