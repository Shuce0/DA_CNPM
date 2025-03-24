import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json()); // ✅ Middleware JSON
app.use(express.urlencoded({ extended: true })); // Xử lý dữ liệu form
app.use("/uploads", express.static("uploads")); // Cho phép truy cập ảnh đã upload
app.use("/api", routes); // ✅ Gọi routes

app.get("/", (req, res) => {
  res.send("Chào mừng bạn đến với API của tôi!");
});
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
