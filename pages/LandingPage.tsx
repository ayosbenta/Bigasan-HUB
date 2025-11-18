
import React, { useState, useMemo } from 'react';
import { SellerProfile, RiceVariant, SellerPricing, Inventory } from '../types';
import { SELLER_PROFILES, SELLER_PRICING, INVENTORY, USERS } from '../constants';
import { EyeIcon, ShoppingCartIcon } from '../components/Icons';

const ProductCard: React.FC<{
    variant: RiceVariant;
    pricing: SellerPricing;
    seller: SellerProfile;
    inventory: Inventory;
    onViewDetails: () => void;
}> = ({ variant, pricing, seller, inventory, onViewDetails }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group">
        <div className="relative">
            <img className="w-full h-48 object-cover" src={variant.imageUrl} alt={variant.name} />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                <button
                    onClick={onViewDetails}
                    className="flex items-center space-x-2 bg-brand-primary text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                >
                    <EyeIcon className="w-5 h-5" />
                    <span>View Details</span>
                </button>
            </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
            <h3 className="text-lg font-bold text-brand-text truncate">{variant.name}</h3>
            <p className="text-sm text-gray-600 mb-2">Sold by: {seller.shopName}</p>
            <p className="text-xs text-gray-500 flex-grow mb-4">{variant.description.substring(0, 70)}...</p>
            <div className="mt-auto">
                <p className="text-xl font-semibold text-brand-primary">₱{pricing.pricePerKg.toFixed(2)} <span className="text-sm font-normal text-gray-500">/ kg</span></p>
                <p className="text-sm text-green-600">{inventory.stockKg > 0 ? `${inventory.stockKg} kg available` : 'Out of stock'}</p>
            </div>
        </div>
    </div>
);


const GuestProductModal: React.FC<{
    variant: RiceVariant;
    pricing: SellerPricing;
    seller: SellerProfile;
    inventory: Inventory;
    onClose: () => void;
    onNavigate: (page: string) => void;
}> = ({ variant, pricing, seller, inventory, onClose, onNavigate }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [unit, setUnit] = useState<'kg' | '25kg' | '50kg'>('kg');

    const handleLoginToOrder = () => {
        onNavigate('login');
    };

    const getPrice = () => {
        switch(unit) {
            case 'kg': return pricing.pricePerKg * quantity;
            case '25kg': return pricing.pricePer25kg * quantity;
            case '50kg': return pricing.pricePer50kg * quantity;
            default: return 0;
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative transform transition-all duration-300 scale-95 animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
                <div className="grid md:grid-cols-2 gap-6">
                    <img src={variant.imageUrl} alt={variant.name} className="w-full h-full object-cover rounded-l-lg" />
                    <div className="p-6 flex flex-col">
                        <h2 className="text-2xl font-bold text-brand-text mb-2">{variant.name}</h2>
                        <p className="text-sm text-gray-600 mb-4">Sold by: <strong>{seller.shopName}</strong></p>
                        <p className="text-gray-700 mb-4 flex-grow">{variant.description}</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Unit</label>
                                <select value={unit} onChange={e => setUnit(e.target.value as any)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm rounded-md">
                                    <option value="kg">Per Kilogram (₱{pricing.pricePerKg.toFixed(2)})</option>
                                    <option value="25kg">Sack (25kg) (₱{pricing.pricePer25kg.toFixed(2)})</option>
                                    <option value="50kg">Sack (50kg) (₱{pricing.pricePer50kg.toFixed(2)})</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm rounded-md" />
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-2xl font-bold text-brand-primary">Total: ₱{getPrice().toFixed(2)}</p>
                            <button onClick={handleLoginToOrder} className="mt-4 w-full bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-primary/90 transition-colors flex items-center justify-center space-x-2">
                                <ShoppingCartIcon className="w-5 h-5" />
                                <span>Login to Order</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface LandingPageProps {
  onNavigate: (page: string) => void;
  riceVariants: RiceVariant[];
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, riceVariants }) => {
  const [selectedProduct, setSelectedProduct] = useState<{ variant: RiceVariant; pricing: SellerPricing; seller: SellerProfile; inventory: Inventory; } | null>(null);

  const availableProducts = useMemo(() => {
    return SELLER_PRICING.map(pricing => {
      const variant = riceVariants.find(v => v.id === pricing.variantId);
      const sellerProfile = SELLER_PROFILES.find(s => s.id === pricing.sellerId);
      const sellerUser = USERS.find(u => u.id === sellerProfile?.userId);
      const inventory = INVENTORY.find(i => i.sellerId === pricing.sellerId && i.variantId === pricing.variantId);
      
      if (variant && sellerProfile && sellerUser && inventory && sellerUser.status === 'active') {
        return { variant, pricing, seller: sellerProfile, inventory };
      }
      return null;
    }).filter(p => p !== null) as { variant: RiceVariant; pricing: SellerPricing; seller: SellerProfile; inventory: Inventory; }[];
  }, [riceVariants]);

  return (
    <div>
        <div className="text-center mb-12 bg-white p-12 rounded-lg shadow-lg border border-brand-secondary">
            <h1 className="text-4xl font-extrabold text-brand-primary tracking-tight sm:text-5xl md:text-6xl">Welcome to Bigasan Hub</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-text">
                Your one-stop shop for high-quality rice from trusted local sellers. Fresh grains, delivered right to your doorstep.
            </p>
            <div className="mt-8">
                 <button onClick={() => onNavigate('login')} className="bg-brand-primary text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-brand-primary/90 transition-transform hover:scale-105">
                    Shop Now
                </button>
            </div>
        </div>
      
      <h2 className="text-3xl font-bold text-center text-brand-text mb-8">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {availableProducts.map(product => (
          <ProductCard
            key={`${product.seller.id}-${product.variant.id}`}
            {...product}
            onViewDetails={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {selectedProduct && (
        <GuestProductModal 
            {...selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default LandingPage;
