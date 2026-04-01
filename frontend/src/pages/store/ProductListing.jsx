import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Filter, Grid, List, ChevronDown, ShoppingCart } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, token } = useStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const conditions = ['New', 'Refurbished', 'Open Box'];
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  useEffect(() => {
    fetchBrands();
    fetchProducts();
  }, [searchParams, selectedBrands, selectedConditions, priceRange, sortBy]);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/store/brands`);
      setBrands(response.data.brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (selectedBrands.length > 0) {
        selectedBrands.forEach(brand => params.append('brand', brand));
      }
      if (selectedConditions.length > 0) {
        selectedConditions.forEach(condition => params.append('condition', condition));
      }
      params.append('min_price', priceRange[0]);
      params.append('max_price', priceRange[1]);

      const response = await axios.get(`${API_URL}/api/store/products?${params.toString()}`);
      
      // Sort products
      let sortedProducts = response.data.products;
      if (sortBy === 'price_low') {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_high') {
        sortedProducts.sort((a, b) => b.price - a.price);
      }
      
      setProducts(sortedProducts);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId, 1);
    if (success) {
      toast.success('Product added to cart!');
    } else {
      toast.error('Failed to add to cart');
    }
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleCondition = (condition) => {
    setSelectedConditions(prev =>
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category || search || 'All Products'}
          </h1>
          <p className="text-gray-600">{total} Products Found</p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹0</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Condition</h4>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <label key={condition} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition)}
                        onChange={() => toggleCondition(condition)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Brands</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedConditions([]);
                  setPriceRange([0, 500000]);
                }}
                className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                  >
                    <div onClick={() => navigate(`/store/product/${product._id}`)}>
                      <div className="relative h-48 bg-gray-100">
                        {product.images && product.images[0] ? (
                          <img
                            src={`${API_URL}${product.images[0]}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          {product.condition}
                        </span>
                        {product.offer_percentage > 0 && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            {product.offer_percentage}% OFF
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                          {product.original_price > product.price && (
                            <span className="text-sm text-gray-500 line-through">₹{product.original_price.toLocaleString()}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                          <span>Stock: {product.stock_quantity}</span>
                          <span className="text-blue-600">{product.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.stock_quantity === 0}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
