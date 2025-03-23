import express from "express";
import {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  updateUserByAdmin,
  getAllUsers,
  forgotPassword,
  changePassword,
  getUserOrders,
  resetPasswordPage,
  resetPassword,
} from "../controller/UserController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Đăng ký tài khoản
router.post("/register", createUser);

// ✅ Đăng nhập
router.post("/login", loginUser);

// ✅ Lấy thông tin cá nhân (cần xác thực)
router.get("/profile", protect, getUserProfile);

// ✅ Cập nhật hồ sơ cá nhân (cần xác thực)
router.put("/profile", protect, updateUserProfile);

// ✅ Xóa người dùng (Chỉ Admin)
router.delete("/:id", protect, admin, deleteUser);

// ✅ Cập nhật thông tin người dùng (Chỉ Admin)
router.put("/:id", protect, admin, updateUserByAdmin);

// ✅ Lấy danh sách tất cả người dùng (Chỉ Admin)
router.get("/order", protect, getUserOrders);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", resetPasswordPage);
router.post("/reset-password/:token", resetPassword);
router.put("/change-password", protect, changePassword);
router.get("/", protect, admin, getAllUsers);
export default router;
