import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Cấu hình nơi lưu ảnh
const storage = multer.diskStorage({
  destination: "uploads/", // Lưu vào thư mục uploads/
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file ngẫu nhiên
  },
});

const upload = multer({ storage });

// API Upload ảnh
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có file nào được tải lên!" });
  }

  const imageUrl = `/uploads/${req.file.filename}`; // URL ảnh
  res.json({ imageUrl });
});

export default router;
