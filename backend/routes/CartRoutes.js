import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  checkout,
} from "../controller/CartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart); // ✅ Thêm vào giỏ hàng
router.get("/", protect, getCart); // ✅ Xem giỏ hàng
router.delete("/:productId", protect, removeFromCart); // ✅ Xóa sản phẩm
router.put("/update", protect, updateCartItem); //
router.post("/checkout", protect, checkout); //
export default router;
