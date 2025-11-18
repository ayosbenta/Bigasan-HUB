
export enum UserRole {
  Admin = 'admin',
  Seller = 'seller',
  Buyer = 'buyer',
}

export enum OrderStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Packed = 'Packed',
  OutOfDelivery = 'Out for Delivery',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending' | 'inactive';
}

export interface SellerProfile {
  id: number;
  userId: number;
  shopName: string;
  address: string;
  contact: string;
  deliveryFee: number;
}

export interface RiceVariant {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export interface SellerPricing {
  id: number;
  sellerId: number;
  variantId: number;
  pricePerKg: number;
  pricePer25kg: number;
  pricePer50kg: number;
}

export interface Inventory {
  id: number;
  sellerId: number;
  variantId: number;
  stockKg: number;
}

export interface CartItem {
  variantId: number;
  sellerId: number;
  quantity: number; // in kg
  unit: 'kg' | '25kg' | '50kg';
  price: number;
}

export interface OrderItem {
  variantId: number;
  quantityKg: number;
  price: number;
}

export interface Order {
  id: number;
  buyerId: number;
  sellerId: number;
  items: OrderItem[];
  totalAmount: number;
  deliveryMethod: 'pickup' | 'delivery';
  status: OrderStatus;
  createdAt: string;
  deliveryAddress: string;
}
