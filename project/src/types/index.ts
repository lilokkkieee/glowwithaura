export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  category: string;
  fragrance: string;
  burnTime: string;
  weight: string;
  ingredients: string[];
  sku: string;
  images: string[];
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isGiftPick?: boolean;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: number;
  shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}
