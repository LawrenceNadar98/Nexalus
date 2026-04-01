import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/admin/login`, formData);
      localStorage.setItem('admin_token', response.data.access_token);
      localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-blue-200">Nexalus Store Management</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>
        </div>

        {/* Back to Store */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/store')}
            className="text-sm text-blue-200 hover:text-white transition-colors"
          >
            ← Back to Store
          </button>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-sm text-yellow-200">
            <strong>First time setup:</strong> Create admin account by calling the API with secret key.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
