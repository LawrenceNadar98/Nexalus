import React from 'react';
import { Users, GraduationCap, Package, Award, FileText, Headphones } from 'lucide-react';
import { whyChooseUs } from '../mock/data';

const iconMap = {
  Users: Users,
  GraduationCap: GraduationCap,
  Package: Package,
  Award: Award,
  FileText: FileText,
  Headphones: Headphones
};

const WhyChooseUsSection = () => {
  return (
    <section id="why-us" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Your Trusted ELV Systems Partner
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With years of experience and a commitment to excellence, we deliver solutions that exceed expectations
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUs.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            
            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-blue-200"
                style={{
                  animation: `popIn 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-blue-600/30">
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Number Badge */}
                  <div className="absolute top-6 right-6 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold opacity-50 group-hover:opacity-100 transition-opacity">
                    {index + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 shadow-2xl shadow-blue-600/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">15+</div>
              <div className="text-blue-100">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">200+</div>
              <div className="text-blue-100">Satisfied Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>

        {/* Certifications & Partnerships */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Trusted by Leading Brands
          </h3>
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex flex-wrap justify-center items-center gap-8">
              {['Cisco', 'Hikvision', 'Dell', 'HP', 'Honeywell', 'CommScope'].map((brand) => (
                <div
                  key={brand}
                  className="text-gray-400 font-semibold text-lg hover:text-blue-600 transition-colors"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.9);
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

export default WhyChooseUsSection;
