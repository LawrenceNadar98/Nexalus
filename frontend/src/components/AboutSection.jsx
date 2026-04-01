import React from 'react';
import { Target, Eye, Lightbulb } from 'lucide-react';
import { aboutContent } from '../mock/data';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">About Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Leading ELV & ICT Systems Integrator
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {aboutContent.description}
          </p>
        </div>

        {/* Vision and Mission Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Vision Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/30">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h3>
                <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {aboutContent.vision}
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-600/30">
                <Target className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
                <div className="w-16 h-1 bg-cyan-600 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {aboutContent.mission}
            </p>
          </div>
        </div>

        {/* Key Values */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Our Core Values</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Quality', 'Customer Satisfaction', 'Teamwork', 'Integrity', 'Loyalty', 'Honesty'].map((value) => (
              <div
                key={value}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all hover:scale-105 border border-gray-100"
              >
                <div className="text-3xl mb-2">✓</div>
                <div className="text-sm font-semibold text-gray-800">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Section */}
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 shadow-2xl shadow-blue-600/20">
            <svg className="w-12 h-12 text-blue-200 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-xl md:text-2xl font-medium text-white mb-4">
              "The only way to do great work is to love what you do."
            </p>
            <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
