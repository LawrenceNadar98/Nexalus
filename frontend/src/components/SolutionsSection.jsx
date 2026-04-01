import React from 'react';
import { Camera, Shield, Flame, Network, Home, Volume2, Tv, Server, ArrowRight } from 'lucide-react';
import { products } from '../mock/data';

const iconMap = {
  Camera: Camera,
  Shield: Shield,
  Flame: Flame,
  Network: Network,
  Home: Home,
  Volume2: Volume2,
  Tv: Tv,
  Server: Server
};

const SolutionsSection = () => {
  return (
    <section id="solutions" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Products & Solutions</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Complete Range of ELV Systems
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            State-of-the-art systems from leading brands for all your infrastructure needs
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
            const IconComponent = iconMap[product.icon];
            
            return (
              <div
                key={product.id}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all"
                style={{
                  animation: `fadeIn 0.6s ease-out ${index * 0.05}s both`
                }}
              >
                {/* Image */}
                {product.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                    
                    {/* Icon Overlay */}
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {product.description}
                  </p>

                  <div className="flex gap-2">
                    <button className="group/btn flex items-center gap-2 text-blue-600 text-sm font-semibold hover:gap-3 transition-all">
                      View Details
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-gray-300">|</span>
                    <a 
                      href="/store/products"
                      className="flex items-center gap-2 text-green-600 text-sm font-semibold hover:gap-3 transition-all"
                    >
                      Buy Now
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-blue-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Additional Info Banner */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Integrated Solutions for Modern Infrastructure
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We design, install, and maintain complete ELV systems using the latest technology from trusted brands like Hikvision, Cisco, Dell, HP, Honeywell, and more. Our solutions are scalable, efficient, and tailored to your specific requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">IP-Based Systems</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Conventional Systems</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Hybrid Solutions</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Cloud Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default SolutionsSection;
