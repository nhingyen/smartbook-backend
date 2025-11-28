import axios from "axios";

export const synthesizeSpeech = async (req, res) => {
  try {
    const { text } = req.body;

    // Lấy Key từ file .env
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!text) {
      return res.status(400).json({ message: "Thiếu nội dung text" });
    }

    if (!apiKey) {
      return res
        .status(500)
        .json({ message: "Server chưa cấu hình Google API Key" });
    }

    // Đường dẫn REST API của Google
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    // Cấu hình dữ liệu gửi đi
    const payload = {
      input: { text: text },
      voice: {
        languageCode: "vi-VN",
        name: "vi-VN-Wavenet-A", // Giọng nữ cao cấp (Nghe rất thật)
        // Hoặc: "vi-VN-Wavenet-B" (Giọng nam)
      },
      audioConfig: { audioEncoding: "MP3" },
    };

    // Gọi sang Google
    const response = await axios.post(url, payload);

    // Google trả về: { "audioContent": "chuỗi_base64_rất_dài..." }
    // Ta trả nguyên cái đó về cho App
    res.status(200).json({ audioContent: response.data.audioContent });
  } catch (error) {
    console.error("Lỗi TTS:", error.response?.data || error.message);
    res.status(500).json({
      message: error.response?.data?.error?.message || "Lỗi tạo âm thanh",
    });
  }
};
