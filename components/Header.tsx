
import React from 'react';
import { User } from '../types';
import { ShoppingCartIcon, UserIcon, LogoutIcon, DashboardIcon, SackIcon } from './Icons';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onNavigate, cartItemCount }) => {
  return (
    <header className="bg-brand-primary/95 text-brand-light shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a onClick={() => onNavigate('home')} className="flex items-center space-x-2 cursor-pointer">
              <SackIcon className="h-8 w-8 text-brand-accent"/>
              <span className="text-2xl font-bold tracking-wider">BIGASAN HUB</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="hidden sm:inline">Welcome, {currentUser.name}!</span>
                
                {currentUser.role === 'buyer' && (
                  <button onClick={() => onNavigate('cart')} className="relative p-2 rounded-full hover:bg-brand-accent/30 transition-colors">
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{cartItemCount}</span>
                    )}
                  </button>
                )}
                
                <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-full hover:bg-brand-accent/30 transition-colors" title="Dashboard">
                  <DashboardIcon className="h-6 w-6" />
                </button>
                
                <button onClick={onLogout} className="p-2 rounded-full hover:bg-brand-accent/30 transition-colors" title="Logout">
                  <LogoutIcon className="h-6 w-6" />
                </button>
              </>
            ) : (
              <button onClick={() => onNavigate('login')} className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-brand-accent/30 transition-colors">
                <UserIcon className="h-5 w-5" />
                <span>Login / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
