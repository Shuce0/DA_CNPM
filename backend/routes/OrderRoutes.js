import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
} from "../controller/OrderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder); // Người dùng đặt hàng
router.get("/", protect, admin, getAllOrders); // Admin lấy danh sách đơn hàng
router.get("/:id", protect, getOrderById); // Người dùng lấy chi tiết đơn hàng
router.put("/:id/pay", protect, updateOrderToPaid); // Thanh toán đơn hàng
router.put("/:id/deliver", protect, admin, updateOrderToDelivered); // Giao hàng (Admin)

export default router;
