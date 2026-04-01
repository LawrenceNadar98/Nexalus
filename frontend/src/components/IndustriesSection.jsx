import React from 'react';
import { Hotel, Heart, Building, Briefcase, Factory, Landmark } from 'lucide-react';
import { industries } from '../mock/data';

const iconMap = {
  Hotel: Hotel,
  Heart: Heart,
  Building: Building,
  Briefcase: Briefcase,
  Factory: Factory,
  Landmark: Landmark
};

const IndustriesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Industries We Serve</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Serving Diverse Sectors
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Providing specialized ELV & ICT solutions across multiple industries with proven expertise
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => {
            const IconComponent = iconMap[industry.icon];
            
            return (
              <div
                key={industry.id}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-xl cursor-pointer"
                style={{
                  animation: `fadeInScale 0.5s ease-out ${index * 0.08}s both`
                }}
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {industry.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm">
                  {industry.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12 border border-blue-100">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Industry-Specific Solutions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Customized Integration</h4>
                    <p className="text-sm text-gray-600">
                      Tailored ELV solutions designed specifically for your industry requirements and operational needs
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Rapid Deployment</h4>
                    <p className="text-sm text-gray-600">
                      Quick and efficient installation with minimal disruption to your ongoing operations
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Compliance & Safety</h4>
                    <p className="text-sm text-gray-600">
                      All solutions meet industry standards and regulatory compliance requirements
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Ongoing Support</h4>
                    <p className="text-sm text-gray-600">
                      24/7 technical support and maintenance services to ensure optimal performance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
};

export default IndustriesSection;
