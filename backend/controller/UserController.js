import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import Order from "../models/OrderModel.js";
import crypto from "crypto";
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, isAdmin } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Băm mật khẩu trước khi lưu vào database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo Access Token & Refresh Token (KHÔNG lưu vào .env, chỉ lấy secret từ đó)
    const accessToken = jwt.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET, // 🔐 Lấy secret từ .env
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { email },
      process.env.REFRESH_TOKEN_SECRET, // 🔐 Lấy secret từ .env
      { expiresIn: "7d" }
    );

    // Tạo người dùng mới và lưu token vào DB
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      isAdmin: isAdmin || false,
      access_token: accessToken, // ✅ Lưu token vào database
      refresh_token: refreshToken, // ✅ Lưu token vào database
    });

    await newUser.save();

    res.status(201).json({
      message: "Tạo tài khoản thành công!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        isAdmin: newUser.isAdmin,
        access_token: newUser.access_token, // ✅ Trả về access_token
        refresh_token: newUser.refresh_token, // ✅ Trả về refresh_token
      },
    });
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};
// 🔹 2. Đăng nhập người dùng
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra tài khoản có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại!" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không đúng!" });
    }

    // Tạo Token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Trả về thông tin cơ bản của user (ẩn mật khẩu)
    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

// 🔹 3. Lấy thông tin người dùng
export const getUserProfile = async (req, res) => {
  try {
    // Kiểm tra xem req.userId có tồn tại không
    if (!req.user) {
      return res.status(401).json({ message: "Không có quyền truy cập!" });
    }

    // Tìm người dùng theo ID, loại bỏ password
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

// 🔹 4. Cập nhật thông tin người dùng
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();
    res.status(200).json({ message: "Cập nhật thành công!", user });
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

// 🔹 5. Xóa người dùng (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "Xóa người dùng thành công!" });
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

// 🔹 6. Cập nhật thông tin người dùng (Admin)
export const updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.isAdmin =
      req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

    await user.save();
    res.status(200).json({ message: "Cập nhật thành công!", user });
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

// 🔹 7. Lấy danh sách tất cả người dùng (Admin)
export const getAllUsers = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "orderItems.product"
    );

    if (!orders.length) {
      return res.status(404).json({ message: "Không có đơn hàng nào!" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy email!" });
    }

    // ✅ Tạo token reset password
    const resetToken = crypto.randomBytes(32).toString("hex");

    // ✅ Lưu token vào DB với thời gian hết hạn là 15 phút
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();

    // ✅ Tạo link reset password
    const resetURL = `http://localhost:5000/users/reset-password/${resetToken}`;

    // ✅ Gửi email
    await sendEmail(
      user.email,
      "Đặt lại mật khẩu",
      `Nhấp vào đây để đặt lại mật khẩu: ${resetURL}`
    );

    res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// ✅ 2. Hiển thị trang nhập mật khẩu mới (Chỉ để test)
export const resetPasswordPage = (req, res) => {
  res.send(`<h2>Nhập mật khẩu mới</h2>
            <form action="/api/auth/reset-password/${req.params.token}" method="POST">
              <input type="password" name="password" placeholder="Mật khẩu mới" required />
              <button type="submit">Đổi mật khẩu</button>
            </form>`);
};

// ✅ 3. Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Tìm user có token hợp lệ
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Kiểm tra token còn hạn
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    // Băm mật khẩu mới
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được cập nhật!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // ✅ Tìm user theo reset token và kiểm tra thời gian hết hạn
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }, // Kiểm tra hạn token
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    // ✅ Hash mật khẩu mới
    user.password = await bcrypt.hash(newPassword, 10);

    // ✅ Xóa token reset sau khi đổi mật khẩu thành công
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};
//netstat -ano | findstr :5000
//taskkill /PID 9172 /F
