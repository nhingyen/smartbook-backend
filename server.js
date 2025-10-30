import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// --- IMPORT CÁC ROUTE ---
import bookRoutes from "./routes/api.js";

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

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📡 Đang lắng nghe trên tất cả các IP (0.0.0.0)`); // Thêm dòng này để báo
    });
  })
  .catch((err) => {
    console.error(">>> Lỗi kết nối MongoDB:", err.message);
  });

// --- API ROUTES ---
// Bảo server: "Tất cả request đến '/api/books' hãy đưa cho bookRoutes xử lý"
app.use("/api", bookRoutes);

// Route cơ bản để test
app.get("/", (req, res) => {
  res.send("Chào mừng đến với SmartBook Backend API!");
});
