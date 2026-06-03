const fs = require('fs');

const categories = [
  'Mobiles', 'Electronics', 'Fashion', 'Home & Kitchen', 
  'Appliances', 'Books', 'Sports', 'Beauty'
];

const categoryTemplates = {
  'Mobiles': { brands: ['Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'Google', 'Vivo', 'Oppo', 'Realme'], keyword: 'smartphone', nameTemplate: 'Smartphone %d', basePrice: 15000, maxPrice: 100000 },
  'Electronics': { brands: ['Sony', 'Bose', 'Logitech', 'JBL', 'Dell', 'HP', 'Asus', 'Acer'], keyword: 'gadget', nameTemplate: 'Electronic Gadget %d', basePrice: 2000, maxPrice: 50000 },
  'Fashion': { brands: ['Nike', 'Adidas', 'Puma', 'Levis', 'Zara', 'H&M', 'Gucci', 'Calvin Klein'], keyword: 'fashion', nameTemplate: 'Premium Apparel %d', basePrice: 500, maxPrice: 5000 },
  'Home & Kitchen': { brands: ['Philips', 'Prestige', 'Pigeon', 'Milton', 'Bajaj', 'Havells', 'Tupperware', 'Cello'], keyword: 'kitchen', nameTemplate: 'Kitchen Appliance %d', basePrice: 800, maxPrice: 15000 },
  'Appliances': { brands: ['LG', 'Samsung', 'Whirlpool', 'Bosch', 'IFB', 'Godrej', 'Haier', 'Voltas'], keyword: 'appliance', nameTemplate: 'Home Appliance %d', basePrice: 10000, maxPrice: 80000 },
  'Books': { brands: ['Penguin', 'HarperCollins', 'Random House', 'Simon & Schuster', 'Macmillan'], keyword: 'book', nameTemplate: 'Bestseller Book %d', basePrice: 150, maxPrice: 2000 },
  'Sports': { brands: ['Nivia', 'Yonex', 'Cosco', 'Spalding', 'Wilson', 'Decathlon', 'Kipsta', 'Domyos'], keyword: 'sports', nameTemplate: 'Sports Equipment %d', basePrice: 300, maxPrice: 10000 },
  'Beauty': { brands: ['L\'Oreal', 'Maybelline', 'Lakme', 'MAC', 'Clinique', 'Nykaa', 'Plum', 'Biotique'], keyword: 'makeup', nameTemplate: 'Beauty Product %d', basePrice: 200, maxPrice: 3000 },
};

let productsStr = '';

categories.forEach((cat, catIdx) => {
  productsStr += `\n    // ${cat}\n`;
  const template = categoryTemplates[cat];
  for (let i = 1; i <= 11; i++) {
    const brand = template.brands[Math.floor(Math.random() * template.brands.length)];
    const price = Math.floor(Math.random() * (template.maxPrice - template.basePrice) + template.basePrice);
    const mrp = Math.floor(price * (1 + (Math.random() * 0.5)));
    const discount = Math.round(((mrp - price) / mrp) * 100);
    const stock = Math.floor(Math.random() * 100) + 10;
    const ratings = (Math.random() * 2 + 3).toFixed(1);
    const reviews = Math.floor(Math.random() * 500);
    const isFeatured = Math.random() > 0.8;
    
    // Unique lock ID across all products so images don't duplicate
    const uniqueLock = (catIdx * 11) + i; 
    
    const safeBrand = brand.replace(/'/g, "\\'");
    productsStr += `    {
      name: '${safeBrand} ${template.nameTemplate.replace('%d', i)}',
      slug: '${brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${template.nameTemplate.toLowerCase().replace('%d', i).replace(/[^a-z0-9]/g, '-')}-${i}',
      description: 'High-quality ${cat.toLowerCase()} product by ${safeBrand}. Experience the best in class features and durability.',
      highlights: ['Premium Quality', 'Durable Material', '1 Year Warranty', 'Best in class'],
      price: ${price},
      mrp: ${mrp},
      discount: ${discount},
      category: catMap['${cat}'],
      brand: '${safeBrand}',
      images: ['https://loremflickr.com/500/500/${template.keyword}?lock=${uniqueLock}'],
      stock: ${stock},
      ratings: ${ratings},
      numReviews: ${reviews},
      specifications: [
        { key: 'Material/Type', value: 'Standard' },
        { key: 'Color', value: 'Assorted' },
      ],
      isFeatured: ${isFeatured},
    },\n`;
  }
});

const fileContent = `const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Review = require('../models/Review');

dotenv.config();

const categoriesData = [
  { name: 'Electronics', slug: 'electronics', icon: 'FaLaptop', description: 'Computers, laptops, headphones, speakers, and more.' },
  { name: 'Mobiles', slug: 'mobiles', icon: 'FaMobileAlt', description: 'Smartphones, tablets, and accessories.' },
  { name: 'Fashion', slug: 'fashion', icon: 'FaTshirt', description: 'Men, women, and kids clothing and accessories.' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: 'FaHome', description: 'Furniture, kitchenware, decor, and home essentials.' },
  { name: 'Appliances', slug: 'appliances', icon: 'FaTv', description: 'Televisions, refrigerators, washing machines, and air conditioners.' },
  { name: 'Books', slug: 'books', icon: 'FaBook', description: 'Fiction, non-fiction, educational, and literature.' },
  { name: 'Sports', slug: 'sports', icon: 'FaRunning', description: 'Fitness gear, sportswear, and outdoor sports equipment.' },
  { name: 'Beauty', slug: 'beauty', icon: 'FaSparkles', description: 'Skincare, makeup, hair care, and fragrances.' },
];

const couponsData = [
  {
    code: 'WELCOME10',
    description: 'Get 10% off on your first order. Minimum purchase ₹500.',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscount: 200,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    usageLimit: 1000,
    isActive: true,
  },
  {
    code: 'FLAT200',
    description: 'Flat ₹200 off on order value above ₹1,500.',
    discountType: 'fixed',
    discountValue: 200,
    minOrderAmount: 1500,
    maxDiscount: 200,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
    usageLimit: 500,
    isActive: true,
  },
  {
    code: 'SUPER25',
    description: 'Get 25% off on your purchases. Maximum discount ₹500. Minimum purchase ₹2,000.',
    discountType: 'percentage',
    discountValue: 25,
    minOrderAmount: 2000,
    maxDiscount: 500,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
    usageLimit: 200,
    isActive: true,
  },
];

const getProductsData = (categories) => {
  const catMap = {};
  categories.forEach(c => {
    catMap[c.name] = c._id;
  });

  return [${productsStr}  ];
};

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB database to seed...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/indiacart24');
    console.log('Connected! Clearing existing data collections...');

    // Clear existing
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Review.deleteMany();

    console.log('Collections cleared. Seeding default Admin and Users...');

    // Create Admin User
    const adminUser = new User({
      name: 'Indiacart24 Admin',
      email: 'admin@indiacart24.com',
      password: 'Admin@123', // Will be hashed pre-save
      phone: '9876543210',
      role: 'admin',
      addresses: [
        {
          fullName: 'Indiacart24 HQ',
          phone: '9876543210',
          addressLine1: 'B-Wing, Tech Park, Outer Ring Road',
          addressLine2: 'Sector 4',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560103',
          country: 'India',
          isDefault: true,
        }
      ]
    });
    await adminUser.save();

    // Create Normal User
    const normalUser = new User({
      name: 'Rohan Sharma',
      email: 'user@indiacart24.com',
      password: 'User@123',
      phone: '9876543211',
      role: 'user',
      addresses: [
        {
          fullName: 'Rohan Sharma',
          phone: '9876543211',
          addressLine1: 'Flat 402, Sunshine Heights',
          addressLine2: 'Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400053',
          country: 'India',
          isDefault: true,
        }
      ]
    });
    await normalUser.save();

    console.log('Seeding categories...');
    const seededCategories = await Category.insertMany(categoriesData);
    console.log(\`Seeded \${seededCategories.length} categories.\`);

    console.log('Seeding products...');
    const productsData = getProductsData(seededCategories);
    const seededProducts = await Product.insertMany(productsData);
    console.log(\`Seeded \${seededProducts.length} products.\`);

    console.log('Seeding coupons...');
    const seededCoupons = await Coupon.insertMany(couponsData);
    console.log(\`Seeded \${seededCoupons.length} discount coupons.\`);

    console.log('==================================================');
    console.log('Indiacart24 Database seeding completed successfully! 🎉');
    console.log(\`- Admin Account: admin@indiacart24.com / Admin@123\`);
    console.log(\`- User Account:  user@indiacart24.com / User@123\`);
    console.log('==================================================');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
};

seedDB();
`;

fs.writeFileSync('c:/Users/Kathan Mistry/Downloads/eweb/server/utils/seedData.js', fileContent);
console.log('Successfully generated seedData.js with 88 products!');
