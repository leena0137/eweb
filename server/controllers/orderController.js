const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, paymentInfo, discount = 0, couponApplied } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided.',
      });
    }

    // Verify stock and fetch prices
    let itemsPrice = 0;
    const finalItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found with ID: ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}. Only ${product.stock} items left.`,
        });
      }

      // Add to snapshot
      finalItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: item.quantity,
      });

      itemsPrice += product.price * item.quantity;
    }

    // Calculate fees
    const shippingPrice = itemsPrice >= 500 ? 0 : 40;
    const taxPrice = 0; // Flat 0% for simplicity
    const totalPrice = itemsPrice + shippingPrice + taxPrice - discount;

    // Create the order
    const order = await Order.create({
      user: req.user.id,
      orderItems: finalItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        transactionId: paymentInfo?.transactionId || `TXN-${Date.now()}`,
        status: paymentMethod === 'COD' ? 'pending' : 'completed',
        paidAt: paymentMethod === 'COD' ? null : new Date(),
      },
      itemsPrice,
      shippingPrice,
      taxPrice,
      discount,
      totalPrice,
      couponApplied: couponApplied || null,
      orderStatus: 'Processing',
    });

    // Update product stock and sold count
    for (const item of finalItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    // Increment coupon used count if applied
    if (couponApplied) {
      await Coupon.findByIdAndUpdate(couponApplied, {
        $inc: { usedCount: 1 },
        $push: { usedBy: req.user.id },
      });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! 🎉',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Check ownership or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order.',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order.',
      });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled as it is already ${order.orderStatus.toLowerCase()}.`,
      });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    // Restock the products
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all orders
// @route   GET /api/orders/all
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(totalOrders / parseInt(limit)),
      currentPage: parseInt(page),
      totalOrders,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order has already been delivered.',
      });
    }

    order.orderStatus = orderStatus;
    
    if (trackingId) {
      order.trackingId = trackingId;
    }

    if (orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = 'completed'; // Mark paid if COD
      order.paymentInfo.paidAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to: ${orderStatus}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
