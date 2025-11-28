import axios from "axios";
import ChatHistory from "../models/chatHistory.js";

// Helper: Strip HTML tags
const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
};

// Call Gemini API
const callGemini = async (question, context) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY hoặc GOOGLE_API_KEY không được set");
  }

  try {
    const prompt = `Bạn là trợ lý phân tích sách. Trả lời bằng tiếng Việt, ngắn gọn.

Nội dung chương:
${context}

Câu hỏi: ${question}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    }
    throw new Error("Không nhận được response từ Gemini");
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    throw error;
  }
};

// POST /api/ai/chat
export const askAI = async (req, res) => {
  try {
    const { userId, bookId, chapterId, question, context } = req.body;

    if (!question || !context) {
      return res.status(400).json({
        error: "Thiếu question hoặc context",
      });
    }

    const cleanContext = stripHtml(context);
    const truncatedContext =
      cleanContext.length > 8000
        ? cleanContext.substring(0, 8000) + "..."
        : cleanContext;

    console.log(`🤖 AI Chat request - Q: ${question.substring(0, 50)}...`);

    const answer = await callGemini(question, truncatedContext);

    // Lưu vào database
    if (userId && bookId) {
      try {
        await ChatHistory.create({
          userId,
          bookId,
          chapterId,
          question,
          answer,
        });
      } catch (dbError) {
        console.warn("⚠️ DB save failed:", dbError.message);
      }
    }

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("❌ AI Chat Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Lỗi xử lý AI Chat",
    });
  }
};

// POST /api/ai/summarize
export const summarizeChapter = async (req, res) => {
  try {
    const { chapterId, content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Thiếu content" });
    }

    const cleanContent = stripHtml(content);
    const truncatedContent =
      cleanContent.length > 5000
        ? cleanContent.substring(0, 5000) + "..."
        : cleanContent;

    console.log(`📝 Summarize request - Chapter: ${chapterId}`);

    const prompt = `Hãy tóm tắt đoạn văn sau bằng tiếng Việt trong 2-3 câu:\n\n${truncatedContent}`;
    const summary = await callGemini(prompt, "");

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("❌ Summarize Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Lỗi tóm tắt",
    });
  }
};

// ========== GET CHAT HISTORY ==========
export const getChatHistory = async (req, res) => {
  try {
    const { userId, bookId, chapterId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Thiếu userId" });
    }

    // Build query
    const query = { userId };
    if (bookId) query.bookId = bookId;
    if (chapterId) query.chapterId = chapterId;

    const history = await ChatHistory.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      count: history.length,
      history,
    });
  } catch (error) {
    console.error("Lỗi lấy chat history:", error);
    res.status(500).json({
      error: error.message || "Lỗi lấy lịch sử chat",
    });
  }
};

// ========== CLEAR CHAT HISTORY ==========
export const clearChatHistory = async (req, res) => {
  try {
    const { userId, bookId, chapterId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Thiếu userId" });
    }

    // Build query
    const query = { userId };
    if (bookId) query.bookId = bookId;
    if (chapterId) query.chapterId = chapterId;

    const result = await ChatHistory.deleteMany(query);

    res.status(200).json({
      message: `Đã xóa ${result.deletedCount} tin nhắn`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Lỗi xóa chat history:", error);
    res.status(500).json({
      error: error.message || "Lỗi xóa lịch sử chat",
    });
  }
};

// ========== MARK ANSWER AS HELPFUL/UNHELPFUL ==========
export const markHelpful = async (req, res) => {
  try {
    const { chatId, helpful } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: "Thiếu chatId" });
    }

    if (typeof helpful !== "boolean") {
      return res.status(400).json({ error: "helpful phải là true hoặc false" });
    }

    const updated = await ChatHistory.findByIdAndUpdate(
      chatId,
      { helpful },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Không tìm thấy chat" });
    }

    res.status(200).json({
      message: "Đã cập nhật đánh giá",
      chat: updated,
    });
  } catch (error) {
    console.error("Lỗi mark helpful:", error);
    res.status(500).json({
      error: error.message || "Lỗi cập nhật đánh giá",
    });
  }
};

// GET /api/ai/test
export const testAI = async (req, res) => {
  try {
    const testQuestion = "Xin chào, bạn là ai?";
    const result = await callGemini(testQuestion, "");

    res.status(200).json({
      success: true,
      provider: "gemini",
      testResponse: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
