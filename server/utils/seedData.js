const mongoose = require('mongoose');
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

  return [
    // =========================================================================
    // CATEGORY: Mobiles (11 Products)
    // =========================================================================
    {
      name: 'Apple iPhone 15 Pro',
      slug: 'apple-iphone-15-pro',
      description: 'Experience the future of mobile innovation with the Apple iPhone 15 Pro. Featuring a strong and lightweight aerospace-grade titanium design with contoured edges. Powered by the groundbreaking A17 Pro chip for next-level gaming and performance. The pro-class camera system includes 7 pro lenses and a 48MP main camera capturing spectacular detail. Complete with USB-C, Action button, and all-day battery life.',
      highlights: ['Aerospace-grade Titanium design', 'Groundbreaking A17 Pro chip', 'Advanced 48MP Main camera', 'Superfast USB-C connectivity'],
      price: 129900,
      mrp: 134900,
      category: catMap['Mobiles'],
      brand: 'Apple',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600'],
      stock: 45,
      ratings: 4.8,
      numReviews: 248,
      specifications: [
        { key: 'Display Size', value: '6.1 inches Super Retina XDR' },
        { key: 'Processor', value: 'A17 Pro chip' },
        { key: 'Storage', value: '256GB' },
        { key: 'Camera', value: '48MP + 12MP + 12MP' }
      ],
      isFeatured: true,
      tags: ['apple', 'iphone', 'ios', 'mobile', 'smartphone', 'phone', 'pro', '15']
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Unleash new levels of creativity and productivity with the Samsung Galaxy S24 Ultra. Powered by Galaxy AI, this smartphone features Circle to Search, Live Translate, and Note Assist. Experience stunning clarity with the 200MP camera and 100x Space Zoom. Equipped with the integrated S Pen, a bright 6.8-inch QHD+ flat display, and Snapdragon 8 Gen 3 for peak performance.',
      highlights: ['Galaxy AI features built-in', 'Stunning 200MP camera system', 'Integrated S Pen stylus included', 'Snapdragon 8 Gen 3 Processor'],
      price: 119999,
      mrp: 129999,
      category: catMap['Mobiles'],
      brand: 'Samsung',
      images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600'],
      stock: 38,
      ratings: 4.9,
      numReviews: 195,
      specifications: [
        { key: 'Display Size', value: '6.8 inches QHD+ Dynamic AMOLED' },
        { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
        { key: 'Storage', value: '512GB' },
        { key: 'Camera', value: '200MP + 50MP + 12MP + 10MP' }
      ],
      isFeatured: true,
      tags: ['samsung', 'galaxy', 'android', 'mobile', 'smartphone', 'phone', 'ultra', 's24', 'ai', 'spen']
    },
    {
      name: 'OnePlus 12',
      slug: 'oneplus-12',
      description: 'The OnePlus 12 redefines the flagship experience with the Snapdragon 8 Gen 3 processor, up to 16GB RAM, and a beautiful 2K 120Hz ProXDR display. Crafted in partnership with Hasselblad, the 4th Gen Mobile Camera system delivers stunning portraits and landscape shots with unmatched color accuracy. Super-fast 100W SUPERVOOC charging gets you from 1% to 100% in 26 minutes.',
      highlights: ['4th Gen Hasselblad Camera System', 'Ultra-fast 100W SUPERVOOC Charging', 'Stunning 2K 120Hz ProXDR Display', 'Snapdragon 8 Gen 3 with 16GB RAM'],
      price: 64999,
      mrp: 69999,
      category: catMap['Mobiles'],
      brand: 'OnePlus',
      images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'],
      stock: 60,
      ratings: 4.7,
      numReviews: 167,
      specifications: [
        { key: 'Display Size', value: '6.82 inches 2K AMOLED' },
        { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
        { key: 'Storage', value: '256GB' },
        { key: 'Camera', value: '50MP + 64MP + 48MP' }
      ],
      isFeatured: false,
      tags: ['oneplus', 'android', 'mobile', 'smartphone', 'phone', '12', 'hasselblad', 'fast charging']
    },
    {
      name: 'Google Pixel 8 Pro',
      slug: 'google-pixel-8-pro',
      description: 'The Google Pixel 8 Pro is the all-pro phone engineered by Google. Powered by the Google Tensor G3 chip, it is custom-designed with Google AI for cutting-edge photo and video features, and smarter ways to help throughout the day. It features a fully upgraded triple camera system, a polished aluminum frame, and a matte glass back. Magic Eraser and Best Take ensure perfect group photos.',
      highlights: ['Google Tensor G3 chip with AI', 'Fully upgraded Triple Camera system', 'Magic Eraser and Best Take software', '7 Years of OS & security updates'],
      price: 93999,
      mrp: 106999,
      category: catMap['Mobiles'],
      brand: 'Google',
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'],
      stock: 25,
      ratings: 4.6,
      numReviews: 112,
      specifications: [
        { key: 'Display Size', value: '6.7 inches Super Actua Display' },
        { key: 'Processor', value: 'Google Tensor G3' },
        { key: 'Storage', value: '128GB' },
        { key: 'Camera', value: '50MP + 48MP + 48MP' }
      ],
      isFeatured: false,
      tags: ['google', 'pixel', 'android', 'mobile', 'smartphone', 'phone', 'pro', '8', 'camera', 'tensor']
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro+ 5G',
      slug: 'xiaomi-redmi-note-13-pro-plus-5g',
      description: 'Redefining premium mid-range, the Redmi Note 13 Pro+ features a flagship 200MP camera with OIS, a curved 1.5K AMOLED display with 120Hz refresh rate, and 120W HyperCharge that charges to 100% in 19 minutes. Complete with IP68 dust and water resistance, and MediaTek Dimensity 7200-Ultra processor for reliable gaming.',
      highlights: ['Flagship 200MP Camera with OIS', '120W HyperCharge (100% in 19m)', 'IP68 Dust and Water Resistance', 'Stunning 1.5K Curved AMOLED Screen'],
      price: 31999,
      mrp: 35999,
      category: catMap['Mobiles'],
      brand: 'Xiaomi',
      images: ['https://images.unsplash.com/photo-1565849904461-09a7ec50d63e?w=600'],
      stock: 85,
      ratings: 4.5,
      numReviews: 312,
      specifications: [
        { key: 'Display Size', value: '6.67 inches 1.5K AMOLED' },
        { key: 'Processor', value: 'Dimensity 7200-Ultra' },
        { key: 'Storage', value: '256GB' },
        { key: 'Camera', value: '200MP + 8MP + 2MP' }
      ],
      isFeatured: false,
      tags: ['xiaomi', 'redmi', 'android', 'mobile', 'smartphone', 'phone', '13', '5g', 'fast charge']
    },
    {
      name: 'Realme 12 Pro+ 5G',
      slug: 'realme-12-pro-plus-5g',
      description: 'Capture high-end portraits with the Realme 12 Pro+, featuring a 64MP Periscope Portrait Camera with 3x optical zoom. The luxury watch design by Ollivier Saveo combines premium vegan leather and a polished gold fluted bezel. Powered by Snapdragon 7s Gen 2 with a smooth 120Hz curved vision display.',
      highlights: ['64MP Periscope Portrait Camera', 'Premium luxury watch vegan leather design', '120Hz Curved Vision Display', 'Snapdragon 7s Gen 2 High Efficiency'],
      price: 29999,
      mrp: 33999,
      category: catMap['Mobiles'],
      brand: 'Realme',
      images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600'],
      stock: 74,
      ratings: 4.4,
      numReviews: 184,
      specifications: [
        { key: 'Display Size', value: '6.7 inches curved AMOLED' },
        { key: 'Processor', value: 'Snapdragon 7s Gen 2' },
        { key: 'Storage', value: '128GB' },
        { key: 'Camera', value: '50MP + 64MP + 8MP' }
      ],
      isFeatured: false,
      tags: ['realme', 'android', 'mobile', 'smartphone', 'phone', '12', '5g', 'periscope']
    },
    {
      name: 'Apple iPhone 13',
      slug: 'apple-iphone-13',
      description: 'The Apple iPhone 13 features a dual-camera system with Cinematic mode that adds shallow depth of field and shifts focus automatically. Powered by the superfast A15 Bionic chip, it sports a bright Super Retina XDR display, a durable ceramic shield front, and excellent battery life.',
      highlights: ['Advanced Dual-Camera with Cinematic mode', 'A15 Bionic superfast processor', 'Super Retina XDR bright display', 'IP68 water and dust resistance'],
      price: 49999,
      mrp: 59900,
      category: catMap['Mobiles'],
      brand: 'Apple',
      images: ['https://images.unsplash.com/photo-1632961638932-a5a87ce7eedc?w=600'],
      stock: 55,
      ratings: 4.7,
      numReviews: 485,
      specifications: [
        { key: 'Display Size', value: '6.1 inches Super Retina XDR' },
        { key: 'Processor', value: 'A15 Bionic chip' },
        { key: 'Storage', value: '128GB' },
        { key: 'Camera', value: '12MP + 12MP' }
      ],
      isFeatured: false,
      tags: ['apple', 'iphone', 'ios', 'mobile', 'smartphone', 'phone', '13']
    },
    {
      name: 'Samsung Galaxy A55 5G',
      slug: 'samsung-galaxy-a55-5g',
      description: 'The Samsung Galaxy A55 offers premium design and security with Knox Vault. It has a high-quality 50MP triple rear camera system, a metal frame with premium glass back, IP67 water and dust resistance, and an immersive 120Hz Super AMOLED display.',
      highlights: ['Samsung Knox Vault security', 'Metal frame with premium glass back', '50MP main camera with OIS', 'IP67 water and dust resistant'],
      price: 39999,
      mrp: 42999,
      category: catMap['Mobiles'],
      brand: 'Samsung',
      images: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=600'],
      stock: 90,
      ratings: 4.3,
      numReviews: 122,
      specifications: [
        { key: 'Display Size', value: '6.6 inches Super AMOLED' },
        { key: 'Processor', value: 'Exynos 1480' },
        { key: 'Storage', value: '128GB' },
        { key: 'Camera', value: '50MP + 12MP + 5MP' }
      ],
      isFeatured: false,
      tags: ['samsung', 'galaxy', 'android', 'mobile', 'smartphone', 'phone', 'a55', '5g']
    },
    {
      name: 'Motorola Edge 50 Pro',
      slug: 'motorola-edge-50-pro',
      description: 'The Motorola Edge 50 Pro features a symmetrical curved design with a premium vegan leather finish. It has a Pantone validated camera and display, a 50MP main camera with AI photo enhancement, and 125W TurboPower wired charging along with 50W wireless charging.',
      highlights: ['Pantone Validated camera & display', 'Luxury vegan leather finish design', 'Ultra-fast 125W TurboPower charging', 'Powerful 50MP AI Camera'],
      price: 31999,
      mrp: 36999,
      category: catMap['Mobiles'],
      brand: 'Motorola',
      images: ['https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600'],
      stock: 40,
      ratings: 4.5,
      numReviews: 96,
      specifications: [
        { key: 'Display Size', value: '6.7 inches curved pOLED' },
        { key: 'Processor', value: 'Snapdragon 7 Gen 3' },
        { key: 'Storage', value: '256GB' },
        { key: 'Camera', value: '50MP + 13MP + 10MP' }
      ],
      isFeatured: false,
      tags: ['motorola', 'moto', 'android', 'mobile', 'smartphone', 'phone', 'edge', 'leather']
    },
    {
      name: 'Nothing Phone (2)',
      slug: 'nothing-phone-2',
      description: 'Designed to be more mindful, the Nothing Phone (2) features the unique Glyph Interface on a transparent back. It runs Nothing OS 2.0 with a clean Android experience, has dual 50MP rear cameras, a 6.7-inch flexible LTPO AMOLED display, and is powered by the Snapdragon 8+ Gen 1 chip.',
      highlights: ['Iconic Glyph Interface transparent design', 'Nothing OS 2.0 clean bloatware-free', 'Dual 50MP advanced rear cameras', 'Snapdragon 8+ Gen 1 High Performance'],
      price: 39999,
      mrp: 44999,
      category: catMap['Mobiles'],
      brand: 'Nothing',
      images: ['https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=600'],
      stock: 35,
      ratings: 4.6,
      numReviews: 142,
      specifications: [
        { key: 'Display Size', value: '6.7 inches LTPO AMOLED' },
        { key: 'Processor', value: 'Snapdragon 8+ Gen 1' },
        { key: 'Storage', value: '256GB' },
        { key: 'Camera', value: '50MP + 50MP' }
      ],
      isFeatured: true,
      tags: ['nothing', 'glyph', 'android', 'mobile', 'smartphone', 'phone', '2', 'transparent']
    },
    {
      name: 'Apple iPad Air (M2)',
      slug: 'apple-ipad-air-m2',
      description: 'The redesigned Apple iPad Air is now powered by the incredibly fast Apple M2 chip. It features a stunning Liquid Retina display, a new landscape front camera perfect for FaceTime or video calls, superfast 5G, and compatibility with Apple Pencil Pro and Magic Keyboard.',
      highlights: ['Blazing-fast Apple M2 silicon chip', 'Immersive 11-inch Liquid Retina screen', 'New landscape camera alignment', 'Supports Apple Pencil Pro & Magic Keyboard'],
      price: 59900,
      mrp: 64900,
      category: catMap['Mobiles'],
      brand: 'Apple',
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'],
      stock: 30,
      ratings: 4.8,
      numReviews: 78,
      specifications: [
        { key: 'Display Size', value: '11 inches Liquid Retina' },
        { key: 'Processor', value: 'Apple M2 Chip' },
        { key: 'Storage', value: '128GB' },
        { key: 'Camera', value: '12MP Rear / 12MP Front' }
      ],
      isFeatured: false,
      tags: ['apple', 'ipad', 'tablet', 'ios', 'm2', 'air', 'mobile']
    },

    // =========================================================================
    // CATEGORY: Electronics (11 Products)
    // =========================================================================
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5-headphones',
      description: 'The Sony WH-1000XM5 wireless headphones rewrite the rules for distraction-free listening. Featuring two processors controlling 8 microphones for unprecedented noise cancellation, exceptional call quality, and a newly developed driver. Up to 30 hours of battery life with quick charging.',
      highlights: ['Industry-leading Active Noise Cancellation', 'Unmatched call quality with 8 mics', 'Up to 30 hours battery life', 'Ultra-comfortable lightweight design'],
      price: 29990,
      mrp: 34990,
      category: catMap['Electronics'],
      brand: 'Sony',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
      stock: 65,
      ratings: 4.8,
      numReviews: 512,
      specifications: [
        { key: 'Type', value: 'Over-Ear' },
        { key: 'Battery Life', value: 'Up to 30 hours' },
        { key: 'Connectivity', value: 'Bluetooth 5.2 & 3.5mm Aux' },
        { key: 'Charging Time', value: '3.5 Hours' }
      ],
      isFeatured: true,
      tags: ['sony', 'headphones', 'noise cancellation', 'wireless', 'bluetooth', 'audio', 'music', 'anc']
    },
    {
      name: 'Apple MacBook Air (M3)',
      slug: 'apple-macbook-air-m3',
      description: 'The incredibly thin and fast Apple MacBook Air with the M3 chip is built for work and play. With up to 18 hours of battery life, you can speed through everything from daily multitasking to editing high-resolution photos and video. Support for up to two external displays.',
      highlights: ['Supercharged by the Apple M3 chip', 'Incredibly thin and light aluminum body', 'Up to 18 hours of battery life', 'Beautiful Liquid Retina display'],
      price: 114900,
      mrp: 119900,
      category: catMap['Electronics'],
      brand: 'Apple',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'],
      stock: 28,
      ratings: 4.9,
      numReviews: 185,
      specifications: [
        { key: 'Screen Size', value: '13.6 inches Liquid Retina' },
        { key: 'Processor', value: 'Apple M3 Chip' },
        { key: 'RAM & Storage', value: '8GB Unified / 256GB SSD' },
        { key: 'Weight', value: '1.24 kg' }
      ],
      isFeatured: true,
      tags: ['apple', 'macbook', 'laptop', 'computer', 'macos', 'm3', 'notebook']
    },
    {
      name: 'Bose QuietComfort Ultra Earbuds',
      slug: 'bose-quietcomfort-ultra-earbuds',
      description: 'Bose QuietComfort Ultra Earbuds deliver a premium listening experience with breakthrough spatialized audio. World-class noise cancellation tailored to your ears with CustomTune technology. Soft, stable ear tips ensure comfortable listening all day long. Touch controls for easy music management.',
      highlights: ['Breakthrough Bose Immersive Audio', 'CustomTune personalized noise cancellation', 'Soft sweat-resistant secure fit', 'Touch controls with volume slider'],
      price: 25999,
      mrp: 29999,
      category: catMap['Electronics'],
      brand: 'Bose',
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
      stock: 45,
      ratings: 4.7,
      numReviews: 119,
      specifications: [
        { key: 'Type', value: 'True Wireless Earbuds' },
        { key: 'Battery Life', value: 'Up to 6 hours (24h with case)' },
        { key: 'Water Resistance', value: 'IPX4 Sweat Resistant' },
        { key: 'Bluetooth Version', value: 'Bluetooth 5.3' }
      ],
      isFeatured: false,
      tags: ['bose', 'earbuds', 'wireless', 'audio', 'music', 'bluetooth', 'noise cancelling']
    },
    {
      name: 'Dell XPS 13 Laptop',
      slug: 'dell-xps-13-laptop',
      description: 'The Dell XPS 13 is crafted from machined aluminum and glass for a durable yet lightweight design. Powered by the Intel Core Ultra 7 processor, it features a borderless InfinityEdge FHD+ display, dual fans for thermal efficiency, and an incredible tactile keyboard for premium typing.',
      highlights: ['Machined aluminum premium construction', 'Virtually borderless InfinityEdge screen', 'Intel Core Ultra 7 high performance', 'Highly thermal efficient dual fans'],
      price: 139999,
      mrp: 149999,
      category: catMap['Electronics'],
      brand: 'Dell',
      images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600'],
      stock: 20,
      ratings: 4.5,
      numReviews: 64,
      specifications: [
        { key: 'Screen Size', value: '13.4 inches FHD+ display' },
        { key: 'Processor', value: 'Intel Core Ultra 7 155H' },
        { key: 'RAM & Storage', value: '16GB RAM / 512GB SSD' },
        { key: 'OS', value: 'Windows 11 Home' }
      ],
      isFeatured: false,
      tags: ['dell', 'xps', 'laptop', 'windows', 'computer', 'notebook']
    },
    {
      name: 'Logitech MX Master 3S Wireless Mouse',
      slug: 'logitech-mx-master-3s-mouse',
      description: 'The Logitech MX Master 3S is an iconic mouse remastered. Experience quiet clicks and an 8,000 DPI track-on-glass sensor for ultimate precision and speed. The MagSpeed electromagnetic scroll wheel is fast and silent. Ergonomic design supports your hand for hours of comfortable work.',
      highlights: ['Ergonomic hand-support contour', 'Ultra-quiet click technology', '8,000 DPI sensor tracks on glass', 'MagSpeed electromagnetic scrolling'],
      price: 9999,
      mrp: 10995,
      category: catMap['Electronics'],
      brand: 'Logitech',
      images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600'],
      stock: 120,
      ratings: 4.8,
      numReviews: 412,
      specifications: [
        { key: 'Sensor Resolution', value: '200 to 8000 DPI' },
        { key: 'Buttons', value: '7 fully customizable buttons' },
        { key: 'Battery', value: 'Rechargeable Li-Po (500 mAh)' },
        { key: 'Connectivity', value: 'Bluetooth & Logi Bolt USB' }
      ],
      isFeatured: false,
      tags: ['logitech', 'mouse', 'wireless', 'bluetooth', 'accessory', 'office', 'ergonomic']
    },
    {
      name: 'Sony PlayStation 5 Slim Console',
      slug: 'sony-playstation-5-slim-console',
      description: 'Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio. The PS5 Slim features a smaller form factor while delivering the same high-performance gaming with 1TB of storage for all your favorite games.',
      highlights: ['Smaller slim chassis layout', 'Superfast 1TB customized SSD', 'DualSense haptic feedback integration', 'Exceptional 3D Audio support'],
      price: 54990,
      mrp: 54990,
      category: catMap['Electronics'],
      brand: 'Sony',
      images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600'],
      stock: 50,
      ratings: 4.9,
      numReviews: 680,
      specifications: [
        { key: 'Processor', value: 'AMD Zen 2 8-core CPU' },
        { key: 'Storage Capacity', value: '1TB Custom SSD' },
        { key: 'Graphics', value: 'AMD Radeon RDNA 2 GPU' },
        { key: 'Resolution Support', value: '4K 120Hz / 8K support' }
      ],
      isFeatured: true,
      tags: ['sony', 'playstation', 'ps5', 'gaming', 'console', 'controller', 'games', 'slim']
    },
    {
      name: 'Apple Watch Series 9',
      slug: 'apple-watch-series-9',
      description: 'The Apple Watch Series 9 is more capable, intuitive, and faster than ever. Powered by the S9 SiP, it features a super-bright Always-On Retina display and a magical new way to use your watch without touching the screen with the double tap gesture. Advanced health and safety features.',
      highlights: ['Powerful Apple S9 SiP processor', 'Double Tap finger guesture controls', 'Super-bright Always-on Retina screen', 'ECG, heart rate and blood oxygen monitoring'],
      price: 41900,
      mrp: 41900,
      category: catMap['Electronics'],
      brand: 'Apple',
      images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600'],
      stock: 42,
      ratings: 4.7,
      numReviews: 125,
      specifications: [
        { key: 'Case Size', value: '45mm Aluminum' },
        { key: 'Display Type', value: 'Always-On Retina LTPO OLED' },
        { key: 'OS', value: 'watchOS 10' },
        { key: 'Battery Life', value: 'Up to 18 hours (36h in Low Power)' }
      ],
      isFeatured: false,
      tags: ['apple', 'watch', 'smartwatch', 'ios', 'fitness', 'wearable']
    },
    {
      name: 'Samsung T7 Shield 2TB External SSD',
      slug: 'samsung-t7-shield-2tb-external-ssd',
      description: 'Superfast external storage that is tough, fast, and compact. The Samsung T7 Shield features a rugged IP65 dust and water-resistant design. Transfer massive files instantly with read/write speeds of up to 1,050/1,000 MB/s via USB 3.2 Gen 2. Encrypted data security.',
      highlights: ['Rugged IP65 dust and water resistance', 'High read/write speeds up to 1,050MB/s', 'Compact shock-resistant case outer shell', 'Advanced hardware encryption safety'],
      price: 16999,
      mrp: 23999,
      category: catMap['Electronics'],
      brand: 'Samsung',
      images: ['https://images.unsplash.com/photo-1601524909162-be87252be298?w=600'],
      stock: 80,
      ratings: 4.6,
      numReviews: 104,
      specifications: [
        { key: 'Capacity', value: '2TB' },
        { key: 'Interface', value: 'USB 3.2 Gen 2' },
        { key: 'Transfer Speed', value: 'Up to 1,050 MB/s' },
        { key: 'Durability', value: '3-meter drop resistant' }
      ],
      isFeatured: false,
      tags: ['samsung', 'ssd', 'hard drive', 'storage', 'external', 'backup', 'usb']
    },
    {
      name: 'Canon EOS R50 Mirrorless Camera',
      slug: 'canon-eos-r50-mirrorless-camera',
      description: 'Perfect for content creators, the Canon EOS R50 mirrorless camera features a 24.2 Megapixel APS-C CMOS sensor and DIGIC X image processor. Shoot high-quality 4K videos and sharp stills with Dual Pixel CMOS AF II that automatically detects and tracks subjects like people and vehicles.',
      highlights: ['24.2MP APS-C sensor with high detail', 'High-performance DIGIC X Image processor', 'Sharp cinematic 4K UHD video recording', 'Dual Pixel CMOS AF II subject tracking'],
      price: 65990,
      mrp: 75990,
      category: catMap['Electronics'],
      brand: 'Canon',
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'],
      stock: 18,
      ratings: 4.6,
      numReviews: 53,
      specifications: [
        { key: 'Sensor Resolution', value: '24.2 Megapixels' },
        { key: 'Video Resolution', value: '4K UHD 30p / Full HD 120p' },
        { key: 'Lens Kit', value: 'RF-S 18-45mm f/4.5-6.3 IS STM' },
        { key: 'Weight', value: '375g (Body only)' }
      ],
      isFeatured: false,
      tags: ['canon', 'camera', 'mirrorless', 'photography', 'vlogging', 'video', 'lens']
    },
    {
      name: 'TP-Link Archer AX73 Wi-Fi 6 Router',
      slug: 'tp-link-archer-ax73-wifi-6-router',
      description: 'Upgrade to next-generation Wi-Fi 6 speeds of up to 5400 Mbps. The TP-Link Archer AX73 supports high-capacity streaming, gaming, and smart home devices. Six external antennas with Beamforming ensure strong signal coverage throughout your home. Secure HomeShield protection.',
      highlights: ['Gigabit Wi-Fi 6 speeds up to 5400Mbps', 'Six premium external antennas coverage', 'Supports high-density device connectivity', 'TP-Link HomeShield smart security'],
      price: 8999,
      mrp: 14999,
      category: catMap['Electronics'],
      brand: 'TP-Link',
      images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600'],
      stock: 65,
      ratings: 4.4,
      numReviews: 204,
      specifications: [
        { key: 'Wi-Fi Standard', value: 'Wi-Fi 6 (802.11ax)' },
        { key: 'Speed', value: '4804 Mbps (5 GHz) + 574 Mbps (2.4 GHz)' },
        { key: 'Processor', value: '1.5 GHz Triple-Core CPU' },
        { key: 'Ethernet Ports', value: '1x WAN, 4x LAN Gigabit Ports' }
      ],
      isFeatured: false,
      tags: ['tp-link', 'router', 'wifi', 'internet', 'network', 'wireless', 'ax']
    },
    {
      name: 'Anker 737 Power Bank (PowerCore 24K)',
      slug: 'anker-737-power-bank',
      description: 'Equipped with an ultra-high 24,000mAh capacity and 140W fast-charging capability. The Anker 737 features an easy-to-read digital smart display showing output power and remaining recharge time. Quickly power up your laptops, tablets, and phones simultaneously.',
      highlights: ['Ultra-high 24,000mAh charging capacity', 'Ultra-powerful 140W fast-charging output', 'Built-in smart digital display panel', 'Triple outputs charge devices at once'],
      price: 11999,
      mrp: 15999,
      category: catMap['Electronics'],
      brand: 'Anker',
      images: ['https://images.unsplash.com/photo-1609592424109-dd23561a0179?w=600'],
      stock: 110,
      ratings: 4.7,
      numReviews: 187,
      specifications: [
        { key: 'Capacity', value: '24,000 mAh' },
        { key: 'Maximum Output', value: '140W Power Delivery 3.1' },
        { key: 'Ports', value: '2x USB-C, 1x USB-A' },
        { key: 'Recharge Time', value: 'Approx 52 minutes (with 140W charger)' }
      ],
      isFeatured: false,
      tags: ['anker', 'power bank', 'charger', 'battery', 'accessory', 'usb-c', 'portable']
    },

    // =========================================================================
    // CATEGORY: Fashion (11 Products)
    // =========================================================================
    {
      name: 'Nike Air Max 270 Sneakers',
      slug: 'nike-air-max-270-sneakers',
      description: 'Step into legendary comfort and sleek style with the Nike Air Max 270. Inspired by iconic Air Max shoes, it showcases Nike\'s greatest innovation with its large window and fresh array of colors. The woven and synthetic fabric on the upper provides a lightweight fit and airy feel.',
      highlights: ['Large Max Air unit for visual cushioning', 'Woven synthetic lightweight mesh upper', 'Sleek lifestyle athletic silhouette', 'Durable dual-density foam sole'],
      price: 12995,
      mrp: 13995,
      category: catMap['Fashion'],
      brand: 'Nike',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
      stock: 60,
      ratings: 4.7,
      numReviews: 324,
      specifications: [
        { key: 'Material', value: 'Textile Mesh / Synthetic' },
        { key: 'Sole', value: 'Rubber with Air Cushion' },
        { key: 'Color', value: 'Red / Black' },
        { key: 'Type', value: 'Sports Lifestyle Shoes' }
      ],
      isFeatured: true,
      tags: ['nike', 'shoes', 'sneakers', 'air max', 'sports', 'footwear', 'running']
    },
    {
      name: "Levi's Men's 511 Slim Fit Jeans",
      slug: 'levis-mens-511-slim-fit-jeans',
      description: 'A modern slim with room to move, the 511 Slim Fit Jeans are a classic since right now. These jeans are cut close to the body without feeling too tight. Made with Levi\'s WaterLess technology and premium stretch denim that holds its shape all day long. Classic 5-pocket styling.',
      highlights: ['Premium comfort stretch denim material', 'Classic modern 5-pocket jeans layout', 'WaterLess manufacturing technology', 'Tailored slim fit silhouette'],
      price: 2799,
      mrp: 3999,
      category: catMap['Fashion'],
      brand: "Levi's",
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'],
      stock: 85,
      ratings: 4.4,
      numReviews: 298,
      specifications: [
        { key: 'Fit', value: 'Slim Fit' },
        { key: 'Fabric', value: '99% Cotton, 1% Elastane' },
        { key: 'Wash', value: 'Machine Washable' },
        { key: 'Closure', value: 'Zipper fly with button' }
      ],
      isFeatured: true,
      tags: ['levis', 'jeans', 'denim', 'pants', 'clothing', 'men', 'slim fit']
    },
    {
      name: 'Adidas Essentials Fleece Hoodie',
      slug: 'adidas-essentials-fleece-hoodie',
      description: 'Stay comfortable and warm in style with the Adidas Essentials Fleece Hoodie. Made of soft cotton-blend fleece, this hoodie features the classic Adidas 3-Stripes branding, a spacious drawcord-adjustable hood, and a cozy kangaroo pocket. Made with recycled materials.',
      highlights: ['Soft warm cotton-blend fleece lining', 'Classic signature 3-stripes sleeve trim', 'Spacious warm front kangaroo pocket', 'Environment-friendly recycled fabric'],
      price: 3499,
      mrp: 4999,
      category: catMap['Fashion'],
      brand: 'Adidas',
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'],
      stock: 75,
      ratings: 4.5,
      numReviews: 188,
      specifications: [
        { key: 'Material', value: '53% Cotton, 36% Polyester, 11% Viscose' },
        { key: 'Fit', value: 'Regular Fit' },
        { key: 'Sleeve', value: 'Full Sleeve' },
        { key: 'Closure', value: 'Pullover with drawcord hood' }
      ],
      isFeatured: false,
      tags: ['adidas', 'hoodie', 'sweatshirt', 'clothing', 'winterwear', 'sports', 'fleece']
    },
    {
      name: "Zara Women's Double Breasted Blazer",
      slug: 'zara-womens-double-breasted-blazer',
      description: 'Add a touch of sophistication to your wardrobe with the Zara double-breasted blazer. Featuring a classic lapel collar, long sleeves, front flap pockets, and button-up front closure. The tailored fit makes it perfect for both formal office wear and smart-casual outings.',
      highlights: ['Tailored smart double-breasted layout', 'Classic elegant structured lapel collar', 'Deep functional front flap pockets', 'High quality lining for premium wear'],
      price: 5990,
      mrp: 7990,
      category: catMap['Fashion'],
      brand: 'Zara',
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'],
      stock: 40,
      ratings: 4.3,
      numReviews: 76,
      specifications: [
        { key: 'Material', value: 'Polyester Blend' },
        { key: 'Style', value: 'Double-Breasted Blazer' },
        { key: 'Care', value: 'Dry Clean Only' },
        { key: 'Occasion', value: 'Formal / Smart Casual' }
      ],
      isFeatured: false,
      tags: ['zara', 'blazer', 'coat', 'suit', 'clothing', 'women', 'formal']
    },
    {
      name: 'Ray-Ban Classic Wayfarer Sunglasses',
      slug: 'ray-ban-classic-wayfarer-sunglasses',
      description: 'Ray-Ban Wayfarer Classic is the most recognizable style in the history of sunglasses. Since its initial design in 1952, Wayfarer Classics gained popularity among celebrities, musicians, and artists. Made from premium acetate with polarized green classic G-15 lenses.',
      highlights: ['Classic timeless Wayfarer design', 'Premium sturdy acetate black frame', 'Polarized green G-15 UV protection lenses', 'Signature metallic brand accents'],
      price: 8490,
      mrp: 9990,
      category: catMap['Fashion'],
      brand: 'Ray-Ban',
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600'],
      stock: 50,
      ratings: 4.8,
      numReviews: 215,
      specifications: [
        { key: 'Frame Material', value: 'Acetate' },
        { key: 'Lens Tech', value: 'Polarized UV Protection' },
        { key: 'Frame Color', value: 'Polished Black' },
        { key: 'Lens Color', value: 'Classic Green G-15' }
      ],
      isFeatured: false,
      tags: ['ray-ban', 'sunglasses', 'goggles', 'eyewear', 'wayfarer', 'uv protection', 'polarized']
    },
    {
      name: "Tommy Hilfiger Men's Oxford Shirt",
      slug: 'tommy-hilfiger-mens-oxford-shirt',
      description: 'A timeless wardrobe essential, this Tommy Hilfiger Oxford shirt is cut from premium 100% organic cotton oxford fabric. Designed with a classic button-down collar, embroidered flag logo on the chest, and a comfortable regular fit. Perfect for layered styles or wearing alone.',
      highlights: ['100% Organic cotton oxford fabric', 'Classic button-down collar design', 'Embroidered brand logo on chest', 'Versatile regular fit silhouette'],
      price: 3999,
      mrp: 5999,
      category: catMap['Fashion'],
      brand: 'Tommy Hilfiger',
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'],
      stock: 65,
      ratings: 4.5,
      numReviews: 120,
      specifications: [
        { key: 'Material', value: '100% Organic Cotton' },
        { key: 'Fit', value: 'Regular Fit' },
        { key: 'Sleeve', value: 'Long Sleeve' },
        { key: 'Pattern', value: 'Solid Color' }
      ],
      isFeatured: false,
      tags: ['tommy hilfiger', 'shirt', 'clothing', 'men', 'cotton', 'formal', 'casual']
    },
    {
      name: 'Puma Unisex Smash v2 Sneakers',
      slug: 'puma-unisex-smash-v2-sneakers',
      description: 'The Puma Smash v2 is the tennis-inspired classic look remastered with a soft suede leather upper. Features the iconic Puma Formstrip on lateral sides, durable rubber outsole for grip, and SoftFoam+ sockliner for superior cushioning and optimal step-in comfort.',
      highlights: ['Soft premium suede leather upper', 'SoftFoam+ sockliner for great comfort', 'Tennis-inspired clean classic design', 'Durable grippy vulcanized rubber sole'],
      price: 2499,
      mrp: 4499,
      category: catMap['Fashion'],
      brand: 'Puma',
      images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600'],
      stock: 110,
      ratings: 4.3,
      numReviews: 314,
      specifications: [
        { key: 'Material', value: 'Suede Leather Upper' },
        { key: 'Sole Material', value: 'Rubber' },
        { key: 'Cushioning', value: 'SoftFoam+ Sockliner' },
        { key: 'Gender', value: 'Unisex' }
      ],
      isFeatured: false,
      tags: ['puma', 'shoes', 'sneakers', 'suede', 'footwear', 'casual']
    },
    {
      name: 'Fossil Grant Chronograph Watch',
      slug: 'fossil-grant-chronograph-watch',
      description: 'Modelled after vintage clocks, the Fossil Grant Chronograph watch features a classic design with Roman numerals and a rich navy dial. Set in a 44mm stainless steel case with a premium brown genuine leather strap. Water-resistant up to 50m with stopwatch functionality.',
      highlights: ['Classic vintage Roman numeral dial', 'Premium high-grade genuine leather strap', 'Sturdy stainless steel 44mm case', 'Water resistant up to 50 meters'],
      price: 8995,
      mrp: 12495,
      category: catMap['Fashion'],
      brand: 'Fossil',
      images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600'],
      stock: 45,
      ratings: 4.6,
      numReviews: 180,
      specifications: [
        { key: 'Case Diameter', value: '44mm' },
        { key: 'Strap Material', value: 'Genuine Leather' },
        { key: 'Movement', value: 'Quartz Chronograph' },
        { key: 'Water Resistance', value: '50 Meters' }
      ],
      isFeatured: false,
      tags: ['fossil', 'watch', 'chronograph', 'leather', 'analog', 'accessory', 'men']
    },
    {
      name: "H&M Women's Floral Summer Dress",
      slug: 'hm-womens-floral-summer-dress',
      description: 'Embrace sunny days with this H&M knee-length dress in a soft, airy woven viscose fabric. Featuring a deep V-neck at the front and back, narrow adjustable shoulder straps, and a gathered seam at the waist for a beautifully flared skirt. Lined bodice for comfort.',
      highlights: ['Soft lightweight viscose summer fabric', 'Beautiful deep v-neck front and back', 'Dainty adjustable shoulder straps', 'Flared gathered waist feminine fit'],
      price: 1499,
      mrp: 2299,
      category: catMap['Fashion'],
      brand: 'H&M',
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'],
      stock: 55,
      ratings: 4.2,
      numReviews: 64,
      specifications: [
        { key: 'Material', value: '100% Viscose' },
        { key: 'Style', value: 'A-Line Dress' },
        { key: 'Neckline', value: 'V-Neck' },
        { key: 'Length', value: 'Knee Length' }
      ],
      isFeatured: false,
      tags: ['h&m', 'dress', 'clothing', 'women', 'floral', 'summerwear']
    },
    {
      name: 'Calvin Klein Unisex Duffle Bag',
      slug: 'calvin-klein-unisex-duffle-bag',
      description: 'Designed for weekend getaways and gym sessions, the Calvin Klein duffle bag is crafted from durable water-repellent canvas. It features a spacious main compartment, dual top carry handles, an adjustable padded shoulder strap, and bold Calvin Klein signature logo print.',
      highlights: ['Water-repellent heavy duty canvas fabric', 'Extremely spacious interior compartment', 'Adjustable padded shoulder strap included', 'Bold modern logo print branding'],
      price: 4999,
      mrp: 6999,
      category: catMap['Fashion'],
      brand: 'Calvin Klein',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
      stock: 30,
      ratings: 4.5,
      numReviews: 88,
      specifications: [
        { key: 'Material', value: 'Water-resistant Canvas / Polyester' },
        { key: 'Dimensions', value: '50cm x 28cm x 25cm' },
        { key: 'Capacity', value: '35 Liters' },
        { key: 'Compartments', value: '1 Main, 2 Side Pockets' }
      ],
      isFeatured: false,
      tags: ['calvin klein', 'bag', 'duffle', 'travel', 'gym', 'luggage', 'unisex']
    },
    {
      name: "Bata Men's Leather Formal Shoes",
      slug: 'bata-mens-leather-formal-shoes',
      description: 'Complete your professional look with Bata\'s classic Derby formal shoes. Handcrafted from 100% genuine full-grain leather, featuring a lace-up design, breathable leather lining, and a cushioned Ortholite footbed for maximum support during long office hours.',
      highlights: ['100% Genuine full-grain leather upper', 'Premium breathable leather inner lining', 'Comfort cushioned Ortholite footbed', 'Durable non-slip textured outsole'],
      price: 1999,
      mrp: 2999,
      category: catMap['Fashion'],
      brand: 'Bata',
      images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600'],
      stock: 95,
      ratings: 4.1,
      numReviews: 142,
      specifications: [
        { key: 'Material', value: 'Genuine Leather Upper' },
        { key: 'Type', value: 'Derby Formal Shoes' },
        { key: 'Closure', value: 'Lace-Up' },
        { key: 'Insole', value: 'Cushioned Ortholite' }
      ],
      isFeatured: false,
      tags: ['bata', 'shoes', 'formal', 'leather', 'office', 'footwear', 'men']
    },

    // =========================================================================
    // CATEGORY: Home & Kitchen (11 Products)
    // =========================================================================
    {
      name: 'Pigeon Amaze Plus Electric Kettle',
      slug: 'pigeon-amaze-plus-electric-kettle',
      description: 'Boil water quickly and safely with the Pigeon Amaze Plus Electric Kettle. Boasting a large 1.5L capacity and a powerful 1500W heating element, it boils water in minutes. Features a durable food-grade stainless steel body, automatic shut-off, and 360-degree swivel base.',
      highlights: ['Large 1.5L boiling water capacity', 'Powerful 1500W fast heating element', 'Auto shut-off boil dry protection', '360 degree cordless swivel base'],
      price: 799,
      mrp: 1495,
      category: catMap['Home & Kitchen'],
      brand: 'Pigeon',
      images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600'],
      stock: 150,
      ratings: 4.2,
      numReviews: 1845,
      specifications: [
        { key: 'Capacity', value: '1.5 Liters' },
        { key: 'Power Consumption', value: '1500 Watts' },
        { key: 'Material', value: 'Stainless Steel & ABS Plastic' },
        { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
      ],
      isFeatured: true,
      tags: ['pigeon', 'kettle', 'electric kettle', 'kitchen', 'home', 'appliance', 'boil']
    },
    {
      name: 'Prestige Omega Deluxe Cookware Set',
      slug: 'prestige-omega-deluxe-cookware-set',
      description: 'Upgrade your culinary space with the Prestige Omega Deluxe Cookware Set. Includes a non-stick kadai with glass lid, a frypan, and an omni tawa. Crafted with a 3-layer Teflon coating that is metal-spoon friendly, scratch-resistant, and ensures healthy, low-oil cooking.',
      highlights: ['Premium 3-layer Teflon non-stick coating', 'Metal-spoon friendly scratch resistance', 'Sturdy cool-touch bakelite handles', 'Induction and gas stove compatible'],
      price: 2499,
      mrp: 3750,
      category: catMap['Home & Kitchen'],
      brand: 'Prestige',
      images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600'],
      stock: 65,
      ratings: 4.4,
      numReviews: 312,
      specifications: [
        { key: 'Items Included', value: 'Kadai (24cm) with Lid, Fry Pan (24cm), Tawa (25cm)' },
        { key: 'Base Type', value: 'Gas & Induction Compatible' },
        { key: 'Coating', value: '3-Layer Non-Stick' },
        { key: 'Lid Material', value: 'Tempered Glass' }
      ],
      isFeatured: true,
      tags: ['prestige', 'cookware', 'non-stick', 'kadai', 'pan', 'tawa', 'kitchen', 'cooking']
    },
    {
      name: 'Philips Hue Smart LED Bulb Starter Kit',
      slug: 'philips-hue-smart-led-bulb-starter-kit',
      description: 'Set the perfect mood in your home with the Philips Hue Smart LED Bulb Starter Kit. Includes 3 smart bulbs offering 16 million colors and shades of white light, and the Hue Bridge. Control via the app, voice commands (Alexa, Google Assistant), or smart switches.',
      highlights: ['16 million colors and white light shades', 'Control via App, Voice, or Smart Switches', 'Hue Bridge controller included in box', 'Set dynamic smart lighting schedules'],
      price: 9999,
      mrp: 14999,
      category: catMap['Home & Kitchen'],
      brand: 'Philips',
      images: ['https://images.unsplash.com/photo-1550985616-10810253b84d?w=600'],
      stock: 40,
      ratings: 4.6,
      numReviews: 198,
      specifications: [
        { key: 'Bulb Base Type', value: 'B22 / E27' },
        { key: 'Luminous Flux', value: '806 Lumens per bulb' },
        { key: 'Power Consumption', value: '9 Watts' },
        { key: 'Compatibility', value: 'Alexa, Google Assistant, Apple HomeKit' }
      ],
      isFeatured: false,
      tags: ['philips', 'hue', 'smart bulb', 'lighting', 'led', 'home automation', 'alexa']
    },
    {
      name: 'Wonderchef Nutri-blend Mixer Grinder',
      slug: 'wonderchef-nutri-blend-mixer-grinder',
      description: 'India\'s favorite mixer-grinder, the Wonderchef Nutri-blend, is known for its high power, beautiful looks, and durability. Powered by a 400W pure copper motor, it spins at 22,000 RPM to extract all nutrients. Includes 2 unbreakable jars and super-sharp stainless steel blades.',
      highlights: ['High-speed 22,000 RPM copper motor', 'Unbreakable polycarbonate smart jars', 'Extracts vitamins & minerals efficiently', 'Compact elegant designer layout'],
      price: 2999,
      mrp: 4999,
      category: catMap['Home & Kitchen'],
      brand: 'Wonderchef',
      images: ['https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600'],
      stock: 80,
      ratings: 4.5,
      numReviews: 614,
      specifications: [
        { key: 'Motor Capacity', value: '400 Watts' },
        { key: 'Speed', value: '22,000 RPM' },
        { key: 'Jars Included', value: 'Tall Jar (500ml), Short Jar (300ml)' },
        { key: 'Blade Material', value: 'Stainless Steel' }
      ],
      isFeatured: false,
      tags: ['wonderchef', 'mixer', 'blender', 'grinder', 'nutriblend', 'kitchen', 'appliance']
    },
    {
      name: 'Solimo Microfiber Reversible Comforter',
      slug: 'solimo-microfiber-reversible-comforter',
      description: 'Enjoy a cozy, peaceful night\'s sleep under the Solimo Microfiber Reversible Comforter. Made from 100% polyester microfiber cover and filled with 200 GSM hollow siliconized polyester filling. Soft, breathable, and warm, this comforter is ideal for year-round air-conditioned comfort.',
      highlights: ['Premium soft microfiber cover fabric', '200 GSM warm hollow siliconized filling', 'Stylish reversible dual color design', 'Hypoallergenic odor-free filling'],
      price: 1299,
      mrp: 2500,
      category: catMap['Home & Kitchen'],
      brand: 'Solimo',
      images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600'],
      stock: 90,
      ratings: 4.3,
      numReviews: 875,
      specifications: [
        { key: 'Size', value: 'Double Bed (228cm x 254cm)' },
        { key: 'Cover Material', value: '100% Microfiber' },
        { key: 'Filling Weight', value: '200 GSM Hollow Polyester' },
        { key: 'Care', value: 'Machine Wash cold' }
      ],
      isFeatured: false,
      tags: ['solimo', 'comforter', 'blanket', 'bedding', 'quilt', 'home decor', 'bedroom']
    },
    {
      name: 'Milton Thermosteel Duo Deluxe Flask',
      slug: 'milton-thermosteel-duo-deluxe-flask',
      description: 'Keep your beverages hot or cold for a full 24 hours with the Milton Thermosteel Duo Deluxe Flask. Made of high-quality rust-resistant 304 stainless steel inside and out, this vacuum-insulated bottle features a leak-proof flip lid that doubles as a convenient serving cup.',
      highlights: ['24 hours vacuum temperature retention', 'Premium rust-resistant 304 stainless steel', 'Double wall vacuum insulation', 'Leak-proof lid doubles as serving cup'],
      price: 899,
      mrp: 1040,
      category: catMap['Home & Kitchen'],
      brand: 'Milton',
      images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'],
      stock: 130,
      ratings: 4.4,
      numReviews: 432,
      specifications: [
        { key: 'Capacity', value: '1000 ml' },
        { key: 'Material Type', value: '304 Food-grade Stainless Steel' },
        { key: 'Temp Retention', value: '24 Hours (Hot/Cold)' },
        { key: 'Usage', value: 'Gym, Office, Travel' }
      ],
      isFeatured: false,
      tags: ['milton', 'flask', 'thermos', 'bottle', 'water bottle', 'insulated', 'travel']
    },
    {
      name: 'La Opala English Mustard Dinner Set',
      slug: 'la-opala-english-mustard-dinner-set',
      description: 'Serve elegant meals in the La Opala English Mustard 33-Piece Dinner Set. Made from premium opal glass, it is break-resistant, chip-resistant, microwave-safe, and dishwasher-safe. Features a beautiful contemporary floral pattern that elevates any dining table.',
      highlights: ['Premium break & chip resistant opal glass', '100% Bone ash-free vegetarian ware', 'Microwave and dishwasher safe', 'Stunning contemporary floral print border'],
      price: 2999,
      mrp: 3995,
      category: catMap['Home & Kitchen'],
      brand: 'La Opala',
      images: ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600'],
      stock: 45,
      ratings: 4.5,
      numReviews: 124,
      specifications: [
        { key: 'Pieces Count', value: '33 Pieces Set' },
        { key: 'Serving Size', value: 'Ideal for 6 Persons' },
        { key: 'Material', value: 'Opal Glass' },
        { key: 'Weight', value: '8.5 kg' }
      ],
      isFeatured: false,
      tags: ['la opala', 'dinner set', 'crockery', 'plates', 'dining', 'kitchenware', 'opalware']
    },
    {
      name: 'Sleepyhead Reversible Ergonomic Pillow',
      slug: 'sleepyhead-reversible-ergonomic-pillow',
      description: 'Say goodbye to neck pain with the Sleepyhead Ergonomic Pillow. Featuring premium memory foam that conforms to the shape of your head and neck for optimal spinal alignment. The reversible design offers a soft cooling gel side and a cozy warm micro-fiber side.',
      highlights: ['Contoured supportive premium memory foam', 'Reversible cool-gel & micro-fiber design', 'Improves sleeping posture & spinal alignment', 'Removable machine-washable cotton cover'],
      price: 999,
      mrp: 1499,
      category: catMap['Home & Kitchen'],
      brand: 'Sleepyhead',
      images: ['https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600'],
      stock: 80,
      ratings: 4.3,
      numReviews: 245,
      specifications: [
        { key: 'Filling Material', value: 'Memory Foam with Cooling Gel' },
        { key: 'Size', value: 'Standard (60cm x 40cm)' },
        { key: 'Firmness', value: 'Medium Firm' },
        { key: 'Warranty', value: '1 Year Warranty' }
      ],
      isFeatured: false,
      tags: ['sleepyhead', 'pillow', 'memory foam', 'orthopedic', 'bedding', 'sleep', 'cushion']
    },
    {
      name: 'Kuber Industries Foldable Wardrobe Organizer',
      slug: 'kuber-industries-foldable-wardrobe-organizer',
      description: 'Keep your closet tidy and organized with this set of 3 foldable storage boxes from Kuber Industries. Made of durable non-woven fabric with reinforced cardboard support. Includes transparent front windows and sturdy handles for easy access and carrying.',
      highlights: ['Set of 3 heavy-duty storage boxes', 'Sturdy reinforced eco fabric structure', 'Transparent clear front view windows', 'Double stitched sturdy side carry handles'],
      price: 499,
      mrp: 999,
      category: catMap['Home & Kitchen'],
      brand: 'Kuber Industries',
      images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600'],
      stock: 200,
      ratings: 4.1,
      numReviews: 541,
      specifications: [
        { key: 'Material', value: 'Non-Woven Fabric & Cardboard' },
        { key: 'Quantity', value: 'Pack of 3' },
        { key: 'Dimensions', value: '48cm x 36cm x 20cm' },
        { key: 'Foldable', value: 'Yes' }
      ],
      isFeatured: false,
      tags: ['kuber', 'wardrobe', 'storage box', 'organizer', 'closet', 'home organization']
    },
    {
      name: 'Aroma Magic Diffuser Oil Set',
      slug: 'aroma-magic-diffuser-oil-set',
      description: 'Transform your home into a tranquil spa with the Aroma Magic Diffuser Oil Set. Includes 4 essential oils: Lavender, Lemongrass, Jasmine, and Eucalyptus. Perfect for aromatherapy, reducing stress, purifying the air, and leaving a wonderful natural fragrance in any room.',
      highlights: ['Premium pack of 4 natural essential oils', 'Perfect aromatherapy stress relief', 'Lavender, Lemongrass, Jasmine, Eucalyptus', 'Ideal for ceramic and ultrasonic diffusers'],
      price: 549,
      mrp: 750,
      category: catMap['Home & Kitchen'],
      brand: 'Aroma Magic',
      images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600'],
      stock: 120,
      ratings: 4.4,
      numReviews: 189,
      specifications: [
        { key: 'Contents', value: '4 Bottles (10ml each)' },
        { key: 'Flavors', value: 'Lavender, Jasmine, Lemongrass, Eucalyptus' },
        { key: 'Purity', value: '100% Natural Extract' },
        { key: 'Usage', value: 'Diffusers, Aromatherapy, Massage' }
      ],
      isFeatured: false,
      tags: ['aroma magic', 'essential oil', 'diffuser', 'aromatherapy', 'fragrance', 'spa', 'lavender']
    },
    {
      name: 'Signoraware Executive Lunch Box',
      slug: 'signoraware-executive-lunch-box',
      description: 'Take healthy home-cooked meals to work with the Signoraware Executive Lunch Box. Includes 3 air-tight, leak-proof food containers made of high-grade food-safe BPA-free plastic. Packed in a stylish insulated carry bag that keeps food warm and fresh for hours.',
      highlights: ['3 air-tight leak-proof round containers', 'Food-grade BPA free high quality plastic', 'Insulated stylish carry bag included', 'Microwave and freezer safe containers'],
      price: 649,
      mrp: 850,
      category: catMap['Home & Kitchen'],
      brand: 'Signoraware',
      images: ['https://images.unsplash.com/photo-1594911774802-8822a707cff3?w=600'],
      stock: 140,
      ratings: 4.2,
      numReviews: 412,
      specifications: [
        { key: 'Number of Jars', value: '3 Containers' },
        { key: 'Container Size', value: '300ml each' },
        { key: 'Material', value: 'BPA-Free Food Grade Plastic' },
        { key: 'Bag Type', value: 'Insulated fabric sleeve' }
      ],
      isFeatured: false,
      tags: ['signoraware', 'lunch box', 'tiffin', 'food container', 'office', 'kitchen']
    },

    // =========================================================================
    // CATEGORY: Appliances (11 Products)
    // =========================================================================
    {
      name: 'Samsung 32-inch HD Smart LED TV',
      slug: 'samsung-32-inch-smart-tv',
      description: 'Experience vivid details and stunning colors with the Samsung 32-inch HD Smart LED TV. It features a bright High Dynamic Range (HDR) display, a powerful Hyper Real picture engine, and Dolby Digital Plus audio. Enjoy streaming all your favorite apps like Netflix, Prime, and YouTube.',
      highlights: ['Vibrant High Dynamic Range (HDR) panel', 'Hyper Real powerful picture engine', 'Dolby Digital Plus immersive audio', 'Smart Hub with all streaming apps pre-built'],
      price: 13990,
      mrp: 18900,
      category: catMap['Appliances'],
      brand: 'Samsung',
      images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600'],
      stock: 40,
      ratings: 4.4,
      numReviews: 689,
      specifications: [
        { key: 'Screen Size', value: '32 Inches' },
        { key: 'Resolution', value: 'HD Ready (1366 x 768)' },
        { key: 'Audio Output', value: '20 Watts' },
        { key: 'Smart OS', value: 'Tizen OS' }
      ],
      isFeatured: true,
      tags: ['samsung', 'tv', 'television', 'smart tv', 'appliance', 'display', 'screen']
    },
    {
      name: 'LG 242L Double Door Refrigerator',
      slug: 'lg-242l-double-door-refrigerator',
      description: 'Keep your food fresh and healthy for longer with the LG 242L Double Door Refrigerator. Powered by a Smart Inverter Compressor that is energy-efficient and durable. Features Door Cooling+ for faster and even cooling throughout, and a spacious vegetable box with moist balance crisper.',
      highlights: ['Energy saving Smart Inverter Compressor', 'Advanced Door Cooling+ even air circulation', 'Spacious vegetable box with moist control', 'Smart Diagnosis instant troubleshooting'],
      price: 24990,
      mrp: 29990,
      category: catMap['Appliances'],
      brand: 'LG',
      images: ['https://images.unsplash.com/photo-1571175432230-01a2887f3916?w=600'],
      stock: 25,
      ratings: 4.5,
      numReviews: 312,
      specifications: [
        { key: 'Capacity', value: '242 Liters' },
        { key: 'Energy Rating', value: '3 Star' },
        { key: 'Defrost Type', value: 'Frost Free' },
        { key: 'Compressor Warranty', value: '10 Years' }
      ],
      isFeatured: true,
      tags: ['lg', 'refrigerator', 'fridge', 'double door', 'appliances', 'kitchen']
    },
    {
      name: 'IFB 6.5 kg Fully Automatic Washing Machine',
      slug: 'ifb-6-point-5-kg-washing-machine',
      description: 'Get impeccable wash results every time with the IFB 6.5 kg Fully Automatic Front Load Washing Machine. Features 2D Wash system, Aqua Energie filter to soften hard water, and a stainless steel crescent moon drum. Includes comprehensive warranty and multiple custom wash cycles.',
      highlights: ['Impeccable front-load wash efficiency', 'Aqua Energie hard water softener filter', 'Crescent Moon stainless steel wash drum', 'Protective 2D wash dynamic water system'],
      price: 27990,
      mrp: 32990,
      category: catMap['Appliances'],
      brand: 'IFB',
      images: ['https://images.unsplash.com/photo-1582730147233-ac81111d044e?w=600'],
      stock: 22,
      ratings: 4.6,
      numReviews: 175,
      specifications: [
        { key: 'Wash Capacity', value: '6.5 kg' },
        { key: 'Load Type', value: 'Front Load Fully Automatic' },
        { key: 'Max Spin Speed', value: '1000 RPM' },
        { key: 'Special Features', value: 'Anti-Allergen, Cradle Wash for delicates' }
      ],
      isFeatured: false,
      tags: ['ifb', 'washing machine', 'dryer', 'laundry', 'fully automatic', 'appliance']
    },
    {
      name: 'Voltas 1.5 Ton 5 Star Split AC',
      slug: 'voltas-1-point-5-ton-split-ac',
      description: 'Beat the harsh summer heat with the Voltas 1.5 Ton 5 Star Adjustable Split AC. Features a high-performance variable speed compressor that adjusts cooling power based on room load. Copper condenser coil ensures high cooling efficiency and durability. Multi-stage filtration for clean air.',
      highlights: ['Super-efficient 5-Star Energy Rating', 'Adjustable multi-tonnage variable compressor', '100% copper condenser coil durable build', 'Multi-stage dust and allergen air filter'],
      price: 38990,
      mrp: 52990,
      category: catMap['Appliances'],
      brand: 'Voltas',
      images: ['https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600'],
      stock: 30,
      ratings: 4.3,
      numReviews: 215,
      specifications: [
        { key: 'Capacity', value: '1.5 Ton (Ideal for 111-150 sq ft)' },
        { key: 'Energy Rating', value: '5 Star' },
        { key: 'Condenser Coil', value: '100% Copper' },
        { key: 'Noise Level', value: '38 dB' }
      ],
      isFeatured: false,
      tags: ['voltas', 'air conditioner', 'ac', 'split ac', 'cooling', 'summer', 'appliances']
    },
    {
      name: 'Philips Daily Collection Air Fryer',
      slug: 'philips-daily-collection-air-fryer',
      description: 'Cook delicious, healthy meals with up to 90% less oil using the Philips Daily Collection Air Fryer. Powered by patented Rapid Air technology that circulates hot air to make food crispy on the outside and tender on the inside. Perfect for frying, baking, grilling, and roasting.',
      highlights: ['90% less oil healthy cooking', 'Patented Rapid Air hot air circulation', 'Versatile frying, baking, grilling, roasting', 'Easy-to-clean non-stick food basket'],
      price: 6999,
      mrp: 9995,
      category: catMap['Appliances'],
      brand: 'Philips',
      images: ['https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=600'],
      stock: 85,
      ratings: 4.7,
      numReviews: 890,
      specifications: [
        { key: 'Capacity', value: '4.1 Liters' },
        { key: 'Wattage', value: '1400 Watts' },
        { key: 'Temperature Range', value: '80 to 200 degrees C' },
        { key: 'Timer Range', value: 'Up to 30 minutes' }
      ],
      isFeatured: false,
      tags: ['philips', 'air fryer', 'fryer', 'healthy cooking', 'kitchenware', 'appliances']
    },
    {
      name: 'Havells 25L Storage Water Heater',
      slug: 'havells-25l-storage-water-heater',
      description: 'Enjoy relaxing hot showers with the Havells Monza EC 25L Storage Water Heater. Crafted with a corrosion-resistant glass-coated heating element and thick rolled steel tank. Features Earth Leakage Circuit Breaker (ELCB) for ultimate shock protection and high-density PUF insulation.',
      highlights: ['Rustproof glass-coated heating element', 'Thick durable rolled steel tank build', 'Built-in ELCB electrical shock safety', 'High density PUF insulation heat retention'],
      price: 8499,
      mrp: 12900,
      category: catMap['Appliances'],
      brand: 'Havells',
      images: ['https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600'],
      stock: 45,
      ratings: 4.4,
      numReviews: 124,
      specifications: [
        { key: 'Capacity', value: '25 Liters' },
        { key: 'Wattage', value: '2000 Watts' },
        { key: 'Pressure Limit', value: '8 Bars (High Rise compatible)' },
        { key: 'Mounting Type', value: 'Vertical Wall Mount' }
      ],
      isFeatured: false,
      tags: ['havells', 'water heater', 'geyser', 'shower', 'appliances', 'bathroom']
    },
    {
      name: 'Bajaj Majesty DX-7 Dry Iron',
      slug: 'bajaj-majesty-dx-7-dry-iron',
      description: 'Keep your clothes crisp and wrinkle-free with the Bajaj Majesty DX-7 Dry Iron. Lightweight yet highly efficient, it features a premium non-stick coated golden soleplate for smooth gliding. Equipped with a thermostatic control dial, safety thermal fuse, and 360-degree swivel cord.',
      highlights: ['Premium non-stick golden soleplate', 'Lightweight highly efficient heating design', 'Accurate thermostatic dial fabric settings', '360 degree easy movement swivel cord'],
      price: 649,
      mrp: 999,
      category: catMap['Appliances'],
      brand: 'Bajaj',
      images: ['https://images.unsplash.com/photo-1626806787426-5910811b6325?w=600'],
      stock: 150,
      ratings: 4.1,
      numReviews: 2450,
      specifications: [
        { key: 'Power Consumption', value: '1000 Watts' },
        { key: 'Soleplate Type', value: 'Golden Teflon Non-Stick' },
        { key: 'Weight', value: '0.7 kg' },
        { key: 'Indicator Light', value: 'Yes (Auto cut-off)' }
      ],
      isFeatured: false,
      tags: ['bajaj', 'iron', 'dry iron', 'laundry', 'clothing care', 'appliances']
    },
    {
      name: 'Elica 60 cm Filterless Kitchen Chimney',
      slug: 'elica-60-cm-kitchen-chimney',
      description: 'Keep your kitchen clean and smoke-free with the Elica 60 cm Filterless Kitchen Chimney. Boasts a powerful suction capacity of 1200 m3/h. The filterless technology features an autoleak wall design that separates oil from smoke. Smart motion sensor controls for hand-wave operation.',
      highlights: ['High suction capacity of 1200 m3/h', 'Smart motion sensor hand-wave control', 'Filterless low maintenance auto-clean', 'Elegant black tempered glass look'],
      price: 11999,
      mrp: 18999,
      category: catMap['Appliances'],
      brand: 'Elica',
      images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600'],
      stock: 18,
      ratings: 4.3,
      numReviews: 96,
      specifications: [
        { key: 'Size', value: '60 cm (Ideal for 2-3 burner stove)' },
        { key: 'Suction Power', value: '1200 m3/h' },
        { key: 'Control Type', value: 'Touch & Motion Sensor' },
        { key: 'Auto Clean', value: 'Yes (Heat Auto Clean)' }
      ],
      isFeatured: false,
      tags: ['elica', 'chimney', 'kitchen hood', 'exhaust', 'appliances', 'cooking']
    },
    {
      name: 'Kent Grand Plus Water Purifier',
      slug: 'kent-grand-plus-water-purifier',
      description: 'Drink safe, pure water with the Kent Grand Plus Wall-Mountable RO Purifier. Utilizes an advanced Mineral RO technology with double purification of RO + UV + UF. The patented TDS Controller retains essential natural minerals in purified water. Includes a spacious 9L storage tank.',
      highlights: ['Advanced RO+UV+UF multi purification', 'Patented mineral TDS control retaining quality', 'Spacious 9 Liter storage tank with level indicators', 'Fully automatic cut-off and clean cycles'],
      price: 16490,
      mrp: 19500,
      category: catMap['Appliances'],
      brand: 'Kent',
      images: ['https://images.unsplash.com/photo-1609137144813-ad375549079a?w=600'],
      stock: 40,
      ratings: 4.5,
      numReviews: 312,
      specifications: [
        { key: 'Purification Tech', value: 'RO + UV + UF + TDS Control' },
        { key: 'Storage Capacity', value: '9 Liters' },
        { key: 'Purification Capacity', value: '20 Liters / Hour' },
        { key: 'Filter Elements', value: 'Sediment, Carbon, RO Membrane, UV lamp' }
      ],
      isFeatured: false,
      tags: ['kent', 'water purifier', 'ro', 'filter', 'drinking water', 'appliances']
    },
    {
      name: 'Morphy Richards 30L Convection Microwave',
      slug: 'morphy-richards-30l-microwave',
      description: 'Bake, grill, defrost, and reheat with the Morphy Richards 30L Convection Microwave Oven. Features 5 power levels, 200+ auto-cook menus, and a high-quality stainless steel cavity for uniform heating. Complete with child-lock protection and sensory touch control panel.',
      highlights: ['Convection, grill & solo cooking modes', '200+ automatic recipe cook menus', 'Uniform stainless steel heating cavity', 'Child-safety electronic panel lock'],
      price: 13499,
      mrp: 18999,
      category: catMap['Appliances'],
      brand: 'Morphy Richards',
      images: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600'],
      stock: 35,
      ratings: 4.4,
      numReviews: 120,
      specifications: [
        { key: 'Capacity', value: '30 Liters' },
        { key: 'Cavity Material', value: 'Stainless Steel' },
        { key: 'Control Type', value: 'Tactile Dial & Touch Panel' },
        { key: 'Auto Cook Menus', value: '200 Standard Menus' }
      ],
      isFeatured: false,
      tags: ['morphy richards', 'microwave', 'oven', 'baking', 'grill', 'appliances', 'cooking']
    },
    {
      name: 'Dyson V8 Absolute Cordless Vacuum Cleaner',
      slug: 'dyson-v8-absolute-vacuum-cleaner',
      description: 'The Dyson V8 Absolute cordless vacuum cleaner delivers powerful suction for deep cleaning across your entire home. Engineered for homes with pets, it captures hair, dust, allergens, and pet dander. Easily converts to a handheld vacuum for stairs, cars, and upholstery.',
      highlights: ['Powerful Dyson digital motor V8 suction', 'Tangle-free de-tangling Motorbar cleaner head', 'Up to 40 minutes fade-free power', 'Advanced whole-machine filtration'],
      price: 34900,
      mrp: 39900,
      category: catMap['Appliances'],
      brand: 'Dyson',
      images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600'],
      stock: 20,
      ratings: 4.8,
      numReviews: 145,
      specifications: [
        { key: 'Weight', value: '2.5 kg' },
        { key: 'Run Time', value: 'Up to 40 minutes' },
        { key: 'Bin Volume', value: '0.54 Liters' },
        { key: 'Included Tools', value: 'Fluffy head, Motorbar head, Crevice tool' }
      ],
      isFeatured: true,
      tags: ['dyson', 'vacuum cleaner', 'cordless', 'home cleaning', 'dusting', 'appliances']
    },

    // =========================================================================
    // CATEGORY: Books (11 Products)
    // =========================================================================
    {
      name: 'The Psychology of Money by Morgan Housel',
      slug: 'the-psychology-of-money-book',
      description: 'Doing well with money isn\'t necessarily about what you know. It\'s about how you behave. And behavior is hard to teach, even to really smart people. Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of life\'s financial decisions.',
      highlights: ['19 highly engaging short stories', 'Practical wisdom on wealth and greed', 'Easy to understand clear language', 'Worldwide personal finance bestseller'],
      price: 299,
      mrp: 399,
      category: catMap['Books'],
      brand: 'Jaico Books',
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
      stock: 120,
      ratings: 4.8,
      numReviews: 4500,
      specifications: [
        { key: 'Author', value: 'Morgan Housel' },
        { key: 'Format', value: 'Paperback' },
        { key: 'Language', value: 'English' },
        { key: 'Pages Count', value: '252 Pages' }
      ],
      isFeatured: true,
      tags: ['morgan housel', 'book', 'finance', 'investing', 'psychology', 'reading', 'bestseller']
    },
    {
      name: 'Atomic Habits by James Clear',
      slug: 'atomic-habits-james-clear-book',
      description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
      highlights: ['Practical framework for micro habits', 'Scientific backed advice on behaviour', 'Focuses on 1% daily improvements', 'Over 15 million copies sold globally'],
      price: 499,
      mrp: 799,
      category: catMap['Books'],
      brand: 'Penguin Books',
      images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600'],
      stock: 140,
      ratings: 4.9,
      numReviews: 6120,
      specifications: [
        { key: 'Author', value: 'James Clear' },
        { key: 'Format', value: 'Paperback' },
        { key: 'Language', value: 'English' },
        { key: 'Pages Count', value: '320 Pages' }
      ],
      isFeatured: true,
      tags: ['james clear', 'book', 'self help', 'habits', 'motivation', 'productivity', 'psychology']
    },
    {
      name: 'Rich Dad Poor Dad by Robert Kiyosaki',
      slug: 'rich-dad-poor-dad-book',
      description: 'Rich Dad Poor Dad is Robert Kiyosaki\'s story of growing up with two dads—his real father and the father of his best friend, his rich dad—and the ways in which both men shaped his thoughts about money and investing. Explodes the myth that you need to earn a high income to be rich.',
      highlights: ['Explains assets versus liabilities simply', 'Debunks standard wage income dependency myths', 'Practical financial literacy principles', 'Timeless classics for young minds'],
      price: 349,
      mrp: 499,
      category: catMap['Books'],
      brand: 'Plata Publishing',
      images: ['https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=600'],
      stock: 100,
      ratings: 4.7,
      numReviews: 3200,
      specifications: [
        { key: 'Author', value: 'Robert T. Kiyosaki' },
        { key: 'Format', value: 'Paperback' },
        { key: 'Language', value: 'English' },
        { key: 'Pages Count', value: '336 Pages' }
      ],
      isFeatured: false,
      tags: ['robert kiyosaki', 'book', 'finance', 'investing', 'wealth', 'literacy']
    },
    {
      name: 'Ikigai: The Japanese Secret to a Long and Happy Life',
      slug: 'ikigai-japanese-secret-book',
      description: 'Bring meaning and joy to all your days with the international bestseller Ikigai. The Japanese believe that everyone has an ikigai—a reason for being. Finding it is the key to a happier, longer, and more fulfilled life. Explore Japanese longevity, lifestyle, and mindset.',
      highlights: ['Discovering your inner purpose & joy', 'Longevity insights from Okinawa blue zone', 'Mindfulness, nutrition and exercise tips', 'Delicately bound beautiful hardcover design'],
      price: 329,
      mrp: 499,
      category: catMap['Books'],
      brand: 'Random House',
      images: ['https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600'],
      stock: 110,
      ratings: 4.6,
      numReviews: 2450,
      specifications: [
        { key: 'Author', value: 'Hector Garcia & Francesc Miralles' },
        { key: 'Format', value: 'Hardcover' },
        { key: 'Language', value: 'English' },
        { key: 'Pages Count', value: '208 Pages' }
      ],
      isFeatured: false,
      tags: ['ikigai', 'book', 'japan', 'mindfulness', 'happiness', 'longevity', 'purpose']
    },
    {
      name: 'The Alchemist by Paulo Coelho',
      slug: 'the-alchemist-book',
      description: 'Paulo Coelho\'s masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined. An inspiring fable about following your dreams.',
      highlights: ['Philosophical inspiring life adventure', 'Beautiful allegorical storytelling', 'Encourages pursuing your personal legend', 'Translated into over 80 languages'],
      price: 249,
      mrp: 350,
      category: catMap['Books'],
      brand: 'HarperCollins',
      images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
      stock: 90,
      ratings: 4.7,
      numReviews: 5120,
      specifications: [
        { key: 'Author', value: 'Paulo Coelho' },
        { key: 'Format', value: 'Paperback' },
        { key: 'Language', value: 'English' },
        { key: 'Pages Count', value: '172 Pages' }
      ],
      isFeatured: false,
      tags: ['paulo coelho', 'book', 'novel', 'fiction', 'philosophy', 'dreamer', 'alchemist']
    },
    {
      name: 'Sapiens: A Brief History of Humankind by Yuval Noah Harari',
      slug: 'sapiens-yuval-noah-harari-book',
      description: 'Destined to become a modern classic, Sapiens explores how Homo Sapiens succeeded in the battle for dominance. Yuval Noah Harari covers 70,000 years of human history, from the first cognitive revolution to the scientific and industrial revolutions, and how they shaped our modern society.',
      highlights: ['Broad historical survey of human evolution', 'Fascinating theories on agricultural shift', 'Provocative cultural and scientific look', 'Highly praised by top intellects globally'],
      price: 549,
      mrp: 899,
      category: catMap['Books'],
      brand: 'Vintage Publishing',
      images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'],
      stock: 65,
      ratings: 4.7,
      numReviews: 1845,
      specifications: [
        { key: 'Author', value: 'Yuval Noah Harari' },
        { key: 'Format', value: 'Paperback' },
        { key: 'Language', value: 'English' },
        { key: 'Pages Count', value: '512 Pages' }
      ],
      isFeatured: false,
      tags: ['yuval noah harari', 'book', 'history', 'sapiens', 'evolution', 'science', 'nonfiction']
    },
    {
      name: 'Think and Grow Rich by Napoleon Hill',
      slug: 'think-and-grow-rich-book',
      description: 'Think and Grow Rich has been called the Granddaddy of All Motivational Literature. It was the first book to boldly ask, "What makes a winner?" Napoleon Hill researched more than 500 self-made millionaires, including Andrew Carnegie, Henry Ford, and Thomas Edison, to uncover the secrets to success.',
      highlights: ['Thirteen steps formula to success', 'Interviews with industrial millionaires', 'Focuses on power of active belief', 'Classic timeless self-mastery handbook'],
      price: 199,
      mrp: 299,
      category: catMap['Books'],
      brand: 'High Roads',
      images: ['https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600'],
      stock: 120,
      ratings: 4.5,
      numReviews: 960,
      specifications: [
        { key: 'Author', value: 'Napoleon Hill' },
        { key: 'Format', value: 'Paperback' },
        { key: 'Language', value: 'English' },
        { key: 'Pages Count', value: '384 Pages' }
      ],
      isFeatured: false,
      tags: ['napoleon hill', 'book', 'success', 'mindset', 'wealth', 'motivation', 'classic']
    },
    {
      name: 'Good to Great by Jim Collins',
      slug: 'good-to-great-jim-collins-book',
      description: 'Can a good company become a great company and, if so, how? Jim Collins and his research team identified a group of elite companies that made the leap to great results and sustained those results for at least fifteen years. Learn the key management strategies that drive massive success.',
      highlights: ['Rigorous 5-year business case studies', 'Uncovers the Level 5 Leadership concepts', 'The Hedgehog concept focus principles', 'Essential read for managers & founders'],
      price: 599,
      mrp: 999,
      category: catMap['Books'],
      brand: 'Harper Business',
      images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600'],
      stock: 45,
      ratings: 4.6,
      numReviews: 432,
      specifications: [
        { key: 'Author', value: 'Jim Collins' },
        { key: 'Format', value: 'Hardcover' },
        { key: 'Language', value: 'English' },
        { key: 'Pages Count', value: '320 Pages' }
      ],
      isFeatured: false,
      tags: ['jim collins', 'book', 'business', 'leadership', 'management', 'growth', 'strategy']
    },
    {
      name: 'Dune by Frank Herbert',
      slug: 'dune-frank-herbert-book',
      description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange. A stunning blend of adventure, mysticism, environmentalism, and politics.',
      highlights: ['Unrivalled science fiction masterpiece', 'Deep ecological & political themes', 'Rich worldbuilding with sandstorms & spice', 'Hugo and Nebula award-winning novel'],
      price: 399,
      mrp: 599,
      category: catMap['Books'],
      brand: 'Ace Books',
      images: ['https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600'],
      stock: 75,
      ratings: 4.8,
      numReviews: 1240,
      specifications: [
        { key: 'Author', value: 'Frank Herbert' },
        { key: 'Format', value: 'Paperback' },
        { key: 'Language', value: 'English' },
        { key: 'Pages Count', value: '608 Pages' }
      ],
      isFeatured: false,
      tags: ['frank herbert', 'book', 'sci-fi', 'dune', 'desert', 'novel', 'fantasy']
    },
    {
      name: 'The Silent Patient by Alex Michaelides',
      slug: 'the-silent-patient-book',
      description: 'Alicia Berenson\'s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house in London. One evening her husband returns home late, and Alicia shoots him five times in the face, and then never speaks another word. A shocking psychological thriller.',
      highlights: ['Unputdownable mind-bending plot twist', 'Deep exploration of psychotherapeutic cases', 'Dark atmospheric mystery suspense', 'Multi-million copy runaway bestseller'],
      price: 299,
      mrp: 399,
      category: catMap['Books'],
      brand: 'Celadon Books',
      images: ['https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600'],
      stock: 80,
      ratings: 4.5,
      numReviews: 1870,
      specifications: [
        { key: 'Author', value: 'Alex Michaelides' },
        { key: 'Format', value: 'Paperback' },
        { key: 'Language', value: 'English' },
        { key: 'Pages Count', value: '336 Pages' }
      ],
      isFeatured: false,
      tags: ['alex michaelides', 'book', 'thriller', 'mystery', 'psychological', 'novel', 'fiction']
    },
    {
      name: "Man's Search for Meaning by Viktor Frankl",
      slug: 'mans-search-for-meaning-book',
      description: 'Psychiatrist Viktor Frankl\'s memoir has riveted generations of readers with its descriptions of life in Nazi death camps and its lessons for spiritual survival. Based on his own experience and the stories of his patients, Frankl argues that we cannot avoid suffering but we can choose how to cope with it.',
      highlights: ['First-hand account of concentration camps', 'Introduces Frankl\'s Logotherapy theories', 'Deeply moving philosophical insights', 'Voted among ten most influential books'],
      price: 229,
      mrp: 350,
      category: catMap['Books'],
      brand: 'Beacon Press',
      images: ['https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600'],
      stock: 60,
      ratings: 4.9,
      numReviews: 2840,
      specifications: [
        { key: 'Author', value: 'Viktor E. Frankl' },
        { key: 'Format', value: 'Paperback' },
        { key: 'Language', value: 'English' },
        { key: 'Pages Count', value: '160 Pages' }
      ],
      isFeatured: true,
      tags: ['viktor frankl', 'book', 'philosophy', 'psychology', 'holocaust', 'memoir', 'meaning']
    },

    // =========================================================================
    // CATEGORY: Sports (11 Products)
    // =========================================================================
    {
      name: 'Cosco Monaco Football Size 5',
      slug: 'cosco-monaco-football-size-5',
      description: 'Play like a pro with the Cosco Monaco Football. Featuring an official size 5 dimensions, it is designed for professional and training matches. Crafted with 32 panels of hand-stitched premium PVC synthetic leather, high-bounce latex bladder, and reinforced backing fabric.',
      highlights: ['Official Size 5 standard match ball', 'Premium hand-stitched synthetic PVC leather', '32-panel structural geometric design', 'High retention latex air bladder'],
      price: 799,
      mrp: 1199,
      category: catMap['Sports'],
      brand: 'Cosco',
      images: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600'],
      stock: 90,
      ratings: 4.3,
      numReviews: 245,
      specifications: [
        { key: 'Size', value: 'Size 5' },
        { key: 'Stitching', value: 'Hand Stitched' },
        { key: 'Material', value: 'Premium PVC Synthetic' },
        { key: 'Suitable For', value: 'Hard Grass & Turf Ground' }
      ],
      isFeatured: true,
      tags: ['cosco', 'football', 'soccer ball', 'sports', 'outdoor', 'games', 'play']
    },
    {
      name: 'Nivia Storm Volleyball',
      slug: 'nivia-storm-volleyball',
      description: 'Excel in your volleyball games with the Nivia Storm Volleyball. Made of high-quality premium micro-fiber composite leather. Features an 18-panel construction, butyl bladder for long air retention, and excellent hand feel with minimum impact force on your arms.',
      highlights: ['Premium micro-fiber composite leather feel', '18-panel perfectly balanced configuration', 'Sturdy butyl bladder ensures high retention', 'Excellent soft-touch minimum impact force'],
      price: 649,
      mrp: 999,
      category: catMap['Sports'],
      brand: 'Nivia',
      images: ['https://images.unsplash.com/photo-1593787406536-3676a152d9cb?w=600'],
      stock: 110,
      ratings: 4.4,
      numReviews: 184,
      specifications: [
        { key: 'Size', value: 'Standard Size 4' },
        { key: 'Panels', value: '18 Panels' },
        { key: 'Bladder', value: 'Butyl Bladder' },
        { key: 'Type', value: 'Outdoor & Indoor Match Volleyball' }
      ],
      isFeatured: false,
      tags: ['nivia', 'volleyball', 'ball', 'sports', 'games', 'indoor', 'outdoor']
    },
    {
      name: 'Yonex ZR 100 Light Badminton Racquet',
      slug: 'yonex-zr-100-light-racquet',
      description: 'Dominate the badminton court with the Yonex ZR 100 Light Racquet. Features an aluminum frame with a durable steel shaft, an isometric head shape that increases the sweet spot, and an ultra-lightweight design (approx 95g) that provides swift swings and powerful smashes.',
      highlights: ['Isometric head larger sweet-spot hit', 'Durable lightweight aluminum/steel frame', 'Ultra-lightweight 95g body swift swings', 'Includes premium protective full head cover'],
      price: 1199,
      mrp: 1999,
      category: catMap['Sports'],
      brand: 'Yonex',
      images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600'],
      stock: 80,
      ratings: 4.5,
      numReviews: 412,
      specifications: [
        { key: 'Frame Material', value: 'Aluminum' },
        { key: 'Shaft Material', value: 'Steel' },
        { key: 'Weight', value: 'U (95 - 99.9g)' },
        { key: 'String Tension', value: '16 - 20 lbs' }
      ],
      isFeatured: true,
      tags: ['yonex', 'badminton', 'racquet', 'shuttle', 'sports', 'indoor', 'play']
    },
    {
      name: 'Decathlon Quechua 20L Hiking Backpack',
      slug: 'decathlon-quechua-20l-backpack',
      description: 'Designed for hiking and outdoor trails, this Quechua 20L backpack offers great comfort and functionality. Features a padded back panel, adjustable shoulder and chest straps, multiple secure zip compartments, and water bottle holders on both sides. Water-resistant canvas.',
      highlights: ['Spacious 20 Liters carrying volume', 'Ergonomic padded back ventilation panel', 'Comfortable chest & shoulder adjustable straps', 'Water-resistant outdoor duty canvas'],
      price: 999,
      mrp: 1499,
      category: catMap['Sports'],
      brand: 'Decathlon',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
      stock: 65,
      ratings: 4.6,
      numReviews: 310,
      specifications: [
        { key: 'Capacity', value: '20 Liters' },
        { key: 'Material', value: '100% Polyester (Water-resistant)' },
        { key: 'Weight', value: '470g' },
        { key: 'Pockets', value: '1 Main, 2 Side, 1 Front Zip Pocket' }
      ],
      isFeatured: false,
      tags: ['decathlon', 'quechua', 'backpack', 'bag', 'hiking', 'trekking', 'sports', 'travel']
    },
    {
      name: 'Aurion Dumbbell Set (10 kg)',
      slug: 'aurion-dumbbell-set-10kg',
      description: 'Build strength and tone muscle at home with the Aurion Adjustable PVC Dumbbell Set. Includes 4 weight plates (2.5 kg each), a solid chrome-plated dumbbell rod with star-lock collars, and non-slip rubber grips. Ideal for professional strength training and home gym setups.',
      highlights: ['Adjustable solid 10 kg weight setup', '4 durable PVC-filled weight plates (2.5kg)', 'Solid chrome steel rod with star collar locks', 'Non-slip secure ergonomic rubber grip'],
      price: 599,
      mrp: 1200,
      category: catMap['Sports'],
      brand: 'Aurion',
      images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600'],
      stock: 50,
      ratings: 4.1,
      numReviews: 124,
      specifications: [
        { key: 'Total Weight', value: '10 kg (5 kg x 2 Dumbbells)' },
        { key: 'Plates Configuration', value: '4 Plates of 2.5 kg each' },
        { key: 'Material Type', value: 'PVC filled with sand/iron grit' },
        { key: 'Included', value: '1 Pairs of Dumbbell rods & 4 collar locks' }
      ],
      isFeatured: false,
      tags: ['aurion', 'dumbbells', 'weights', 'gym', 'workout', 'fitness', 'home gym', 'exercise']
    },
    {
      name: 'Vector X Premium Yoga Mat (6mm)',
      slug: 'vector-x-premium-yoga-mat',
      description: 'Enhance your yoga and pilates sessions with the Vector X Premium 6mm Yoga Mat. Made of eco-friendly, non-toxic EVA material with dual-sided non-slip textures. Provides optimal cushioning, joint protection, and grip during challenging balance poses. Lightweight and easy to clean.',
      highlights: ['Optimal 6mm joint cushion thickness', 'Eco-friendly non-toxic EVA material', 'Dual sided anti-skid grip textures', 'Lightweight rollable carrying strap included'],
      price: 499,
      mrp: 999,
      category: catMap['Sports'],
      brand: 'Vector X',
      images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600'],
      stock: 120,
      ratings: 4.2,
      numReviews: 245,
      specifications: [
        { key: 'Thickness', value: '6 mm' },
        { key: 'Dimensions', value: '183cm x 61cm' },
        { key: 'Material Type', value: 'High Density EVA' },
        { key: 'Wash Care', value: 'Wipe with damp cloth' }
      ],
      isFeatured: false,
      tags: ['vector x', 'yoga mat', 'fitness', 'meditation', 'gym', 'exercise', 'mat']
    },
    {
      name: 'Spalding NBA Highlight Basketball',
      slug: 'spalding-nba-highlight-basketball',
      description: 'The Spalding NBA Highlight basketball is built for indoor and outdoor recreational play. Featuring a durable rubber cover that stands up to rough court surfaces. Designed with unique gold decals, deep channels for excellent finger grip, and reliable air retention.',
      highlights: ['All-surface indoor/outdoor durable rubber', 'Deep channels for high grip finger control', 'Exclusive NBA Highlight black/gold graphics', 'Sturdy bladder ensures high bounce retention'],
      price: 1499,
      mrp: 2499,
      category: catMap['Sports'],
      brand: 'Spalding',
      images: ['https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600'],
      stock: 40,
      ratings: 4.6,
      numReviews: 189,
      specifications: [
        { key: 'Size', value: 'Size 7 (Official Mens Size)' },
        { key: 'Cover Material', value: 'Durable Textured Rubber' },
        { key: 'Playing Surface', value: 'Outdoor / Concrete Courts' },
        { key: 'Bladder Type', value: 'Butyl Bladder' }
      ],
      isFeatured: false,
      tags: ['spalding', 'basketball', 'ball', 'sports', 'games', 'outdoor', 'nba']
    },
    {
      name: 'DSC Condor Cricket Bat',
      slug: 'dsc-condor-cricket-bat',
      description: 'Unleash powerful strokes with the DSC Condor Kashmir Willow Cricket Bat. Exquisitely handcrafted from selected premium Kashmir willow, it features a traditional full profile, thick edges, and a pronounced bow that delivers an incredible sweet spot. Short handle with scale grip.',
      highlights: ['Premium hand-selected Kashmir willow wood', 'Pronounced bow creates massive sweet spot', 'Thick sturdy edges powerful stroke-play', 'High grip treble-spring cane short handle'],
      price: 1999,
      mrp: 2999,
      category: catMap['Sports'],
      brand: 'DSC',
      images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600'],
      stock: 35,
      ratings: 4.4,
      numReviews: 96,
      specifications: [
        { key: 'Wood Type', value: 'Selected Kashmir Willow' },
        { key: 'Handle Type', value: 'Short Cane Handle' },
        { key: 'Weight Range', value: '1180 - 1240 grams' },
        { key: 'Edge Thickness', value: '38 - 40 mm' }
      ],
      isFeatured: false,
      tags: ['dsc', 'cricket', 'bat', 'cricket bat', 'sports', 'play', 'kashmir willow']
    },
    {
      name: 'Strauss Adjustable Hand Grip Strengthener',
      slug: 'strauss-adjustable-hand-grip',
      description: 'Increase finger, wrist, and forearm strength with the Strauss Hand Grip Strengthener. Features an easily adjustable resistance range from 10 kg to 40 kg via a rotary dial. Ergonomic non-slip rubberized handles ensure a secure and comfortable grip for hands of all sizes.',
      highlights: ['Adjustable resistance range of 10-40 kg', 'Easy turning rotary dial adjustments', 'Ergonomic non-slip secure rubber grips', 'Heavy duty steel tension coil spring'],
      price: 249,
      mrp: 499,
      category: catMap['Sports'],
      brand: 'Strauss',
      images: ['https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=600'],
      stock: 140,
      ratings: 4.2,
      numReviews: 212,
      specifications: [
        { key: 'Resistance Level', value: '10 kg to 40 kg Adjustable' },
        { key: 'Spring Material', value: 'Heavy Duty Stainless Steel' },
        { key: 'Grip Material', value: 'Rubberized Non-Slip' },
        { key: 'Ideal For', value: 'Forearm, wrist and finger workout' }
      ],
      isFeatured: false,
      tags: ['strauss', 'hand grip', 'exerciser', 'workout', 'gym', 'forearm', 'fitness']
    },
    {
      name: 'Lextra Skipping Rope with Counter',
      slug: 'lextra-skipping-rope-with-counter',
      description: 'Take your cardio and weight loss routine to the next level with the Lextra Skipping Rope. Features a built-in mechanical jump counter on the handle that automatically tracks your workouts. Adjustable length tangle-free steel wire with soft memory foam handles.',
      highlights: ['Built-in mechanical automatic jump counter', 'Tangle-free adjustable steel wire rope', 'Soft comfortable memory foam handles', 'Perfect indoor cardio weight loss routine'],
      price: 299,
      mrp: 599,
      category: catMap['Sports'],
      brand: 'Lextra',
      images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600'],
      stock: 160,
      ratings: 4.1,
      numReviews: 142,
      specifications: [
        { key: 'Rope Material', value: 'Steel Wire coated with PVC' },
        { key: 'Max Rope Length', value: '9.8 feet (Adjustable)' },
        { key: 'Counter Range', value: '000 to 999 jumps' },
        { key: 'Handle Grip', value: 'Memory Foam' }
      ],
      isFeatured: false,
      tags: ['lextra', 'skipping rope', 'jump rope', 'fitness', 'cardio', 'weight loss', 'exercise']
    },
    {
      name: 'Speedo Swimming Goggles',
      slug: 'speedo-swimming-goggles',
      description: 'Get crystal-clear underwater vision with the Speedo Mariner Supreme Swimming Goggles. Features wide anti-fog coated lenses, 100% UV protection, and a soft hypoallergenic silicone seal that prevents water leakage. Adjustable double head strap ensures a secure and comfortable fit.',
      highlights: ['Wide lenses coated with anti-fog tech', '100% UV solar radiation protection', 'Hypoallergenic soft leak-proof silicone seal', 'Adjustable double silicone head straps'],
      price: 799,
      mrp: 1199,
      category: catMap['Sports'],
      brand: 'Speedo',
      images: ['https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600'],
      stock: 75,
      ratings: 4.4,
      numReviews: 160,
      specifications: [
        { key: 'Lens Coating', value: 'Anti-Fog & UV Protection' },
        { key: 'Strap Material', value: '100% Silicone' },
        { key: 'Gasket Material', value: 'Soft Silicone' },
        { key: 'Fit', value: 'Adjustable Nose bridge & Strap' }
      ],
      isFeatured: false,
      tags: ['speedo', 'goggles', 'swimming', 'water sports', 'pool', 'swim wear']
    },

    // =========================================================================
    // CATEGORY: Beauty (11 Products)
    // =========================================================================
    {
      name: "L'Oreal Paris Revitalift Serum",
      slug: 'loreal-paris-revitalift-serum',
      description: 'Achieve radiant, youthful skin with the L\'Oreal Paris Revitalift 1.5% Pure Hyaluronic Acid Serum. It intensely hydrates, plumps up fine lines, and reduces wrinkles in just a few weeks. Lightweight, non-sticky formula that absorbs quickly. Paraben-free, fragrance-free.',
      highlights: ['1.5% Pure Hyaluronic Acid concentration', 'Intense hydration plumps up fine lines', 'Fast-absorbing lightweight non-sticky formula', 'Dermatologist tested paraben & fragrance free'],
      price: 849,
      mrp: 999,
      category: catMap['Beauty'],
      brand: "L'Oreal",
      images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
      stock: 80,
      ratings: 4.5,
      numReviews: 942,
      specifications: [
        { key: 'Skin Type', value: 'All Skin Types' },
        { key: 'Volume', value: '30 ml' },
        { key: 'Form', value: 'Liquid Serum' },
        { key: 'Benefit', value: 'Anti-Aging & Intense Hydration' }
      ],
      isFeatured: true,
      tags: ['loreal', 'l\'oreal', 'serum', 'skincare', 'face care', 'hyaluronic', 'beauty']
    },
    {
      name: 'Maybelline New York Fit Me Matte Foundation',
      slug: 'maybelline-fit-me-foundation',
      description: 'Get a flawless, natural-looking matte finish with Maybelline Fit Me Foundation. Featuring an ultra-lightweight formula that contains micro-powders to absorb excess shine and blur pores. Matches natural skin tone, stays fresh for up to 12 hours, and is dermatologically tested.',
      highlights: ['Natural-looking perfect matte finish', 'Shine absorbing active micro-powders', 'Lightweight breathable 12-hour wear', 'Dermatologically and allergy tested'],
      price: 499,
      mrp: 649,
      category: catMap['Beauty'],
      brand: 'Maybelline',
      images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'],
      stock: 120,
      ratings: 4.3,
      numReviews: 1240,
      specifications: [
        { key: 'Shade', value: '128 Warm Nude' },
        { key: 'Volume', value: '30 ml' },
        { key: 'Coverage', value: 'Medium (Buildable)' },
        { key: 'Finish', value: 'Matte' }
      ],
      isFeatured: true,
      tags: ['maybelline', 'foundation', 'makeup', 'face makeup', 'fit me', 'cosmetic', 'beauty']
    },
    {
      name: 'The Body Shop British Rose Body Butter',
      slug: 'the-body-shop-british-rose-body-butter',
      description: 'Pamper your body with the rich, velvety texture of The Body Shop British Rose Body Butter. Infused with real English rose extract, it delivers up to 24 hours of intense moisturization. Leaves your skin feeling silky-soft, glowing, and smelling like a beautiful fresh rose garden.',
      highlights: ['Velvety rich moisturizing skin texture', 'Infused with real hand-picked English roses', 'Up to 24 hours deep body moisturization', '100% vegetarian cruelty-free product'],
      price: 1199,
      mrp: 1395,
      category: catMap['Beauty'],
      brand: 'The Body Shop',
      images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600'],
      stock: 60,
      ratings: 4.6,
      numReviews: 215,
      specifications: [
        { key: 'Volume', value: '200 ml' },
        { key: 'Main Ingredient', value: 'English Rose Extract & Shea Butter' },
        { key: 'Fragrance', value: 'Fresh Floral Rose' },
        { key: 'Skin Benefit', value: 'Hydrating and Glow' }
      ],
      isFeatured: false,
      tags: ['body shop', 'body butter', 'cream', 'moisturizer', 'rose', 'skincare', 'beauty']
    },
    {
      name: 'Nivea Soft Light Moisturiser (300ml)',
      slug: 'nivea-soft-light-moisturiser-300ml',
      description: 'Enjoy fresh, beautifully soft skin with Nivea Soft Light Moisturising Cream. Enriched with natural Jojoba Oil and Vitamin E, its quick-absorbing, non-greasy formula instantly refreshes and hydrates your face, hands, and body. Perfect for daily skin care in all seasons.',
      highlights: ['Enriched with Jojoba Oil & Vitamin E', 'Fast absorbing non-greasy light formula', 'Instantly refreshes and hydrates skin', 'Perfect for Face, Hands, and Body care'],
      price: 349,
      mrp: 449,
      category: catMap['Beauty'],
      brand: 'Nivea',
      images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'],
      stock: 140,
      ratings: 4.4,
      numReviews: 2450,
      specifications: [
        { key: 'Volume', value: '300 ml' },
        { key: 'Ingredients', value: 'Jojoba Oil, Vitamin E, Glycerin' },
        { key: 'Form', value: 'Soft Light Cream' },
        { key: 'Suitable For', value: 'All Seasons, Daily Use' }
      ],
      isFeatured: false,
      tags: ['nivea', 'moisturizer', 'cream', 'soft cream', 'skincare', 'body care', 'lotion']
    },
    {
      name: 'Cetaphil Gentle Skin Cleanser (250ml)',
      slug: 'cetaphil-gentle-skin-cleanser-250ml',
      description: 'The Cetaphil Gentle Skin Cleanser is a dermatologist-recommended daily face wash formulated for sensitive, dry, and normal skin types. This soap-free, fragrance-free, non-comedogenic cleanser effectively removes dirt, makeup, and impurities while preserving natural moisture.',
      highlights: ['Dermatologist recommended sensitive formula', 'Soap-free, fragrance-free gentle face wash', 'Effectively lifts dirt & light cosmetics', 'Hypoallergenic non-comedogenic ingredients'],
      price: 389,
      mrp: 450,
      category: catMap['Beauty'],
      brand: 'Cetaphil',
      images: ['https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600'],
      stock: 90,
      ratings: 4.7,
      numReviews: 1840,
      specifications: [
        { key: 'Volume', value: '250 ml' },
        { key: 'Skin Type', value: 'Dry to Normal, Sensitive' },
        { key: 'Form', value: 'Creamy Gel Cleanser' },
        { key: 'Ph Balanced', value: 'Yes' }
      ],
      isFeatured: false,
      tags: ['cetaphil', 'cleanser', 'face wash', 'gentle cleanser', 'skincare', 'sensitive skin']
    },
    {
      name: 'M.A.C Retro Matte Lipstick - Ruby Woo',
      slug: 'mac-retro-matte-lipstick-ruby-woo',
      description: 'Make a bold statement with the legendary Ruby Woo lipstick from M.A.C. Featuring a classic retro matte finish that delivers intense, highly pigmented red color that stays vibrant for up to 8 hours. Non-feathering, non-bleeding, and comfortable to wear.',
      highlights: ['Legendary signature Ruby Woo shade', 'Intense retro matte powdery finish', 'Long-lasting 8-hour highly pigmented wear', 'Non-feathering non-bleeding formula'],
      price: 1990,
      mrp: 2300,
      category: catMap['Beauty'],
      brand: 'M.A.C',
      images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'],
      stock: 75,
      ratings: 4.8,
      numReviews: 612,
      specifications: [
        { key: 'Shade Name', value: 'Ruby Woo (Vivid Blue-Red)' },
        { key: 'Weight', value: '3 grams' },
        { key: 'Finish Type', value: 'Retro Matte' },
        { key: 'Form', value: 'Solid Bullet' }
      ],
      isFeatured: false,
      tags: ['mac', 'm.a.c', 'lipstick', 'makeup', 'lip makeup', 'ruby woo', 'cosmetics', 'red lipstick']
    },
    {
      name: 'Forest Essentials Luxury Sugar Soap',
      slug: 'forest-essentials-luxury-sugar-soap',
      description: 'Pamper your skin with Forest Essentials Luxury Sugar Soap. Cold-processed and handcrafted with pure cane sugar, raw organic honey, and rich oils. Gently cleanses the skin while retaining natural moisture, leaving it beautifully supple, hydrated, and delicately scented.',
      highlights: ['Cold-processed artisanal handmade soap', 'Enriched with raw organic honey & cane sugar', 'Deeply hydrates and cleanses gently', 'Delicately scented with natural botanicals'],
      price: 475,
      mrp: 525,
      category: catMap['Beauty'],
      brand: 'Forest Essentials',
      images: ['https://images.unsplash.com/photo-1607006342411-91f11f058fb8?w=600'],
      stock: 110,
      ratings: 4.5,
      numReviews: 124,
      specifications: [
        { key: 'Weight', value: '125 grams' },
        { key: 'Soap Type', value: 'Handmade Sugar Soap' },
        { key: 'Key Ingredients', value: 'Organic Cane Sugar, Raw Honey, Glycerin' },
        { key: 'Free From', value: 'Sulphates, Parabens, Synthetic colors' }
      ],
      isFeatured: false,
      tags: ['forest essentials', 'soap', 'bath soap', 'organic', 'honey', 'skincare', 'handmade']
    },
    {
      name: 'Plum Green Tea Pore Cleansing Face Wash',
      slug: 'plum-green-tea-pore-cleansing-facewash',
      description: 'Say goodbye to acne and oily skin with Plum Green Tea Pore Cleansing Face Wash. Formulated with green tea extracts that are rich in antioxidants, and gentle cellulose beads that exfoliate dead skin cells. 100% vegan, cruelty-free, and free of parabens, phthalates, and SLS.',
      highlights: ['Antioxidant rich organic Green Tea extracts', 'Gentle cellulose beads scrub dead cells', 'Combats acne and controls excess facial sebum', '100% vegan cruelty-free toxic chemical free'],
      price: 279,
      mrp: 349,
      category: catMap['Beauty'],
      brand: 'Plum',
      images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'],
      stock: 130,
      ratings: 4.4,
      numReviews: 412,
      specifications: [
        { key: 'Volume', value: '75 ml' },
        { key: 'Skin Type', value: 'Oily, Combination, Acne-Prone' },
        { key: 'Form', value: 'Foaming Gel with micro beads' },
        { key: 'Vegan', value: 'Yes (100% Vegan & Cruelty-Free)' }
      ],
      isFeatured: false,
      tags: ['plum', 'face wash', 'green tea', 'acne', 'oily skin', 'cleanser', 'vegan']
    },
    {
      name: 'Kama Ayurveda Pure Rose Water',
      slug: 'kama-ayurveda-pure-rose-water',
      description: 'Rejuvenate your skin with Kama Ayurveda\'s Pure Rose Water. Made from the legendary Kannauj Rose through a traditional steam distillation process. This natural toner hydrates, balances pH levels, tightens pores, and instantly refreshes tired skin. Alcohol-free.',
      highlights: ['Kannauj Roses steam distillation process', 'Natural hydrating toner & skin balancer', 'Tightens skin pores & reduces puffiness', '100% natural, alcohol & preservative free'],
      price: 395,
      mrp: 450,
      category: catMap['Beauty'],
      brand: 'Kama Ayurveda',
      images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600'],
      stock: 85,
      ratings: 4.6,
      numReviews: 310,
      specifications: [
        { key: 'Volume', value: '50 ml' },
        { key: 'Ingredient', value: '100% Pure Steam Distilled Rose Water' },
        { key: 'Form', value: 'Liquid Spray' },
        { key: 'Benefits', value: 'Toning, Hydration, Refreshing' }
      ],
      isFeatured: false,
      tags: ['kama ayurveda', 'rose water', 'toner', 'skincare', 'face mist', 'kannauj rose']
    },
    {
      name: 'Nykaa Matte to Last Liquid Lipstick',
      slug: 'nykaa-matte-to-last-liquid-lipstick',
      description: 'Get intense, transfer-proof color with Nykaa Matte to Last Liquid Lipstick. Features a lightweight, long-lasting formula enriched with Vitamin E and antioxidants to keep your lips hydrated. Glides on smoothly and dries down to a rich, comfortable matte finish.',
      highlights: ['Transfer-proof kissproof matte liquid', 'Enriched with moisturizing Vitamin E', 'Lightweight comfortable wear all day', 'Glides smoothly dry to powdery matte'],
      price: 499,
      mrp: 599,
      category: catMap['Beauty'],
      brand: 'Nykaa',
      images: ['https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=600'],
      stock: 140,
      ratings: 4.2,
      numReviews: 198,
      specifications: [
        { key: 'Shade Name', value: 'Madras Kaapi 05' },
        { key: 'Volume', value: '4.5 ml' },
        { key: 'Form', value: 'Liquid with applicator' },
        { key: 'Finish', value: 'Matte Transfer-proof' }
      ],
      isFeatured: false,
      tags: ['nykaa', 'lipstick', 'liquid lipstick', 'makeup', 'lip makeup', 'matte', 'beauty']
    },
    {
      name: 'Lakme Absolute Perfect Radiance Day Cream',
      slug: 'lakme-absolute-perfect-radiance-day-cream',
      description: 'Reveal your inner glow with Lakme Absolute Perfect Radiance Skin Lightening Day Cream. Formulated with precious micro-crystals and skin-lightening vitamins. Provides broad-spectrum SPF 30 sun protection, intensely moisturizes, and fades dark spots for a radiant look.',
      highlights: ['Infused with glowing precious micro-crystals', 'Contains skin lightening complex vitamins', 'Broad-spectrum SPF 30 sun block protection', 'Fades dark spots intensely moisturizes'],
      price: 319,
      mrp: 399,
      category: catMap['Beauty'],
      brand: 'Lakme',
      images: ['https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600'],
      stock: 110,
      ratings: 4.3,
      numReviews: 532,
      specifications: [
        { key: 'Volume', value: '50 grams' },
        { key: 'Sun Protection', value: 'SPF 30' },
        { key: 'Form', value: 'Vanishing Cream' },
        { key: 'Benefit', value: 'Radiant Glow & Sun Protection' }
      ],
      isFeatured: false,
      tags: ['lakme', 'day cream', 'moisturizer', 'spf 30', 'skincare', 'face cream', 'radiance']
    }
  ];
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
    console.log(`Seeded ${seededCategories.length} categories.`);

    console.log('Seeding products...');
    const productsData = getProductsData(seededCategories);
    
    // Automatically calculate the correct discount percentages dynamically to prevent any visual mismatch
    productsData.forEach(p => {
      p.discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
    });

    const seededProducts = await Product.insertMany(productsData);
    console.log(`Seeded ${seededProducts.length} products.`);

    console.log('Seeding coupons...');
    const seededCoupons = await Coupon.insertMany(couponsData);
    console.log(`Seeded ${seededCoupons.length} discount coupons.`);

    console.log('==================================================');
    console.log('Indiacart24 Database seeding completed successfully! 🎉');
    console.log(`- Admin Account: admin@indiacart24.com / Admin@123`);
    console.log(`- User Account:  user@indiacart24.com / User@123`);
    console.log('==================================================');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
};

seedDB();
