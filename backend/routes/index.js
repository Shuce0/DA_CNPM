import express from "express";
import userRouter from "./UserRoutes.js";
import productRouter from "./ProductRoutes.js"; // Import thêm nếu cần
import orderRouter from "./OrderRoutes.js"; // Import thêm nếu cần
import cartRoutes from "./CartRoutes.js";
import categoryRoutes from "./CategoryRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import voiceRoutes from "./SpeechRoutes.js"; // Import route tìm kiếm giọng nói
import uploadRouter from "./UploadRoutes.js"; // ✅ Import API upload ảnh
const routes = express.Router();

routes.use("/users", userRouter); // ✅ Định tuyến người dùng
routes.use("/products", productRouter); // ✅ Định tuyến sản phẩm
routes.use("/orders", orderRouter); // ✅ Định tuyến đơn hàng
routes.use("/cart", cartRoutes); // ✅ Thêm route giỏ hàng
routes.use("/categories", categoryRoutes); // ✅ Thêm route danh mục
routes.use("/payments", paymentRoutes); // ✅ Thêm route thanh toán
routes.use("/voice", voiceRoutes); // ✅ Thêm route tìm kiếm giọng nói
routes.use("/upload", uploadRouter); // ✅ Thêm route upload ảnh
export default routes;
