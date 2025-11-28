import express from "express";
import * as aiChatCtrl from "../controllers/aiChatController.js";

const router = express.Router();

// ========== API AI CHAT ==========
router.post("/chat", aiChatCtrl.askAI);
router.post("/summarize", aiChatCtrl.summarizeChapter);
router.get("/chat-history", aiChatCtrl.getChatHistory);
router.post("/chat-history/clear", aiChatCtrl.clearChatHistory);
router.post("/chat/mark-helpful", aiChatCtrl.markHelpful);
router.get("/test", aiChatCtrl.testAI);

export default router;
