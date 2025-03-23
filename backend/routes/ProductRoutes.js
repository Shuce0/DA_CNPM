import express from "express";
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

const router = express.Router();

//router.get("/", getAllProducts); // Lấy danh sách sản phẩm
router.get("/:id", getProductById); // Lấy sản phẩm theo ID
router.post("/", protect, admin, createProduct); // Thêm sản phẩm (Admin)
router.put("/:id", protect, admin, updateProduct); // Cập nhật sản phẩm (Admin)
router.delete("/:id", protect, admin, deleteProduct); // Xóa sản phẩm (Admin)
router.get("/", getProducts);
router.post("/:id/reviews", protect, addReview); // Thêm đánh giá (cần đăng nhập)
router.get("/:id/reviews", getReviews); // Lấy danh sách đánh giá
export default router;
