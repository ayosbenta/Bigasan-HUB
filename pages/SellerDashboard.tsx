
import React, { useState, useMemo } from 'react';
import { User, Order, OrderStatus, Inventory, SellerPricing, RiceVariant } from '../types';
import { ORDERS, USERS, INVENTORY, STATUS_COLORS, SELLER_PRICING } from '../constants';
import { ChartBarIcon, ClipboardListIcon, BoxIcon, TruckIcon, CheckCircleIcon, XCircleIcon } from '../components/Icons';

const DashboardCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div className="p-3 bg-brand-secondary rounded-full">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-brand-text">{value}</p>
        </div>
    </div>
);


const SellerOrderManagement: React.FC<{ orders: Order[] }> = ({ orders }) => {
    const [currentOrders, setCurrentOrders] = useState(orders);

    const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
        setCurrentOrders(currentOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };
    
    const getBuyerName = (buyerId: number) => USERS.find(u => u.id === buyerId)?.name || 'Unknown Buyer';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4 text-brand-text">Manage Orders</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Order ID</th>
                            <th scope="col" className="px-6 py-3">Buyer</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map(order => (
                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                                <td className="px-6 py-4">{getBuyerName(order.buyerId)}</td>
                                <td className="px-6 py-4">₱{order.totalAmount.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center space-x-2">
                                        {order.status === OrderStatus.Pending && (
                                            <>
                                                <button onClick={() => handleStatusChange(order.id, OrderStatus.Accepted)} className="text-green-600 hover:text-white hover:bg-green-600 border border-green-600 rounded-md px-2 py-1 text-xs font-semibold transition-colors flex items-center space-x-1">
                                                    <CheckCircleIcon className="w-4 h-4" /> <span>Accept</span>
                                                </button>
                                                <button onClick={() => handleStatusChange(order.id, OrderStatus.Rejected)} className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-md px-2 py-1 text-xs font-semibold transition-colors flex items-center space-x-1">
                                                    <XCircleIcon className="w-4 h-4" /> <span>Reject</span>
                                                </button>
                                            </>
                                        )}
                                        {order.status === OrderStatus.Accepted && (
                                             <button onClick={() => handleStatusChange(order.id, OrderStatus.Packed)} className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded-md px-2 py-1 text-xs font-semibold transition-colors flex items-center space-x-1">
                                                <BoxIcon className="w-4 h-4" /> <span>Pack Order</span>
                                             </button>
                                        )}
                                         {order.status === OrderStatus.Packed && (
                                             <button onClick={() => handleStatusChange(order.id, OrderStatus.OutOfDelivery)} className="text-purple-600 hover:text-white hover:bg-purple-600 border border-purple-600 rounded-md px-2 py-1 text-xs font-semibold transition-colors flex items-center space-x-1">
                                                <TruckIcon className="w-4 h-4" /> <span>Ship</span>
                                             </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

interface SellerInventoryManagementProps {
    sellerId: number;
    riceVariants: RiceVariant[];
}

const SellerInventoryManagement: React.FC<SellerInventoryManagementProps> = ({ sellerId, riceVariants }) => {
    const [inventory, setInventory] = useState(() => INVENTORY.filter(i => i.sellerId === sellerId));
    
    const getVariantDetails = (variantId: number) => riceVariants.find(v => v.id === variantId);
    
    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-brand-text">Inventory Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory.map(item => {
                    const variant = getVariantDetails(item.variantId);
                    if (!variant) return null;

                    const isLowStock = item.stockKg < 50;
                    const stockPercentage = Math.min((item.stockKg / 500) * 100, 100); // Assume max stock is 500kg for visualization

                    return (
                        <div key={item.id} className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col border-l-4 ${isLowStock ? 'border-red-500' : 'border-green-500'}`}>
                           <div className="p-4 flex-grow">
                             <h4 className="font-bold text-brand-text truncate">{variant.name}</h4>
                             <p className="text-sm text-gray-500 mb-4">{variant.description.substring(0, 50)}...</p>

                             <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                <div className={`h-2.5 rounded-full ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${stockPercentage}%` }}></div>
                             </div>
                             
                             <div className="flex justify-between items-center">
                                <p className="text-lg font-bold text-brand-text">{item.stockKg}<span className="text-sm font-normal text-gray-500"> kg</span></p>
                                {isLowStock && <p className="text-xs font-bold text-red-500 px-2 py-1 bg-red-100 rounded-full">LOW STOCK</p>}
                             </div>
                           </div>
                           <div className="bg-gray-50 p-4 mt-auto">
                             <button className="w-full text-center bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-primary/90 transition-colors">
                                Update Stock
                             </button>
                           </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


interface SellerDashboardProps {
    currentUser: User;
    riceVariants: RiceVariant[];
}
// Main Seller Dashboard Component
const SellerDashboard: React.FC<SellerDashboardProps> = ({ currentUser, riceVariants }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const sellerProfile = useMemo(() => USERS.find(u => u.id === currentUser.id), [currentUser.id]);
    const sellerId = useMemo(() => sellerProfile?.id ? sellerProfile.id -1: 0, [sellerProfile])

    const sellerOrders = useMemo(() => ORDERS.filter(o => o.sellerId === sellerId), [sellerId]);

    const totalSales = useMemo(() => 
        sellerOrders.filter(o => o.status === OrderStatus.Completed).reduce((sum, order) => sum + order.totalAmount, 0), 
    [sellerOrders]);

    const pendingOrders = useMemo(() => sellerOrders.filter(o => o.status === OrderStatus.Pending).length, [sellerOrders]);

    const lowStockItems = useMemo(() => INVENTORY.filter(i => i.sellerId === sellerId && i.stockKg < 50).length, [sellerId]);

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return <SellerOrderManagement orders={sellerOrders} />;
            case 'inventory':
                return <SellerInventoryManagement sellerId={sellerId} riceVariants={riceVariants} />;
            case 'dashboard':
            default:
                return (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DashboardCard title="Total Sales" value={`₱${totalSales.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={<ChartBarIcon className="w-8 h-8 text-brand-primary" />} />
                        <DashboardCard title="Pending Orders" value={pendingOrders.toString()} icon={<ClipboardListIcon className="w-8 h-8 text-brand-primary" />} />
                        <DashboardCard title="Low Stock Items" value={lowStockItems.toString()} icon={<BoxIcon className="w-8 h-8 text-red-500"/>} />
                    </div>
                    <SellerOrderManagement orders={sellerOrders.filter(o => o.status === OrderStatus.Pending || o.status === OrderStatus.Accepted)} />
                    </>
                );
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-brand-text">Seller Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {currentUser.name}!</p>
            </div>

            <div className="mb-6">
                 <nav className="flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'bg-brand-primary text-white' : 'text-gray-500 hover:text-gray-700 bg-white'} px-4 py-2 font-medium text-sm rounded-md shadow-sm transition-colors`}>
                        Dashboard
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`${activeTab === 'orders' ? 'bg-brand-primary text-white' : 'text-gray-500 hover:text-gray-700 bg-white'} px-4 py-2 font-medium text-sm rounded-md shadow-sm transition-colors`}>
                        All Orders
                    </button>
                    <button onClick={() => setActiveTab('inventory')} className={`${activeTab === 'inventory' ? 'bg-brand-primary text-white' : 'text-gray-500 hover:text-gray-700 bg-white'} px-4 py-2 font-medium text-sm rounded-md shadow-sm transition-colors`}>
                        Inventory
                    </button>
                </nav>
            </div>
            
            {renderContent()}
        </div>
    );
};

export default SellerDashboard;
