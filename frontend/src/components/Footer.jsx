import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { companyInfo } from '../mock/data';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About Us', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Solutions', id: 'solutions' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Partners', id: 'partners' },
    { label: 'Why Choose Us', id: 'why-us' },
    { label: 'Contact', id: 'contact' }
  ];

  const services = [
    'ELV Turnkey Solutions',
    'ICT Systems Integration',
    'CCTV Surveillance',
    'Access Control Systems',
    'Fire Alarm Systems',
    'Building Management'
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_ad90301e-955a-4498-9a69-0fd44dadd032/artifacts/2nn1km20_Logo%20PNG%20%281%29.png" 
                alt="Nexalus Infotech Logo"
                className="h-16 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Leading Systems Integrator providing complete ELV turnkey solutions with focus on quality, efficiency, and customer satisfaction.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="text-gray-300 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{companyInfo.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <a href={`tel:${companyInfo.contact.phone[0]}`} className="block hover:text-blue-400 transition-colors">
                    {companyInfo.contact.phone[0]}
                  </a>
                  <a href={`tel:${companyInfo.contact.phone[1]}`} className="block hover:text-blue-400 transition-colors">
                    {companyInfo.contact.phone[1]}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${companyInfo.contact.email}`} className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  {companyInfo.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <button className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
