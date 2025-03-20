import Product from "../models/ProductModel.js";

// 🔹 1. Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🔹 2. Lấy sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🔹 3. Thêm sản phẩm (Admin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      type,
      category,
      rating,
      countInStock,
      description,
    } = req.body;

    const product = new Product({
      name,
      price,
      image,
      type,
      category,
      rating,
      countInStock,
      description,
    });

    const savedProduct = await product.save();
    res.status(201).json({
      message: "Sản phẩm đã được thêm thành công!",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🔹 4. Cập nhật sản phẩm (Admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.status(201).json({
      message: "Sản phẩm đã được cập nhật thành công!",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// 🔹 5. Xóa sản phẩm (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }
    res.status(200).json({ message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};
