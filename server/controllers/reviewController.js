const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create/Update review for a product
// @route   POST /api/reviews/:productId
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const { productId } = req.params;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required.',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    let review = await Review.findOne({ user: req.user.id, product: productId });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.title = title || '';
      review.comment = comment;
      await review.save();
      
      // Re-calculate average rating for product
      await Review.calcAverageRating(productId);

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully.',
        data: review,
      });
    }

    // Create new review
    review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      title: title || '',
      comment,
    });

    // Re-calculate average rating for product
    await Review.calcAverageRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review.',
      });
    }

    const productId = review.product;
    await review.deleteOne();

    // Re-calculate average rating for product
    await Review.calcAverageRating(productId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
