import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      navigate('/store');
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-lg font-bold text-gray-900">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">What happens next?</h3>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Order Confirmed</h4>
                <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Processing</h4>
                <p className="text-sm text-gray-600">We're preparing your items for shipment</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">On the Way</h4>
                <p className="text-sm text-gray-600">Your order will be shipped within 2-3 business days</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Home className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Delivered</h4>
                <p className="text-sm text-gray-600">Expected delivery in 5-7 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Invoice Info */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Invoice on WhatsApp</h3>
              <p className="text-green-100">Your invoice has been sent to your WhatsApp number. Check your messages!</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/store/orders')}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/store')}
            className="border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Support */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">Need help? Contact us at</p>
          <p className="font-semibold text-blue-600">+91 9825 39 20 21</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
