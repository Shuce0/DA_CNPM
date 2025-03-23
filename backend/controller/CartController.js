import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";
import Order from "../models/OrderModel.js";

// ✅ Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  try {
    const { productId, amount } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, cartItems: [] });
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].amount += amount;
    } else {
      cart.cartItems.push({
        product: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        amount,
      });
    }

    await cart.save();
    res.status(200).json({ message: "Đã thêm vào giỏ hàng!", cart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// ✅ Lấy giỏ hàng
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product",
      "name image price"
    );

    if (!cart || cart.cartItems.length === 0) {
      return res.status(404).json({ message: "Giỏ hàng trống!" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// ✅ Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng trống!" });
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng!", cart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// ✅ Thanh toán và tạo đơn hàng
export const checkout = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "cartItems.product",
      "name image price"
    );

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    const itemsPrice = cart.cartItems.reduce(
      (acc, item) => acc + item.price * item.amount,
      0
    );
    const shippingPrice = 30000; // Phí vận chuyển cố định
    const taxPrice = itemsPrice * 0.1; // Thuế 10%
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = new Order({
      user: userId,
      orderItems: cart.cartItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: false,
    });

    await order.save();
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({ message: "Đơn hàng đã được tạo!", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};
