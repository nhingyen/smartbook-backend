import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!text) {
      return res
        .status(400)
        .json({ message: "Vui lòng gửi nội dung cần tóm tắt" });
    }

    if (!apiKey) {
      return res.status(500).json({ message: "Chưa cấu hình GEMINI_API_KEY" });
    }

    // Cấu hình Prompt
    const prompt = `Tóm tắt ngắn gọn nội dung sau bằng tiếng Việt (khoảng 3 gạch đầu dòng): \n\n${text}`;

    // Đường dẫn API trực tiếp của Google (Dùng model gemini-1.5-flash)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Cấu trúc Body gửi đi (Bắt buộc theo format của Gemini)
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    // Gọi axios
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });

    // Lấy kết quả từ JSON trả về
    // Cấu trúc trả về: candidates[0].content.parts[0].text
    const summary = response.data.candidates[0].content.parts[0].text;

    res.status(200).json({ summary: summary });
  } catch (error) {
    // In lỗi chi tiết ra console để dễ debug
    console.error("Lỗi Gemini:", error.response?.data || error.message);

    res.status(500).json({
      message:
        "Lỗi AI: " + (error.response?.data?.error?.message || error.message),
    });
  }
};
