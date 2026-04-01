import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Filter, X } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';

const StoreHeader = () => {
  const navigate = useNavigate();
  const { user, cartCount, logout } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-sm">
          <span>🚚 Free Shipping on Orders Above ₹5,000</span>
          <span>📞 +91 9825 39 20 21</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => navigate('/store')} className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">
              Nexalus <span className="text-gray-800">Store</span>
            </div>
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for CCTV, Laptops, Servers..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* User Account */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:inline text-sm">
                  {user ? user.full_name : 'Sign In'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  {user ? (
                    <>
                      <button
                        onClick={() => {
                          navigate('/store/orders');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          navigate('/store/profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/store');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate('/store/login');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          navigate('/store/register');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => navigate('/store/cart')}
              className="relative px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden md:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="mt-4 flex gap-4 overflow-x-auto pb-2">
          <button
            onClick={() => navigate('/')}
            className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
          {['All', 'CCTV', 'IT Networking', 'Laptop', 'Desktop', 'Server'].map((category) => (
            <button
              key={category}
              onClick={() => navigate(category === 'All' ? '/store/products' : `/store/products?category=${category}`)}
              className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default StoreHeader;
