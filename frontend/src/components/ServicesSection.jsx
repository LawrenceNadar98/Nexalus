import React from 'react';
import { Building2, Network, Wrench, Users, ArrowRight } from 'lucide-react';
import { services } from '../mock/data';

const iconMap = {
  Building2: Building2,
  Network: Network,
  Wrench: Wrench,
  Users: Users
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Comprehensive ELV & ICT Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From design to deployment and maintenance, we provide complete turnkey solutions tailored to your specific needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            
            return (
              <div
                key={service.id}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-blue-200"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/30">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <button className="group/btn flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
                  Learn More
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-center shadow-2xl shadow-blue-600/20">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Our experienced team can design and implement tailored ELV solutions to meet your specific requirements
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg inline-flex items-center gap-2"
          >
            Contact Our Team
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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

export default ServicesSection;
