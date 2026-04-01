import React from 'react';
import { Award, Handshake } from 'lucide-react';

const PartnersSection = () => {
  // Partner companies with their logo URLs
  const partners = [
    { name: 'Cisco', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg' },
    { name: 'Hikvision', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Hikvision_logo.svg' },
    { name: 'Dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg' },
    { name: 'HP', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg' },
    { name: 'Honeywell', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Honeywell_logo.svg' },
    { name: 'CommScope', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/CommScope_logo.svg' },
    { name: 'D-Link', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/D-Link_logo.svg' },
    { name: 'TP-Link', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/34/TP-Link_logo.svg' },
    { name: 'Netgear', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/NETGEAR_logo.svg' },
    { name: 'Canon', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Canon_wordmark.svg' },
    { name: 'Dell EMC', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg' },
    { name: 'Dahua Technology', logo: 'https://via.placeholder.com/150x60/1e3a8a/ffffff?text=Dahua' },
    { name: 'CP Plus', logo: 'https://via.placeholder.com/150x60/1e3a8a/ffffff?text=CP+Plus' },
    { name: 'UNV (Uniview)', logo: 'https://via.placeholder.com/150x60/1e3a8a/ffffff?text=UNV' },
    { name: 'ZKTeco', logo: 'https://via.placeholder.com/150x60/1e3a8a/ffffff?text=ZKTeco' },
    { name: 'Tech Mahindra', logo: 'https://via.placeholder.com/150x60/1e3a8a/ffffff?text=Tech+Mahindra' },
    { name: 'Tata Motors', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Tata_Motors_Logo.svg' },
    { name: 'AE Connect', logo: 'https://via.placeholder.com/150x60/1e3a8a/ffffff?text=AE+Connect' },
    { name: 'Shivalik', logo: 'https://via.placeholder.com/150x60/1e3a8a/ffffff?text=Shivalik' },
    { name: 'BVG', logo: 'https://via.placeholder.com/150x60/1e3a8a/ffffff?text=BVG' }
  ];

  return (
    <section id="partners" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Our Partners</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Trusted Technology Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We collaborate with world-leading brands to deliver cutting-edge ELV & ICT solutions
          </p>
        </div>

        {/* Partnership Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center border border-blue-100">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="h-7 w-7 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
            <div className="text-gray-700 font-medium">Global Partners</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 text-center border border-cyan-100">
            <div className="w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-7 w-7 text-white" />
            </div>
            <div className="text-3xl font-bold text-cyan-600 mb-2">15+</div>
            <div className="text-gray-700 font-medium">Years Partnership</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center border border-blue-100">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-700 font-medium">Certified Products</div>
          </div>
        </div>

        {/* Partners Logo Grid */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className="group bg-white rounded-lg p-6 flex items-center justify-center hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300 min-h-[100px]"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                }}
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} Logo`}
                  className="max-w-full max-h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/150x60/1e3a8a/ffffff?text=${encodeURIComponent(partner.name)}`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Benefits */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Genuine Products</h3>
            <p className="text-sm text-gray-600">100% authentic products from authorized partners</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Warranty Support</h3>
            <p className="text-sm text-gray-600">Full manufacturer warranty and support</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Latest Technology</h3>
            <p className="text-sm text-gray-600">Access to newest products and innovations</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Pricing</h3>
            <p className="text-sm text-gray-600">Competitive rates as authorized dealers</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 shadow-2xl shadow-blue-600/20">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Interested in Becoming a Partner?
          </h3>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Join our network of technology partners and grow your business with us
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg inline-flex items-center gap-2"
          >
            Contact Partnership Team
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
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

export default PartnersSection;
