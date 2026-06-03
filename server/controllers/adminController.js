const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard stats (Total revenue, sales, customer counts, chart data)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // 1. Core Summary Cards
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // Calculate total revenue
    const completedOrders = await Order.find({
      'paymentInfo.status': 'completed',
      orderStatus: { $ne: 'Cancelled' },
    });

    const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // 2. Recent Orders (limit 5)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5);

    // 3. Simple Chart Data - Group Sales by Month (Last 6 Months)
    const monthlySales = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Initialize 6 months in object
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = `${months[d.getMonth()]} ${d.getFullYear().toString().substr(2)}`;
      monthlySales[label] = 0;
    }

    // Accumulate actual orders in date range
    const ordersInPeriod = await Order.find({
      createdAt: { $gte: sixMonthsAgo },
      orderStatus: { $ne: 'Cancelled' },
    });

    ordersInPeriod.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const label = `${months[orderDate.getMonth()]} ${orderDate.getFullYear().toString().substr(2)}`;
      if (monthlySales[label] !== undefined) {
        monthlySales[label] += order.totalPrice;
      }
    });

    // Format for charts
    const chartData = Object.keys(monthlySales)
      .reverse()
      .map(key => ({
        month: key,
        sales: Math.round(monthlySales[key]),
      }));

    // 4. Order Status Breakdown
    const processingCount = await Order.countDocuments({ orderStatus: 'Processing' });
    const shippedCount = await Order.countDocuments({ orderStatus: 'Shipped' });
    const deliveredCount = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledCount = await Order.countDocuments({ orderStatus: 'Cancelled' });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
        },
        chartData,
        orderStatusBreakdown: {
          processing: processingCount,
          shipped: shippedCount,
          delivered: deliveredCount,
          cancelled: cancelledCount,
        },
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer list with total spending
// @route   GET /api/admin/customers
// @access  Private/Admin
exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'user' }).sort('-createdAt');

    // Aggregate user orders and spending
    const customersWithStats = [];

    for (const customer of customers) {
      const userOrders = await Order.find({ user: customer._id });
      const totalSpent = userOrders
        .filter(o => o.orderStatus !== 'Cancelled')
        .reduce((sum, o) => sum + o.totalPrice, 0);

      customersWithStats.push({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar,
        orderCount: userOrders.length,
        totalSpent: Math.round(totalSpent),
        createdAt: customer.createdAt,
      });
    }

    res.status(200).json({
      success: true,
      data: customersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get filterable sales report
// @route   GET /api/admin/sales-report
// @access  Private/Admin
exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { orderStatus: { $ne: 'Cancelled' } };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query).populate('user', 'name email').sort('-createdAt');

    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalDiscountGiven = orders.reduce((sum, order) => sum + (order.discount || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        totalOrders: orders.length,
        totalDiscountGiven,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};
