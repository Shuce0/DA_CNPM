import express from "express";
import userRouter from "./UserRoutes.js";
import productRouter from "./ProductRoutes.js"; // Import thêm nếu cần
import orderRouter from "./OrderRoutes.js"; // Import thêm nếu cần
const routes = express.Router();

routes.use("/users", userRouter); // ✅ Định tuyến người dùng
routes.use("/products", productRouter); // ✅ Định tuyến sản phẩm
routes.use("/orders", orderRouter); // ✅ Định tuyến đơn hàng
export default routes;
