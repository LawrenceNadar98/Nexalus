// Store Context for managing cart and auth state
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const StoreContext = createContext();

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('store_token'));
  const [cart, setCart] = useState([]);
  const [guestCart, setGuestCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load guest cart from localStorage
  useEffect(() => {
    const savedGuestCart = localStorage.getItem('guest_cart');
    if (savedGuestCart) {
      setGuestCart(JSON.parse(savedGuestCart));
    }
  }, []);

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCart();
    }
  }, [token]);

  // Calculate cart count
  useEffect(() => {
    if (token) {
      const count = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } else {
      const count = guestCart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    }
  }, [cart, guestCart, token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('store_token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
    // Merge guest cart with user cart after login
    if (guestCart.length > 0) {
      mergeGuestCartToUser(authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    localStorage.removeItem('store_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const mergeGuestCartToUser = async (authToken) => {
    try {
      for (const item of guestCart) {
        await axios.post(`${API_URL}/api/store/cart/add`, {
          product_id: item.product_id,
          quantity: item.quantity
        }, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
      }
      // Clear guest cart after merge
      setGuestCart([]);
      localStorage.removeItem('guest_cart');
      await fetchCart();
    } catch (error) {
      console.error('Error merging cart:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/store/cart`);
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (token) {
        // Logged in user - use API
        await axios.post(`${API_URL}/api/store/cart/add`, {
          product_id: productId,
          quantity
        });
        await fetchCart();
        return true;
      } else {
        // Guest user - use localStorage
        const updatedCart = [...guestCart];
        const existingItem = updatedCart.find(item => item.product_id === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          updatedCart.push({ product_id: productId, quantity });
        }
        
        setGuestCart(updatedCart);
        localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
        return true;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (token) {
        await axios.put(`${API_URL}/api/store/cart/update/${productId}?quantity=${quantity}`);
        await fetchCart();
      } else {
        const updatedCart = guestCart.map(item => 
          item.product_id === productId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0);
        
        setGuestCart(updatedCart);
        localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (token) {
        await axios.put(`${API_URL}/api/store/cart/update/${productId}?quantity=0`);
        await fetchCart();
      } else {
        const updatedCart = guestCart.filter(item => item.product_id !== productId);
        setGuestCart(updatedCart);
        localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      if (token) {
        await axios.delete(`${API_URL}/api/store/cart/clear`);
        setCart([]);
      } else {
        setGuestCart([]);
        localStorage.removeItem('guest_cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartDetails = () => {
    if (token) {
      return cart;
    } else {
      return guestCart;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        token,
        cart,
        guestCart,
        cartCount,
        login,
        logout,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartDetails
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
