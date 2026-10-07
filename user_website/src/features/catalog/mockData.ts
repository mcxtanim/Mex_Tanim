import { Category, Product } from './types';

export const CATEGORIES: Category[] = [];

export const PRODUCTS: Product[] = [
  {
    id: 'sleeves-glide-v2',
    name: 'VERO FORZA GLIDE V2 (1 PAIRS)',
    nameBn: 'ভেরো ফোরজা গ্লাইড ভি২ ফিঙ্গার স্লিভস',
    category: 'finger-sleeves',
    categoryBn: 'ফিঙ্গার স্লিকস',
    brand: 'VERO FORZA',
    brandBn: 'ভেরো ফোরজা',
    price: 250,
    originalPrice: 280,
    discountBadge: '-11%',
    rating: 5.0,
    reviewCount: 2,
    image: '/products/finger-sleeves-glide-v2.svg',
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    description: 'High-density ultra-conductive silver fiber gaming finger sleeves for seamless touch sensitivity.',
    descriptionBn: 'সুপার কন্ডাক্টিভ সিলভার ফাইবার গেমিং ফিঙ্গার স্লিভস ঘাম প্রতিরোধী এবং মসৃণ টাচ রেসপন্স প্রদান করে।',
    specs: ['Conductive Silver Fiber', 'Sweatproof & Breathable', 'High Sensitivity', 'Anti-Friction Glide'],
  },
  {
    id: 'sleeves-glide-pro',
    name: 'VERO FORZA GLIDE PRO V2 (1 PAIRS)',
    nameBn: 'ভেরো ফোরজা গ্লাইড প্রো ভি২ ফিঙ্গার স্লিভস',
    category: 'finger-sleeves',
    categoryBn: 'ফিঙ্গার স্লিকস',
    brand: 'VERO FORZA',
    brandBn: 'ভেরো ফোরজা',
    price: 270,
    originalPrice: 300,
    discountBadge: '-10%',
    rating: 5.0,
    reviewCount: 2,
    image: '/products/finger-sleeves-glide-pro.svg',
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    description: 'Pro tournament edition silver knit sleeves with zero latency and maximum sweat barrier.',
    descriptionBn: 'প্রো টুর্নামেন্ট এডিশন সিলভার নিট স্লিভস জিরো ল্যাটেন্সি ও সর্বোচ্চ ঘাম প্রতিরোধক।',
    specs: ['Superconductive Fiber', 'Ultrathin 0.25mm', 'Zero Friction Glide', 'Elastic Comfort Band'],
  },
  {
    id: 'sleeves-luminous',
    name: 'LIGHTENING LUMINOUS FINGER SLEEVES',
    nameBn: 'লাইটেনিং লুমিনাস ফিঙ্গার স্লিভস',
    category: 'finger-sleeves',
    categoryBn: 'ফিঙ্গার স্লিকস',
    brand: 'LIGHTENING',
    brandBn: 'লাইটেনিং',
    price: 180,
    originalPrice: 200,
    discountBadge: '-10%',
    rating: 5.0,
    reviewCount: 1,
    image: '/products/finger-sleeves-luminous.svg',
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    description: 'Eye-catching luminous glowing gaming sleeves designed for fast swipes and pinpoint accuracy.',
    descriptionBn: 'আকর্ষণীয় লুমিনাস গ্লোয়িং গেমিং স্লিভস দ্রুত সোয়াইপ এবং নিখুঁত নিশানা করার জন্য ডিজাইন করা।',
    specs: ['Luminous Glow Emblem', '24-Needle High Density', 'Sweat Resistant', 'Universal Fit'],
  },
  {
    id: 'sleeves-memo-fs01',
    name: 'MEMO FS01 FINGER SLEEVES',
    nameBn: 'মেমো এফএস০১ গেমিং ফিঙ্গার স্লিভস',
    category: 'finger-sleeves',
    categoryBn: 'ফিঙ্গার স্লিকস',
    brand: 'MEMO',
    brandBn: 'মেমো',
    price: 150,
    originalPrice: 199,
    discountBadge: '-25%',
    rating: 5.0,
    reviewCount: 1,
    image: '/products/finger-sleeves-memo-fs01.svg',
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    description: 'Official MEMO brand high-sensitivity gaming sleeves for PUBG Mobile and Free Fire enthusiasts.',
    descriptionBn: 'অফিসিয়াল মেমো ব্র্যান্ড হাই-সেনসিটিভিটি গেমিং স্লিভস পাবজি ও ফ্রি ফায়ার গেমারদের জন্য।',
    specs: ['Official MEMO Original', 'Carbon Micro-Knit', 'Anti-Slip Elastic Cuff', 'Moisture Absorbing'],
  },
];

export const COMBO_PRODUCTS: Product[] = [];

export const getBrandName = (product?: Partial<Product> | null, language: string = 'en'): string => {
  if (!product) return 'Mex Tanim';
  if (language === 'bn' && product.brandBn) return product.brandBn;
  if (product.brand) return product.brand;
  if (product.name) {
    const firstWord = product.name.trim().split(' ')[0];
    if (firstWord && firstWord.length > 1) return firstWord;
  }
  return 'Mex Tanim';
};
