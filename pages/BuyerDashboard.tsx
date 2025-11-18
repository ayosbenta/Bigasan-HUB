
import React from 'react';
import { User, RiceVariant } from '../types';
import { ORDERS, SELLER_PROFILES, STATUS_COLORS } from '../constants';
import { EyeIcon } from '../components/Icons';

interface BuyerDashboardProps {
  currentUser: User;
  riceVariants: RiceVariant[];
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ currentUser, riceVariants }) => {
  const buyerOrders = ORDERS.filter(order => order.buyerId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getSellerName = (sellerId: number) => {
    return SELLER_PROFILES.find(s => s.id === sellerId)?.shopName || 'Unknown Seller';
  };

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-brand-text">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {currentUser.name}! Here's a summary of your recent orders.</p>
        </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-brand-text border-b pb-3">Order History</h3>
        {buyerOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Order ID</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Seller</th>
                  <th scope="col" className="px-6 py-3">Items</th>
                  <th scope="col" className="px-6 py-3">Total</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {buyerOrders.map(order => (
                  <tr key={order.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getSellerName(order.sellerId)}</td>
                     <td className="px-6 py-4 text-xs">
                        <ul className="list-disc list-inside">
                        {order.items.map((item, index) => {
                           const variant = riceVariants.find(v => v.id === item.variantId);
                           return <li key={index}>{item.quantityKg}kg - {variant?.name || 'Unknown'}</li>
                        })}
                        </ul>
                    </td>
                    <td className="px-6 py-4 font-semibold">₱{order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <button className="text-brand-primary hover:text-brand-accent" title="View Details">
                            <EyeIcon className="w-5 h-5"/>
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
             <button
                onClick={() => window.location.hash = 'home'}
                className="mt-4 bg-brand-primary text-white px-6 py-2 rounded-md hover:bg-brand-primary/90 transition-colors"
            >
                Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
