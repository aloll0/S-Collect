export interface ReturnItem {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  productTitle: string;
  productSku: string;
  productVariant: string;
  productQty: number;
  productPrice: string;
  productImage: string;
  reason: string;
  customerNote?: string;
  uploadedImages?: string[];
  requestedDate: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'AWAITING_ITEM' | 'COMPLETED';
  timeline?: Array<{
    title: string;
    date: string;
    subtext: string;
    completed: boolean;
    active: boolean;
  }>;
}

const BASE_ITEMS: ReturnItem[] = [
  {
    id: '#RET-20240617-001',
    orderId: '#ORD-20240617-0042',
    customerName: 'Sarah Al-Rashidi',
    customerEmail: 'sarah.r***@gmail.com',
    customerPhone: '+966 5XX XXX 123',
    shippingAddress: '123 King Fahd Road, Al Olaya District\nRiyadh, Riyadh 12211\nSaudi Arabia',
    productTitle: 'Premium Arabic Oud Perfume',
    productSku: 'PRO-OUD-001',
    productVariant: '100ml / Amber',
    productQty: 1,
    productPrice: 'SAR 450.00',
    productImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=150',
    reason: "Item doesn't fit",
    customerNote: '"I ordered the standard size but it seems to run smaller than expected. The product itself is beautiful but unfortunately I need to return it for a different size. I have not used the product and it is in its original packaging."',
    uploadedImages: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=300',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=300',
    ],
    requestedDate: 'Jun 17, 2024',
    status: 'PENDING_REVIEW',
    timeline: [
      { title: 'Return Requested', date: 'Jun 17 09:15 AM', subtext: 'Customer initiated return request', completed: true, active: false },
      { title: 'Under Review', date: 'Jun 17 10:30 AM', subtext: 'Currently being evaluated by vendor', completed: false, active: true },
      { title: 'Decision Made', date: '', subtext: '', completed: false, active: false },
      { title: 'Awaiting Item', date: '', subtext: '', completed: false, active: false },
      { title: 'Completed', date: '', subtext: '', completed: false, active: false },
    ],
  },
  {
    id: '#RET-20240617-002',
    orderId: '#ORD-20240617-0043',
    customerName: 'Khalid Mansour',
    customerEmail: 'khalid.m***@gmail.com',
    customerPhone: '+966 5XX XXX 456',
    shippingAddress: '456 Prince Sultan Road, Al Rawdah District\nJeddah 23431, Saudi Arabia',
    productTitle: 'Summer cotton dress',
    productSku: 'DRS-COT-002',
    productVariant: 'Medium / Blue',
    productQty: 1,
    productPrice: 'SAR 280.00',
    productImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=150',
    reason: 'Wrong item received',
    requestedDate: 'Jun 16, 2024',
    status: 'APPROVED',
  },
  {
    id: '#RET-20240617-003',
    orderId: '#ORD-20240617-0044',
    customerName: 'Layla Ibrahim',
    customerEmail: 'layla.i***@gmail.com',
    customerPhone: '+966 5XX XXX 789',
    shippingAddress: '789 King Abdulaziz Road, Al Malaz\nRiyadh 12831, Saudi Arabia',
    productTitle: 'Classic jeans',
    productSku: 'JNS-CLS-003',
    productVariant: '32 / Blue',
    productQty: 1,
    productPrice: 'SAR 320.00',
    productImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=150',
    reason: 'Damaged item',
    requestedDate: 'Jun 14, 2024',
    status: 'REJECTED',
  },
  {
    id: '#RET-20240617-004',
    orderId: '#ORD-20240617-0045',
    customerName: 'Fahad Al-Harbi',
    customerEmail: 'fahad.h***@gmail.com',
    customerPhone: '+966 5XX XXX 101',
    shippingAddress: '101 Madinah Road, Al Balad\nJeddah 22233, Saudi Arabia',
    productTitle: 'Nike sneakers',
    productSku: 'SNK-NKE-004',
    productVariant: '42 / White',
    productQty: 1,
    productPrice: 'SAR 550.00',
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150',
    reason: 'Quality unsatisfactory',
    requestedDate: 'Jun 13, 2024',
    status: 'AWAITING_ITEM',
  },
  {
    id: '#RET-20240617-005',
    orderId: '#ORD-20240617-0046',
    customerName: 'Sara Al-Ghamdi',
    customerEmail: 'sara.g***@gmail.com',
    customerPhone: '+966 5XX XXX 202',
    shippingAddress: '202 Al Khobar Corniche, Al Yarmouk\nKhobar 34423, Saudi Arabia',
    productTitle: 'White formal shirt',
    productSku: 'SHT-WHT-005',
    productVariant: 'Small / White',
    productQty: 1,
    productPrice: 'SAR 190.00',
    productImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=150',
    reason: "Item doesn't fit",
    requestedDate: 'Jun 12, 2024',
    status: 'COMPLETED',
  },
  {
    id: '#RET-20240617-006',
    orderId: '#ORD-20240617-0047',
    customerName: 'Hassan Ali',
    customerEmail: 'hassan.a***@gmail.com',
    customerPhone: '+966 5XX XXX 303',
    shippingAddress: '303 Dammam Port Road\nDammam 31411, Saudi Arabia',
    productTitle: 'Leather handbag',
    productSku: 'BAG-LTH-006',
    productVariant: 'Brown',
    productQty: 1,
    productPrice: 'SAR 620.00',
    productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150',
    reason: 'Changed mind',
    requestedDate: 'Jun 11, 2024',
    status: 'COMPLETED',
  },
  {
    id: '#RET-20240617-007',
    orderId: '#ORD-20240617-0048',
    customerName: 'Reem Abdullah',
    customerEmail: 'reem.a***@gmail.com',
    customerPhone: '+966 5XX XXX 404',
    shippingAddress: '404 Corniche Road, Al Shati\nJeddah 23511, Saudi Arabia',
    productTitle: 'Sunglasses',
    productSku: 'SNG-BLK-007',
    productVariant: 'Black Lens',
    productQty: 1,
    productPrice: 'SAR 310.00',
    productImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=150',
    reason: 'Wrong item received',
    requestedDate: 'Jun 10, 2024',
    status: 'PENDING_REVIEW',
  },
];

const NAMES = [
  'Nourah Al-Otaibi', 'Ahmed Zaki', 'Maha Al-Dosari', 'Omar Saeed', 'Fatima Nasser',
  'Youssef Kamal', 'Dana Al-Salim', 'Tariq Hassan', 'Mona Al-Shehri', 'Ziad Al-Ghamdi',
  'Huda Al-Ahmadi', 'Bandar Al-Otaibi', 'Rania Qasim', 'Walid Al-Rashid', 'Asma Al-Zahrani',
  'Sami Al-Farsi', 'Lulwa Al-Subaie', 'Nasser Al-Mutairi', 'Amal Al-Husseini', 'Faisal Al-Harbi',
  'Noura Al-Shammari', 'Hamad Al-Kaabi', 'Salma Al-Marri', 'Badr Al-Sudairi', 'Lina Al-Juhani',
  'Rayyan Al-Ghamdi', 'May Al-Dossary'
];

const PRODUCTS = [
  { title: 'Silk scarf', sku: 'SCF-SLK-008', variant: 'Gold / Patterned', price: 'SAR 210.00', img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=150', reason: 'Color different from photos', status: 'PENDING_REVIEW' },
  { title: 'Sports watch', sku: 'WTC-SPT-009', variant: 'Black Silicone', price: 'SAR 790.00', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150', reason: "Item doesn't fit", status: 'APPROVED' },
  { title: 'Designer sunglasses', sku: 'SNG-DSG-010', variant: 'Tortoise Shell', price: 'SAR 490.00', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=150', reason: 'Damaged item', status: 'REJECTED' },
  { title: 'Running shoes', sku: 'SHS-RUN-011', variant: 'Size 41 / Grey', price: 'SAR 380.00', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150', reason: 'Wrong size', status: 'COMPLETED' },
  { title: 'Cashmere sweater', sku: 'SWT-CSH-012', variant: 'Medium / Beige', price: 'SAR 650.00', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=150', reason: 'Quality unsatisfactory', status: 'REJECTED' },
  { title: 'Laptop bag', sku: 'BAG-LPT-013', variant: '15 inch / Navy', price: 'SAR 290.00', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150', reason: 'Changed mind', status: 'PENDING_REVIEW' },
  { title: 'Gold bracelet', sku: 'JWL-GLD-014', variant: '18K / Rose Gold', price: 'SAR 1200.00', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150', reason: "Item doesn't match description", status: 'APPROVED' },
  { title: 'Polo shirt', sku: 'SHT-PLO-015', variant: 'Large / Green', price: 'SAR 180.00', img: 'https://images.unsplash.com/photo-1625910513413-562771b6932e?w=150', reason: 'Wrong item received', status: 'COMPLETED' }
];

// Generate 34 total items matching screenshot count
export const MOCK_RETURNS: ReturnItem[] = [
  ...BASE_ITEMS,
  ...NAMES.map((name, idx) => {
    const num = idx + 8;
    const numStr = num < 10 ? `00${num}` : `0${num}`;
    const p = PRODUCTS[idx % PRODUCTS.length];
    const day = Math.max(1, 15 - Math.floor(idx / 2));
    const statusList: ReturnItem['status'][] = ['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'AWAITING_ITEM', 'COMPLETED'];

    return {
      id: `#RET-20240617-${numStr}`,
      orderId: `#ORD-20240617-${100 + num}`,
      customerName: name,
      customerEmail: `${name.toLowerCase().replace(/[^a-z]/g, '.')}***@gmail.com`,
      customerPhone: `+966 5XX XXX ${100 + num}`,
      shippingAddress: `${num} King Fahd Road, Al Olaya District\nRiyadh, Saudi Arabia`,
      productTitle: p.title,
      productSku: p.sku,
      productVariant: p.variant,
      productQty: 1,
      productPrice: p.price,
      productImage: p.img,
      reason: p.reason,
      requestedDate: `Jun ${day}, 2024`,
      status: (p.status as ReturnItem['status']) || statusList[idx % statusList.length],
    };
  })
];
