import express from "express";
import multer from "multer";
import { voiceSearch } from "../controller/SpeechController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Lưu file tạm thời

router.post("/voice-search", upload.single("audio"), voiceSearch);

export default router;
