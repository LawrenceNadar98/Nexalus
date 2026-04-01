import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, Shield, ArrowLeft, Package } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useStore } from '../../contexts/StoreContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, token } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/store/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/store/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const success = await addToCart(productId, quantity);
    if (success) {
      toast.success('Product added to cart!');
    }
  };

  const handleBuyNow = async () => {
    const success = await addToCart(productId, quantity);
    if (success) {
      navigate('/store/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images[selectedImage] ? (
                  <img
                    src={`${API_URL}${product.images[selectedImage]}`}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={`${API_URL}${image}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            {/* Category & Brand */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-blue-600 font-medium">{product.category}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">{product.brand}</span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Condition Badge */}
            <div className="inline-block mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                product.condition === 'New' ? 'bg-green-100 text-green-700' :
                product.condition === 'Refurbished' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {product.condition}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.original_price > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{product.original_price.toLocaleString()}</span>
                    <span className="text-lg text-green-600 font-semibold">
                      {product.offer_percentage}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock_quantity > 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Package className="h-5 w-5" />
                  <span className="font-medium">In Stock ({product.stock_quantity} available)</span>
                </div>
              ) : (
                <div className="text-red-600 font-medium">Out of Stock</div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock_quantity > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border border-gray-300 rounded-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-5 w-5 text-blue-600" />
                <span>Free Shipping on orders above ₹5,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-green-600" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>100% Genuine Products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex border-b pb-2">
                      <span className="text-gray-600 w-1/2">{key}</span>
                      <span className="text-gray-900 font-medium w-1/2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
