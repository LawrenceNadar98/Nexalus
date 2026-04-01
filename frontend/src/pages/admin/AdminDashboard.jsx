import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, DollarSign, TrendingUp, AlertCircle, 
  Plus, Edit, Trash2, Upload, X, Eye, LogOut
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'dashboard') {
        const response = await axios.get(`${API_URL}/api/admin/stats`);
        setStats(response.data);
      } else if (activeTab === 'products') {
        const response = await axios.get(`${API_URL}/api/store/products?limit=100`);
        setProducts(response.data.products);
      } else if (activeTab === 'orders') {
        const response = await axios.get(`${API_URL}/api/admin/orders`);
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/admin/login');
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/api/admin/products/${productId}`);
      toast.success('Product deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/admin/orders/${orderId}/status?status=${newStatus}`);
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update order');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/store')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View Store
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {['dashboard', 'products', 'orders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stats && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Products</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total_products}</p>
                      </div>
                      <Package className="h-12 w-12 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total_orders}</p>
                      </div>
                      <ShoppingCart className="h-12 w-12 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-900">₹{Math.round(stats.total_revenue).toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-12 w-12 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending Orders</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.pending_orders}</p>
                      </div>
                      <TrendingUp className="h-12 w-12 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Low Stock Alert */}
                {stats.low_stock_count > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold text-yellow-900">Low Stock Alert</h3>
                        <p className="text-sm text-yellow-700">{stats.low_stock_count} products have low stock (less than 5 units)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
                  <div className="space-y-3">
                    {stats.recent_orders.map((order) => (
                      <div key={order._id} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div>
                          <p className="font-semibold text-gray-900">{order.order_number}</p>
                          <p className="text-sm text-gray-600">{order.user_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Top Selling Products</h2>
                  <div className="space-y-3">
                    {stats.top_selling_products.map((item) => (
                      <div key={item._id} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div>
                          <p className="font-semibold text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-600">Total sold: {item.total_quantity} units</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
                  <button
                    onClick={() => toast.info('Use API to add products. Check /app/STORE_SETUP_GUIDE.md')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Product (via API)
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                {product.images?.[0] ? (
                                  <img src={`${API_URL}${product.images[0]}`} alt="" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <Package className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-600">{product.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{product.price.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm ${product.stock_quantity < 5 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                              {product.stock_quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate(`/store/product/${product._id}`)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{order.order_number}</h3>
                          <p className="text-sm text-gray-600">{order.user_name} • {order.user_email}</p>
                          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{order.items.length} items</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Payment Status</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.payment_status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.payment_status}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Order Status</p>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Shipping Address</p>
                        <p className="text-sm text-gray-600">
                          {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Phone: {order.shipping_address.phone}</p>
                        {order.has_gst && (
                          <p className="text-sm text-gray-600 mt-1">GST: {order.gst_number} ({order.company_name})</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
