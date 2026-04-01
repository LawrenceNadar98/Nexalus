import React, { useState } from 'react';
import { Menu, X, Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { companyInfo } from '../mock/data';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Home', id: 'home', path: '/' },
    { label: 'About', id: 'about', path: '/' },
    { label: 'Services', id: 'services', path: '/' },
    { label: 'Solutions', id: 'solutions', path: '/' },
    { label: 'Gallery', id: 'gallery', path: '/' },
    { label: 'Partners', id: 'partners', path: '/' },
    { label: 'Why Us', id: 'why-us', path: '/' },
    { label: 'Contact', id: 'contact', path: '/' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between py-2 text-sm">
            <div className="flex flex-wrap items-center gap-4">
              <a href={`tel:${companyInfo.contact.phone[0]}`} className="flex items-center gap-1 hover:text-blue-200 transition-colors">
                <Phone className="h-3 w-3" />
                <span className="hidden sm:inline">{companyInfo.contact.phone[0]}</span>
              </a>
              <a href={`mailto:${companyInfo.contact.email}`} className="flex items-center gap-1 hover:text-blue-200 transition-colors">
                <Mail className="h-3 w-3" />
                <span className="hidden sm:inline">{companyInfo.contact.email}</span>
              </a>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <MapPin className="h-3 w-3" />
              <span className="hidden md:inline">Ahmedabad, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => scrollToSection('home')} className="flex items-center space-x-3">
              <img 
                src="https://customer-assets.emergentagent.com/job_ad90301e-955a-4498-9a69-0fd44dadd032/artifacts/2nn1km20_Logo%20PNG%20%281%29.png" 
                alt="Nexalus Infotech Logo"
                className="h-12 w-auto object-contain"
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
            <a
              href="/store"
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2 group shadow-lg"
            >
              🛒 Visit Store
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 group"
            >
              Get Quote
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-blue-600 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Get Quote
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
