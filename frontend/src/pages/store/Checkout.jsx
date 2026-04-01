import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Building2, CreditCard } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const { token, clearCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [cartDetails, setCartDetails] = useState({ items: [], total: 0 });
  const [shippingCost, setShippingCost] = useState(0);

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
    whatsapp_number: '',
    has_gst: false,
    gst_number: '',
    company_name: ''
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
  ];

  useEffect(() => {
    if (!token) {
      navigate('/store/login');
      return;
    }
    fetchCart();
  }, [token]);

  useEffect(() => {
    // Calculate shipping based on state
    if (formData.state) {
      const metroCities = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Gujarat'];
      setShippingCost(metroCities.includes(formData.state) ? 50 : 100);
    }
  }, [formData.state]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/store/cart`);
      if (response.data.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/store/cart');
      }
      setCartDetails(response.data);
    } catch (error) {
      toast.error('Failed to load cart');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderResponse = await axios.post(`${API_URL}/api/store/checkout`, {
        shipping_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          phone: formData.phone
        },
        whatsapp_number: formData.whatsapp_number,
        has_gst: formData.has_gst,
        gst_number: formData.gst_number || null,
        company_name: formData.company_name || null
      });

      const { order_id, order_number, razorpay_order_id, razorpay_key_id, amount } = orderResponse.data;

      // Load Razorpay
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: razorpay_key_id,
        amount: amount * 100,
        currency: 'INR',
        name: 'Nexalus Infotech',
        description: `Order #${order_number}`,
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            // Verify payment
            await axios.post(`${API_URL}/api/store/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            await clearCart();
            toast.success('Payment successful!');
            navigate(`/store/order-confirmation?order_id=${order_id}`);
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: formData.phone
        },
        theme: {
          color: '#2563eb'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);

      razorpay.on('payment.failed', function () {
        toast.error('Payment failed. Please try again.');
        setLoading(false);
      });

    } catch (error) {
      toast.error(error.response?.data?.detail || 'Checkout failed');
      setLoading(false);
    }
  };

  const gstAmount = cartDetails.total * 0.18;
  const totalAmount = cartDetails.total + shippingCost + gstAmount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="House/Flat No., Street Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="380001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp & GST */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Additional Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number * (for invoice)
                    </label>
                    <input
                      type="tel"
                      name="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 98765 43210"
                    />
                    <p className="text-xs text-gray-500 mt-1">We'll send your invoice on WhatsApp</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="has_gst"
                      checked={formData.has_gst}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      I have GST Number (for business purchases)
                    </label>
                  </div>

                  {formData.has_gst && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GST Number *</label>
                        <input
                          type="text"
                          name="gst_number"
                          value={formData.gst_number}
                          onChange={handleChange}
                          required={formData.has_gst}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="27AABCT1234F1Z5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                        <input
                          type="text"
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleChange}
                          required={formData.has_gst}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Your Company Pvt Ltd"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{cartDetails.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">₹{shippingCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-medium">₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl text-blue-600">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  {loading ? 'Processing...' : 'Pay with Razorpay'}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-5" />
                  <span className="text-xs text-gray-500">Secured by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
