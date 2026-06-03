const Wishlist = require('../models/Wishlist');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: 'products',
      select: 'name price mrp discount images stock brand slug ratings numReviews',
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in wishlist (Add/Remove)
// @route   POST /api/wishlist/:productId
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    const isAdded = wishlist.products.includes(productId);

    if (isAdded) {
      // Remove
      wishlist.products.pull(productId);
      await wishlist.save();
      
      res.status(200).json({
        success: true,
        message: 'Product removed from wishlist.',
        isWishlisted: false,
      });
    } else {
      // Add
      wishlist.products.push(productId);
      await wishlist.save();
      
      res.status(200).json({
        success: true,
        message: 'Product added to wishlist.',
        isWishlisted: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products.pull(productId);
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'name price mrp discount images stock brand slug ratings numReviews',
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
      data: populatedWishlist,
    });
  } catch (error) {
    next(error);
  }
};
