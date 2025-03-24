import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  addReview,
  getReviews,
} from "../controller/ProductController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
// ✅ Cấu hình multer để lưu ảnh
const storage = multer.diskStorage({
  destination: "uploads/", // Thư mục lưu ảnh
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file ngẫu nhiên
  },
});

const upload = multer({ storage });
const router = express.Router();

//router.get("/", getAllProducts); // Lấy danh sách sản phẩm
router.get("/:id", upload.single("image"), getProductById); // Lấy sản phẩm theo ID
router.post("/", protect, admin, upload.single("image"), createProduct); // Thêm sản phẩm (Admin)
router.put("/:id", upload.single("image"), protect, admin, updateProduct); // Cập nhật sản phẩm (Admin)
router.delete("/:id", protect, admin, deleteProduct); // Xóa sản phẩm (Admin)
router.get("/", upload.single("image"), getProducts);
router.post("/:id/reviews", protect, addReview); // Thêm đánh giá (cần đăng nhập)
router.get("/:id/reviews", getReviews); // Lấy danh sách đánh giá
export default router;
