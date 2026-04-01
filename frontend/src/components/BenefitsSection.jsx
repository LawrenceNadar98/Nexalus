import React from 'react';
import { TrendingUp, DollarSign, BarChart3, ShieldCheck } from 'lucide-react';
import { benefits } from '../mock/data';

const iconMap = {
  TrendingUp: TrendingUp,
  DollarSign: DollarSign,
  BarChart3: BarChart3,
  ShieldCheck: ShieldCheck
};

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-blue-200 font-semibold text-sm uppercase tracking-wide">Key Benefits</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
            Why Partner With Nexalus Infotech
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Experience the advantages of working with a trusted ELV systems integrator
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon];
            
            return (
              <div
                key={benefit.id}
                className="group relative"
                style={{
                  animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all h-full">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <IconComponent className="h-7 w-7 text-blue-600" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-blue-100 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Decorative Element */}
                <div className="absolute -z-10 inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl transform group-hover:scale-105 transition-transform"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-6 border border-white/20">
            <p className="text-white text-lg mb-4">
              Ready to transform your infrastructure?
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg inline-flex items-center gap-2"
            >
              Start Your Project
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
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

export default BenefitsSection;
