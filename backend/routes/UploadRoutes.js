import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Cấu hình nơi lưu ảnh
const storage = multer.diskStorage({
  destination: "uploads/", // Thư mục lưu ảnh
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file
  },
});

const upload = multer({ storage });

// API upload ảnh
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có file nào được tải lên!" });
  }

  const imageUrl = `/uploads/${req.file.filename}`; // Đường dẫn ảnh
  res.json({ imageUrl });
});

export default router;
