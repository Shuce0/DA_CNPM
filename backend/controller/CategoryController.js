import asyncHandler from "express-async-handler";
import Category from "../models/CategoryModel.js";

// ✅ Lấy danh sách danh mục
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// ✅ Lấy chi tiết 1 danh mục
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: "Danh mục không tồn tại" });
  }
});

// ✅ Tạo danh mục (Chỉ Admin)
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400).json({ message: "Danh mục đã tồn tại!" });
    return;
  }

  const category = new Category({ name, description, image });
  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// ✅ Cập nhật danh mục (Chỉ Admin)
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name || category.name;
    category.description = description || category.description;
    category.image = image || category.image;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404).json({ message: "Danh mục không tồn tại" });
  }
});

// ✅ Xóa danh mục (Chỉ Admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.deleteOne();
    res.json({ message: "Danh mục đã được xóa" });
  } else {
    res.status(404).json({ message: "Danh mục không tồn tại" });
  }
});
