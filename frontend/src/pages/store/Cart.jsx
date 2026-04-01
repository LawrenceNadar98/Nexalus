import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Cart = () => {
  const navigate = useNavigate();
  const { cart, guestCart, updateCartItem, removeFromCart, token, cartCount } = useStore();
  const [cartDetails, setCartDetails] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCartDetails();
    } else {
      fetchGuestCartDetails();
    }
  }, [token, cartCount]);

  const fetchCartDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/store/cart`);
      setCartDetails(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestCartDetails = async () => {
    try {
      const items = [];
      let total = 0;

      for (const cartItem of guestCart) {
        const response = await axios.get(`${API_URL}/api/store/products/${cartItem.product_id}`);
        const product = response.data;
        const item_total = product.price * cartItem.quantity;
        
        items.push({
          product: product,
          quantity: cartItem.quantity,
          item_total: item_total
        });
        total += item_total;
      }

      setCartDetails({ items, total });
    } catch (error) {
      console.error('Error fetching guest cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemove = async (productId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    }
  };

  const handleCheckout = () => {
    if (cartDetails.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (!token) {
      toast.info('Please login to continue checkout');
      navigate('/store/login?redirect=/store/checkout');
      return;
    }
    
    navigate('/store/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartDetails.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate('/store/products')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartDetails.items.map((item) => (
                <div key={item.product._id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.images?.[0] ? (
                        <img
                          src={`${API_URL}${item.product.images[0]}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">{item.product.brand} • {item.product.condition}</p>
                          <p className="text-lg font-bold text-gray-900 mt-2">₹{item.product.price.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="text-red-500 hover:text-red-700 h-fit"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock_quantity}
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">
                          (Max: {item.product.stock_quantity})
                        </span>
                      </div>

                      {/* Item Total */}
                      <div className="mt-3 text-right">
                        <span className="text-sm text-gray-600">Subtotal: </span>
                        <span className="text-lg font-bold text-blue-600">₹{item.item_total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartDetails.items.length} items)</span>
                    <span>₹{cartDetails.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{(cartDetails.total * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Estimated Total</span>
                    <span className="text-blue-600">₹{(cartDetails.total * 1.18).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => navigate('/store/products')}
                  className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    100% Genuine Products
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Fast Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
