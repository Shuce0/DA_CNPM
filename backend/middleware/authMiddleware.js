import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

// ✅ Middleware kiểm tra đăng nhập
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Kiểm tra xem user có tồn tại không
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Người dùng không tồn tại!" });
      }

      req.user = user; // Gán user vào request
      next();
    } catch (error) {
      console.error("Lỗi khi xác thực token:", error);
      return res
        .status(401)
        .json({ message: "Không có quyền truy cập, Token không hợp lệ!" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Không có quyền truy cập, Token không tồn tại!" });
  }
};

// ✅ Middleware kiểm tra quyền Admin
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
  }
};
