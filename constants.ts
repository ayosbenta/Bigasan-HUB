
import { User, UserRole, SellerProfile, RiceVariant, SellerPricing, Inventory, Order, OrderStatus } from './types';

export const USERS: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@bigasan.com', role: UserRole.Admin, status: 'active' },
  { id: 2, name: 'Juan Dela Cruz', email: 'juan@seller.com', role: UserRole.Seller, status: 'active' },
  { id: 3, name: 'Maria Santos', email: 'maria@buyer.com', role: UserRole.Buyer, status: 'active' },
  { id: 4, name: 'Pedro Penduko', email: 'pedro@seller.com', role: UserRole.Seller, status: 'pending' },
];

export const SELLER_PROFILES: SellerProfile[] = [
  { id: 1, userId: 2, shopName: "Juan's Rice Emporium", address: "123 Rice St, Manila", contact: "09171234567", deliveryFee: 50 },
  { id: 2, userId: 4, shopName: "Pedro's Premium Grains", address: "456 Grain Ave, Quezon City", contact: "09187654321", deliveryFee: 60 },
];

export const RICE_VARIANTS: RiceVariant[] = [
  {
    id: 1,
    name: 'HAPiNOY Ivory (Premium Rice)',
    description: 'A premium quality white rice, known for its soft texture and fragrant aroma. Perfect for everyday meals.',
    imageUrl: 'https://picsum.photos/seed/rice1/400/300',
  },
  {
    id: 2,
    name: 'HAPiNOY Long Grain Hasmin',
    description: 'Long grain rice that stays fluffy and separate after cooking. Ideal for fried rice and other special dishes.',
    imageUrl: 'https://picsum.photos/seed/rice2/400/300',
  },
  {
    id: 3,
    name: 'HAPiNOY Dinorado Long Grain',
    description: 'A traditional Filipino favorite, Dinorado rice is slightly sticky with a sweet taste and aroma.',
    imageUrl: 'https://picsum.photos/seed/rice3/400/300',
  },
  {
    id: 4,
    name: 'Oregon Rice',
    description: 'Imported quality rice from Oregon, known for its consistent quality and clean taste.',
    imageUrl: 'https://picsum.photos/seed/rice4/400/300',
  },
];

export const SELLER_PRICING: SellerPricing[] = [
  { id: 1, sellerId: 1, variantId: 1, pricePerKg: 55, pricePer25kg: 1350, pricePer50kg: 2650 },
  { id: 2, sellerId: 1, variantId: 2, pricePerKg: 52, pricePer25kg: 1280, pricePer50kg: 2500 },
  { id: 3, sellerId: 1, variantId: 3, pricePerKg: 60, pricePer25kg: 1480, pricePer50kg: 2900 },
];

export const INVENTORY: Inventory[] = [
  { id: 1, sellerId: 1, variantId: 1, stockKg: 500 },
  { id: 2, sellerId: 1, variantId: 2, stockKg: 350 },
  { id: 3, sellerId: 1, variantId: 3, stockKg: 25 },
];

export const ORDERS: Order[] = [
    {
      id: 1,
      buyerId: 3,
      sellerId: 1,
      items: [{ variantId: 1, quantityKg: 5, price: 55 }],
      totalAmount: 275,
      deliveryMethod: 'delivery',
      status: OrderStatus.Pending,
      createdAt: '2023-10-27T10:00:00Z',
      deliveryAddress: '456 Client Ave, Pasig City'
    },
    {
      id: 2,
      buyerId: 3,
      sellerId: 1,
      items: [{ variantId: 2, quantityKg: 25, price: 1280 }],
      totalAmount: 1280,
      deliveryMethod: 'pickup',
      status: OrderStatus.Completed,
      createdAt: '2023-10-25T14:30:00Z',
      deliveryAddress: '456 Client Ave, Pasig City'
    }
];

export const STATUS_COLORS: { [key in OrderStatus]: string } = {
  [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.Accepted]: 'bg-blue-100 text-blue-800',
  [OrderStatus.Packed]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.OutOfDelivery]: 'bg-purple-100 text-purple-800',
  [OrderStatus.Completed]: 'bg-green-100 text-green-800',
  [OrderStatus.Rejected]: 'bg-red-100 text-red-800',
  [OrderStatus.Cancelled]: 'bg-gray-100 text-gray-800',
};
