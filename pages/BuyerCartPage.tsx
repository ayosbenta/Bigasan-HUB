
import React, { useState } from 'react';
import { CartItem, User, RiceVariant } from '../types';
import { SELLER_PROFILES } from '../constants';

interface BuyerCartPageProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onNavigate: (page: string) => void;
  currentUser: User;
  riceVariants: RiceVariant[];
}

const BuyerCartPage: React.FC<BuyerCartPageProps> = ({ cart, setCart, onNavigate, currentUser, riceVariants }) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('123 Buyer St, Metro Manila');

  const handleRemoveItem = (variantId: number, sellerId: number, unit: string) => {
    setCart(cart.filter(item => !(item.variantId === variantId && item.sellerId === sellerId && item.unit === unit)));
  };

  const getProductDetails = (item: CartItem) => {
    const variant = riceVariants.find(v => v.id === item.variantId);
    const seller = SELLER_PROFILES.find(s => s.id === item.sellerId);
    return { variant, seller };
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 50 : 0; // Simplified delivery fee
  const total = subtotal + deliveryFee;
  
  const handleCheckout = () => {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    // In a real app, this would create an order record.
    // For this demo, we'll just show an alert and clear the cart.
    alert(`Order placed successfully for a total of ₱${total.toFixed(2)}!`);
    console.log({
        buyerId: currentUser.id,
        items: cart,
        totalAmount: total,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? address : undefined,
    });
    setCart([]);
    onNavigate('home');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-brand-text">Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600">Your cart is empty.</p>
          <button onClick={() => onNavigate('home')} className="mt-4 bg-brand-primary text-white px-6 py-2 rounded-md hover:bg-brand-primary/90">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Items</h2>
            <div className="space-y-4">
              {cart.map(item => {
                const { variant, seller } = getProductDetails(item);
                if (!variant || !seller) return null;
                return (
                  <div key={`${item.sellerId}-${item.variantId}-${item.unit}`} className="flex items-center justify-between p-2 border-b">
                    <div className="flex items-center space-x-4">
                      <img src={variant.imageUrl} alt={variant.name} className="w-16 h-16 object-cover rounded-md" />
                      <div>
                        <p className="font-semibold text-brand-text">{variant.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {item.unit} ({item.unit === 'kg' ? 'Kilogram' : `Sack of ${item.unit}`})
                        </p>
                         <p className="text-sm text-gray-500">Seller: {seller.shopName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">₱{(item.price * item.quantity).toFixed(2)}</p>
                        <button onClick={() => handleRemoveItem(item.variantId, item.sellerId, item.unit)} className="text-red-500 text-xs hover:underline">Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₱{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>₱{total.toFixed(2)}</span>
                </div>
            </div>
             <div className="mt-6">
                <h3 className="font-semibold mb-2">Delivery Method</h3>
                <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="delivery" value="delivery" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} className="text-brand-primary focus:ring-brand-accent"/>
                        <span>Delivery</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="delivery" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} className="text-brand-primary focus:ring-brand-accent"/>
                        <span>Pickup</span>
                    </label>
                </div>
             </div>
             {deliveryMethod === 'delivery' && (
                <div className="mt-4">
                    <label className="font-semibold mb-1 block">Delivery Address</label>
                    <textarea value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border rounded-md" rows={2}></textarea>
                </div>
             )}

            <button onClick={handleCheckout} className="mt-6 w-full bg-brand-primary text-white py-3 rounded-md font-semibold hover:bg-brand-primary/90 transition-colors">
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerCartPage;
