import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { heroContent, stats } from '../mock/data';

const HeroSection = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-40 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                Leading ELV & ICT Systems Integrator
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {heroContent.title}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {heroContent.subtitle}
            </p>
            
            <p className="text-lg text-gray-500">
              {heroContent.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={scrollToContact}
                className="group bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
              >
                Get Free Consultation
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={scrollToServices}
                className="group border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-semibold"
              >
                Explore Services
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
              {stats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroContent.image}
                alt="Modern Technology Infrastructure"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 max-w-xs hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Projects Delivered</div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-xl text-white max-w-xs hidden lg:block">
              <div className="text-sm font-semibold mb-1">24/7 Support</div>
              <div className="text-xs opacity-90">Round-the-clock assistance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="relative">
        <svg className="w-full h-20 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
