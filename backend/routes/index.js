import express from "express";
import userRouter from "./UserRoutes.js"; // ✅ Đảm bảo file tồn tại

const routes = express.Router();

routes.use(express.json()); // ✅ Middleware để đọc JSON từ body request
routes.use("/users", userRouter); // ✅ Định tuyến đến UserRoutes

export default routes;
