
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, CartItem, RiceVariant } from './types';
import { USERS, RICE_VARIANTS as initialRiceVariants } from './constants';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import BuyerHomePage from './pages/BuyerHomePage';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BuyerCartPage from './pages/BuyerCartPage';
import BuyerDashboard from './pages/BuyerDashboard';
import LandingPage from './pages/LandingPage';

// Main App Component
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [riceVariants, setRiceVariants] = useState<RiceVariant[]>(initialRiceVariants);

  // Simple hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string) => {
    window.location.hash = page;
  };
  
  const handleLogin = (email: string) => {
    const user = USERS.find(u => u.email === email);
    if (user && user.status === 'active') {
      setCurrentUser(user);
      handleNavigate('home');
    } else {
      alert('Login failed. User not found, inactive, or pending approval.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    handleNavigate('home');
  };

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(
            i => i.variantId === item.variantId && i.sellerId === item.sellerId && i.unit === item.unit
        );

        if (existingItemIndex > -1) {
            const updatedCart = [...prevCart];
            updatedCart[existingItemIndex].quantity += item.quantity;
            return updatedCart;
        } else {
            return [...prevCart, item];
        }
    });
    alert(`${item.quantity} ${item.unit}(s) added to cart!`);
  };
  
  const handleAddVariant = (newVariant: Omit<RiceVariant, 'id'>) => {
    setRiceVariants(prevVariants => {
        const newId = prevVariants.length > 0 ? Math.max(...prevVariants.map(v => v.id)) + 1 : 1;
        return [
            ...prevVariants,
            {
                id: newId,
                ...newVariant,
            },
        ];
    });
    alert('New rice variant added successfully!');
  };

  const renderPage = () => {
    if (!currentUser) {
      if (currentPage === 'login') {
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      }
      return <LandingPage onNavigate={handleNavigate} riceVariants={riceVariants} />;
    }
    
    // Protected routing based on role
    if (currentPage === 'dashboard') {
        if (currentUser.role === UserRole.Admin) return <AdminDashboard currentUser={currentUser} riceVariants={riceVariants} onAddVariant={handleAddVariant} />;
        if (currentUser.role === UserRole.Seller) return <SellerDashboard currentUser={currentUser} riceVariants={riceVariants} />;
        if (currentUser.role === UserRole.Buyer) return <BuyerDashboard currentUser={currentUser} riceVariants={riceVariants} />;
    }

    if (currentPage === 'cart' && currentUser.role === UserRole.Buyer) {
        return <BuyerCartPage cart={cart} setCart={setCart} onNavigate={handleNavigate} currentUser={currentUser} riceVariants={riceVariants} />;
    }
    
    // Default page for all roles is their "home"
    switch (currentUser.role) {
      case UserRole.Admin:
        return <AdminDashboard currentUser={currentUser} riceVariants={riceVariants} onAddVariant={handleAddVariant} />;
      case UserRole.Seller:
        return <SellerDashboard currentUser={currentUser} riceVariants={riceVariants} />;
      case UserRole.Buyer:
      default:
        return <BuyerHomePage currentUser={currentUser} addToCart={addToCart} riceVariants={riceVariants} />;
    }
  };

  const getHomePage = () => {
    if(!currentUser) return 'login';
    if(currentUser.role === UserRole.Buyer) return 'home';
    return 'dashboard';
  }

  return (
    <div className="min-h-screen bg-brand-light text-brand-text font-sans">
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        onNavigate={handleNavigate}
        cartItemCount={cart.length}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
      <footer className="bg-brand-secondary/50 text-center py-4 mt-8">
        <p>&copy; 2024 Bigasan Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
