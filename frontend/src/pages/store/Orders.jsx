import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Orders = () => {
  const navigate = useNavigate();
  const { token } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/store/login');
      return;
    }
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/store/orders`);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Confirmed': 'bg-blue-100 text-blue-700',
      'Processing': 'bg-purple-100 text-purple-700',
      'Shipped': 'bg-orange-100 text-orange-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
            <button
              onClick={() => navigate('/store/products')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Browse Products
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order #{order.order_number}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <button
                        onClick={() => navigate(`/store/order/${order._id}`)}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{item.total.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">₹{item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">
                          {order.items.length} item(s) • Payment: {order.payment_status}
                        </p>
                        {order.has_gst && (
                          <p className="text-xs text-gray-500">GST Invoice: {order.gst_number}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Shipping Address</p>
                    <p className="text-sm text-gray-600">
                      {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
