const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mbchiojrtufgmchyuxpp.supabase.co';
const supabaseKey = 'sb_publishable_DROKUGcWl8Zz3oR7FL7bZg_78s0FjM5';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testOrder() {
  const orderId = `ORD-${Date.now()}`;
  const orderNum = `#MEX-${Math.floor(100000 + Math.random() * 900000)}`;

  console.log('Testing Supabase order insertion...');

  const { data, error } = await supabase.from('orders').insert({
    id: orderId,
    order_number: orderNum,
    customer_name: 'আতিক তানভির (Test)',
    customer_email: 'test@mextanim.com',
    phone: '01317170609',
    address: 'বাসা #১২, রোড #০৫, মিরপুর-১০, ঢাকা',
    shipping_address: {
      street: 'মিরপুর-১০',
      city: 'Dhaka',
      district: 'Dhaka',
      postalCode: '1200',
    },
    delivery_area: 'Inside Dhaka',
    delivery_charge: 70,
    items: [
      {
        id: 'prod-cooler-1',
        title: 'MEMO CX08 PRO PHONE COOLER',
        price: 1400,
        quantity: 1,
      },
    ],
    total_amount: 1470,
    payment_method: 'Cash on Delivery',
    payment_status: 'Unpaid',
    status: 'Pending',
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('❌ Order insert failed:', error.message);
  } else {
    console.log('✓ Order inserted into Supabase successfully!');
  }
}

testOrder();
