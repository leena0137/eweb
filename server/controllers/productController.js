const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filters, sorting & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { keyword, category, brand, rating, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };

    // Search keyword
    let searchProjection = {};
    if (keyword) {
      query.$text = { $search: keyword };
      searchProjection = { score: { $meta: 'textScore' } };
    }

    // Category filter
    if (category) {
      // Find category by slug or ID
      const cat = await Category.findOne({ $or: [{ slug: category }, { _id: mongoose.Types.ObjectId.isValid(category) ? category : null }] });
      if (cat) {
        query.category = cat._id;
      } else if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      }
    }

    // Brand filter
    if (brand) {
      const brandArray = brand.split(',');
      query.brand = { $in: brandArray.map(b => new RegExp(`^${b.trim()}$`, 'i')) };
    }

    // Rating filter (gte)
    if (rating) {
      query.ratings = { $gte: parseFloat(rating) };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Sorting
    let sortBy = '-createdAt';
    if (sort) {
      if (sort === 'priceAsc') sortBy = 'price';
      else if (sort === 'priceDesc') sortBy = '-price';
      else if (sort === 'rating') sortBy = '-ratings';
      else if (sort === 'newest') sortBy = '-createdAt';
      else if (sort === 'discount') sortBy = '-discount';
    } else if (keyword) {
      sortBy = { score: { $meta: 'textScore' } };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query, searchProjection)
      .populate('category', 'name slug')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
      currentPage: parseInt(page),
      totalProducts,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details by slug or id
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query;

    // Check if ID is a valid ObjectId, otherwise search by slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    } else {
      query = { slug: id };
    }

    const product = await Product.findOne(query).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct product brands
// @route   GET /api/products/brands
// @access  Public
exports.getProductBrands = async (req, res, next) => {
  try {
    const brands = await Product.distinct('brand', { isActive: true });
    res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, highlights, price, mrp, category, brand, images, stock, specifications, isFeatured } = req.body;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Calculate discount % if mrp is provided
    let discount = 0;
    if (mrp && mrp > price) {
      discount = Math.round(((mrp - price) / mrp) * 100);
    }

    const product = await Product.create({
      name,
      slug,
      description,
      highlights: highlights || [],
      price,
      mrp: mrp || price,
      discount,
      category,
      brand,
      images: images || ['https://via.placeholder.com/400x400?text=Product+Image'],
      stock: stock || 0,
      specifications: specifications || [],
      isFeatured: isFeatured || false,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Recalculate discount percentage if price/mrp changes
    if (req.body.price !== undefined || req.body.mrp !== undefined) {
      const price = req.body.price !== undefined ? req.body.price : product.price;
      const mrp = req.body.mrp !== undefined ? req.body.mrp : product.mrp;
      if (mrp && mrp > price) {
        req.body.discount = Math.round(((mrp - price) / mrp) * 100);
      } else {
        req.body.discount = 0;
      }
    }

    // Generate slug if name changes
    if (req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
