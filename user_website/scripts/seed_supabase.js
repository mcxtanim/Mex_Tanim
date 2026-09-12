const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mbchiojrtufgmchyuxpp.supabase.co';
const supabaseKey = 'sb_publishable_DROKUGcWl8Zz3oR7FL7bZg_78s0FjM5';

const supabase = createClient(supabaseUrl, supabaseKey);

const initialCategories = [
  { id: 'cat-mice', name: 'GAMING MICE', slug: 'gaming-mice', description: 'High precision esports RGB gaming mice.', image_url: '/categories/gaming-mice.svg', product_count: 18 },
  { id: 'cat-keyboards', name: 'MECHANICAL KEYBOARDS', slug: 'mechanical-keyboards', description: 'Mechanical gaming keyboards.', image_url: '/categories/mechanical-keyboards.svg', product_count: 15 },
  { id: 'cat-headphones', name: 'GAMING HEADSETS', slug: 'gaming-headsets', description: 'Surround sound over-ear gaming headsets.', image_url: '/categories/gaming-headsets.svg', product_count: 24 },
  { id: 'cat-chargers', name: 'FAST CHARGERS', slug: 'fast-chargers', description: 'GaN fast wall charger adapters.', image_url: '/categories/fast-chargers.svg', product_count: 32 },
  { id: 'cat-sleeves', 'name': 'FINGER SLEEVES', slug: 'finger-sleeves', description: 'Sweatproof gaming finger sleeves.', image_url: '/categories/finger-sleeves.svg', product_count: 12 },
  { id: 'cat-cables', name: 'CABLES', slug: 'cables', description: 'Heavy-duty braided charging cables.', image_url: '/categories/cables.svg', product_count: 40 },
  { id: 'cat-soundboxes', name: 'SOUNDBOXES', slug: 'soundboxes', description: 'Portable Bluetooth soundbox speakers.', image_url: '/categories/soundboxes.svg', product_count: 16 },
  { id: 'cat-trimmers', name: 'TRIMMERS', slug: 'trimmers', description: 'Modern electric hair and beard trimmers.', image_url: '/categories/trimmers.svg', product_count: 10 },
];

const initialProducts = [
  {
    id: 'prod-cooler-1',
    title: 'MEMO CX08 PRO PHONE COOLER',
    title_bn: 'মেমো CX08 প্রো ফোন কুলার',
    brand: 'MEMO',
    category: 'gaming-cooler',
    price: 1400,
    original_price: 1600,
    discount: 12,
    stock: 25,
    description: 'Semiconductor magnetic RGB cooling fan for PUBG & Mobile Gaming.',
    description_bn: 'পাবজি ও মোবাইল গেমিংয়ের জন্য আরজিবি কুলিং ফ্যান।',
    specs: 'Semiconductor Cooling, Magnetic Attachment, RGB Light Effects',
    image_url: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-headset-1',
    title: 'JBL Quantum 100 Gaming Headset',
    title_bn: 'জেবিএল কোয়ান্টাম ১০০ গেমিং হেডসেট',
    brand: 'JBL',
    category: 'gaming-headsets',
    price: 3950,
    original_price: 4800,
    discount: 18,
    stock: 15,
    description: 'Wired over-ear gaming headset with detachable mic.',
    description_bn: 'ডিটেচেবল মাইক্রোফোন সহ প্রিমিয়াম গেমিং হেডসেট।',
    specs: '40mm Drivers, Memory Foam, Detachable Mic',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
  },
];

async function seed() {
  console.log('Seeding Supabase Database...');

  const { data: catRes, error: catErr } = await supabase.from('categories').upsert(initialCategories);
  if (catErr) console.warn('Categories seed response:', catErr.message);
  else console.log('✓ Categories seeded successfully!');

  const { data: prodRes, error: prodErr } = await supabase.from('products').upsert(initialProducts);
  if (prodErr) console.warn('Products seed response:', prodErr.message);
  else console.log('✓ Products seeded successfully!');
}

seed();
