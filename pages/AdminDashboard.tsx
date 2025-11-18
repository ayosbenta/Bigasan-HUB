
import React, { useState, useMemo } from 'react';
import { User, UserRole, Order, OrderStatus, RiceVariant } from '../types';
import { USERS, ORDERS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UsersIcon, ChartBarIcon, CheckCircleIcon, XCircleIcon } from '../components/Icons';

// Sub-components defined within the same file for simplicity
const DashboardCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div className="p-3 bg-brand-secondary rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-brand-text">{value}</p>
        </div>
    </div>
);

const AdminUserManagement: React.FC<{}> = () => {
    const [users, setUsers] = useState(USERS);

    const handleApprove = (userId: number) => {
        setUsers(users.map(u => u.id === userId ? {...u, status: 'active'} : u));
    };

    const handleDeactivate = (userId: number) => {
        setUsers(users.map(u => u.id === userId ? {...u, status: 'inactive'} : u));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4 text-brand-text">User Management</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4 capitalize">{user.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold leading-tight ${
                                        user.status === 'active' ? 'bg-green-100 text-green-800' : 
                                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`
                                    }>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {user.status === 'pending' && user.role === 'seller' && (
                                        <button onClick={() => handleApprove(user.id)} className="flex items-center space-x-1 font-medium text-blue-600 hover:text-blue-800 transition-colors px-3 py-1 bg-blue-100 rounded-md">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            <span>Approve</span>
                                        </button>
                                    )}
                                    {user.status === 'active' && user.role !== 'admin' && (
                                         <button onClick={() => handleDeactivate(user.id)} className="flex items-center space-x-1 font-medium text-red-600 hover:text-red-800 transition-colors px-3 py-1 bg-red-100 rounded-md">
                                            <XCircleIcon className="w-4 h-4" />
                                            <span>Deactivate</span>
                                         </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminReports: React.FC = () => {
    const salesData = useMemo(() => {
        const data: {[key: string]: number} = {};
        ORDERS.forEach(order => {
            if (order.status === OrderStatus.Completed) {
                const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (!data[date]) data[date] = 0;
                data[date] += order.totalAmount;
            }
        });
        return Object.keys(data).map(date => ({ name: date, sales: data[date] })).slice(-10); // show last 10 days
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4 text-brand-text">Recent Sales Activity</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 12}} />
                        <YAxis tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `₱${value}`} />
                        <Tooltip
                            cursor={{ fill: 'rgba(22, 163, 74, 0.1)' }}
                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#14532d', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{fontSize: "14px"}}/>
                        <Bar dataKey="sales" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const AdminVariantManagement: React.FC<{
    variants: RiceVariant[];
    onAddVariant: (newVariant: Omit<RiceVariant, 'id'>) => void;
}> = ({ variants, onAddVariant }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !imageUrl) {
            alert('Please fill all fields.');
            return;
        }
        onAddVariant({ name, description, imageUrl });
        // Reset form
        setName('');
        setDescription('');
        setImageUrl('');
        setShowForm(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-brand-text">Rice Variant Management</h3>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-primary/90 transition-colors text-sm font-semibold"
                >
                    {showForm ? 'Cancel' : '+ Add New Variant'}
                </button>
            </div>

            {showForm && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50 animate-fade-in-up">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Variant Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm" rows={3}></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm" />
                        </div>
                        <div className="flex justify-end space-x-2">
                             <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-semibold">Cancel</button>
                             <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-semibold">Save Variant</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Image</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variants.map(variant => (
                            <tr key={variant.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <img src={variant.imageUrl} alt={variant.name} className="w-16 h-12 object-cover rounded-md" />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{variant.name}</td>
                                <td className="px-6 py-4 text-gray-600 max-w-sm truncate">{variant.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

interface AdminDashboardProps {
    currentUser: User;
    riceVariants: RiceVariant[];
    onAddVariant: (newVariant: Omit<RiceVariant, 'id'>) => void;
}

// Main Admin Dashboard Component
const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, riceVariants, onAddVariant }) => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const totalSellers = useMemo(() => USERS.filter(u => u.role === UserRole.Seller && u.status === 'active').length, []);
    const totalBuyers = useMemo(() => USERS.filter(u => u.role === UserRole.Buyer).length, []);
    const totalSales = useMemo(() => ORDERS.filter(o => o.status === OrderStatus.Completed).reduce((sum, order) => sum + order.totalAmount, 0), []);
    
    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <AdminUserManagement />;
            case 'variants':
                return <AdminVariantManagement variants={riceVariants} onAddVariant={onAddVariant} />;
            case 'reports':
                return <AdminReports />;
            case 'dashboard':
            default:
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DashboardCard title="Active Sellers" value={totalSellers.toString()} icon={<UsersIcon className="w-8 h-8 text-brand-primary"/>} />
                            <DashboardCard title="Registered Buyers" value={totalBuyers.toString()} icon={<UsersIcon className="w-8 h-8 text-brand-primary"/>} />
                            <DashboardCard title="Total Sales" value={`₱${totalSales.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={<ChartBarIcon className="w-8 h-8 text-brand-primary"/>} />
                        </div>
                        <AdminReports />
                    </>
                );
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-brand-text">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Oversee the entire Bigasan Hub ecosystem.</p>
            </div>

            <div className="mb-6">
                <nav className="flex space-x-2 sm:space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'bg-brand-primary text-white' : 'text-gray-500 hover:text-gray-700 bg-white'} px-3 py-2 sm:px-4 font-medium text-sm rounded-md shadow-sm transition-colors`}>
                        Dashboard
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'bg-brand-primary text-white' : 'text-gray-500 hover:text-gray-700 bg-white'} px-3 py-2 sm:px-4 font-medium text-sm rounded-md shadow-sm transition-colors`}>
                        User Management
                    </button>
                    <button onClick={() => setActiveTab('variants')} className={`${activeTab === 'variants' ? 'bg-brand-primary text-white' : 'text-gray-500 hover:text-gray-700 bg-white'} px-3 py-2 sm:px-4 font-medium text-sm rounded-md shadow-sm transition-colors`}>
                        Product Variants
                    </button>
                </nav>
            </div>
            
            {renderContent()}
        </div>
    );
};

export default AdminDashboard;
