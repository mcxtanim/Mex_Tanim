import { Order } from "./types";

export const initialOrders: Order[] = [
  {
    id: "ord-901",
    orderNumber: "MEX-2026-8801",
    customerName: "Rahim Chowdhury",
    customerEmail: "rahim.c@gmail.com",
    customerPhone: "+8801711223344",
    shippingAddress: {
      street: "House 45, Road 12, Block B, Banani",
      city: "Dhaka",
      district: "Dhaka",
      postalCode: "1213"
    },
    items: [
      {
        productId: "prod-101",
        title: "Mex Pro Wireless Headphones ANC",
        quantity: 1,
        unitPrice: 4050
      },
      {
        productId: "prod-104",
        title: "Ergonomic Optical Gaming Mouse 16000 DPI",
        quantity: 1,
        unitPrice: 2100
      }
    ],
    totalAmount: 6150,
    status: "Pending",
    paymentMethod: "bKash",
    paymentStatus: "Paid",
    createdAt: "2026-09-10 14:30"
  },
  {
    id: "ord-902",
    orderNumber: "MEX-2026-8802",
    customerName: "Sultana Yasmin",
    customerEmail: "sultana.y@yahoo.com",
    customerPhone: "+8801819998877",
    shippingAddress: {
      street: "Flat 4A, Green Peace Tower, Agrabad",
      city: "Chittagong",
      district: "Chittagong",
      postalCode: "4100"
    },
    items: [
      {
        productId: "prod-105",
        title: "Mex Soundbar 120W Bass Boost with Subwoofer",
        quantity: 1,
        unitPrice: 10120
      }
    ],
    totalAmount: 10120,
    status: "Processing",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    createdAt: "2026-09-09 18:15"
  },
  {
    id: "ord-903",
    orderNumber: "MEX-2026-8803",
    customerName: "Tanvir Hasan",
    customerEmail: "tanvir.dev@outlook.com",
    customerPhone: "+8801912345678",
    shippingAddress: {
      street: "Plot 12, Zindabazar Main Road",
      city: "Sylhet",
      district: "Sylhet",
      postalCode: "3100"
    },
    items: [
      {
        productId: "prod-103",
        title: "Mechanical RGB Gaming Keyboard Hot-Swappable",
        quantity: 1,
        unitPrice: 5510
      }
    ],
    totalAmount: 5510,
    status: "Delivered",
    paymentMethod: "Nagad",
    paymentStatus: "Paid",
    createdAt: "2026-09-08 11:20"
  },
  {
    id: "ord-904",
    orderNumber: "MEX-2026-8804",
    customerName: "Nusrat Jahan",
    customerEmail: "nusrat.jahan@gmail.com",
    customerPhone: "+8801555667788",
    shippingAddress: {
      street: "House 89, Sector 7, Uttara",
      city: "Dhaka",
      district: "Dhaka",
      postalCode: "1230"
    },
    items: [
      {
        productId: "prod-102",
        title: "Tanim Ultra Smartwatch Series 9",
        quantity: 2,
        unitPrice: 2720
      }
    ],
    totalAmount: 5440,
    status: "Pending",
    paymentMethod: "bKash",
    paymentStatus: "Paid",
    createdAt: "2026-09-10 16:45"
  },
  {
    id: "ord-905",
    orderNumber: "MEX-2026-8805",
    customerName: "Mahmudul Karim",
    customerEmail: "m.karim@gmail.com",
    customerPhone: "+8801677889900",
    shippingAddress: {
      street: "College Road, Near Stadium",
      city: "Rajshahi",
      district: "Rajshahi",
      postalCode: "6000"
    },
    items: [
      {
        productId: "prod-107",
        title: "Mex 4K Portable Monitor 15.6 inch IPS",
        quantity: 1,
        unitPrice: 16650
      }
    ],
    totalAmount: 16650,
    status: "Delivered",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    createdAt: "2026-09-07 09:10"
  }
];
