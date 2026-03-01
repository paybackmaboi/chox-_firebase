import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 font-display ${
      scrolled 
        ? 'backdrop-blur-lg bg-[#1a1a1a]/95 border-b border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/10' 
        : 'backdrop-blur-md bg-[#1a1a1a]/80 border-b border-[#FFD700]/20'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFD700]/20 rounded-full blur-md group-hover:bg-[#FFD700]/40 transition-all duration-300"></div>
            <img 
              src="/logo.jpg" 
              alt="Chox Kitchen Logo" 
              className="relative w-12 h-12 rounded-full border-2 border-[#FFD700]/50 group-hover:border-[#FFD700] object-cover transition-all duration-300 group-hover:scale-105" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-gradient-gold uppercase">
              CHOX KITCHEN
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Culinary Excellence</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link 
            to="/" 
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 tracking-wide rounded-md ${
              isActive('/') 
                ? 'text-[#FFD700] bg-[#FFD700]/10' 
                : 'text-gray-300 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/menu" 
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 tracking-wide rounded-md ${
              isActive('/menu') 
                ? 'text-[#FFD700] bg-[#FFD700]/10' 
                : 'text-gray-300 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
            }`}
          >
            Menu
          </Link>
          <Link 
            to="/about" 
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 tracking-wide rounded-md ${
              isActive('/about') 
                ? 'text-[#FFD700] bg-[#FFD700]/10' 
                : 'text-gray-300 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
            }`}
          >
            About Us
          </Link>
          <Link 
            to="/faq" 
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 tracking-wide rounded-md ${
              isActive('/faq') 
                ? 'text-[#FFD700] bg-[#FFD700]/10' 
                : 'text-gray-300 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
            }`}
          >
            FAQ
          </Link>
        </nav>

        {/* CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Order Now Button - Desktop */}
          <Link 
            to="/menu" 
            className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold text-sm rounded-md hover:from-[#F3D675] hover:to-[#FFD700] transition-all duration-300 transform hover:scale-105 gold-glow"
          >
            <span className="material-symbols-outlined text-lg">restaurant</span>
            Order Now
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-300 hover:text-[#FFD700] transition-colors rounded-md hover:bg-[#FFD700]/10" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-[#1a1a1a]/98 backdrop-blur-lg border-b border-[#FFD700]/20 transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <nav className="px-6 py-4 space-y-2">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)} 
            className={`flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-md transition-all duration-300 ${
              isActive('/') 
                ? 'text-[#FFD700] bg-[#FFD700]/10' 
                : 'text-gray-300 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
            }`}
          >
            <span className="material-symbols-outlined text-xl">home</span>
            Home
          </Link>
          <Link 
            to="/menu" 
            onClick={() => setIsOpen(false)} 
            className={`flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-md transition-all duration-300 ${
              isActive('/menu') 
                ? 'text-[#FFD700] bg-[#FFD700]/10' 
                : 'text-gray-300 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
            }`}
          >
            <span className="material-symbols-outlined text-xl">restaurant_menu</span>
            Menu
          </Link>
          <Link 
            to="/about" 
            onClick={() => setIsOpen(false)} 
            className={`flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-md transition-all duration-300 ${
              isActive('/about') 
                ? 'text-[#FFD700] bg-[#FFD700]/10' 
                : 'text-gray-300 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
            }`}
          >
            <span className="material-symbols-outlined text-xl">info</span>
            About Us
          </Link>
          <Link 
            to="/faq" 
            onClick={() => setIsOpen(false)} 
            className={`flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-md transition-all duration-300 ${
              isActive('/faq') 
                ? 'text-[#FFD700] bg-[#FFD700]/10' 
                : 'text-gray-300 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
            }`}
          >
            <span className="material-symbols-outlined text-xl">help</span>
            FAQ
          </Link>
          
          {/* Mobile CTA Button */}
          <Link 
            to="/menu" 
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold text-base rounded-md hover:from-[#F3D675] hover:to-[#FFD700] transition-all duration-300 gold-glow"
          >
            <span className="material-symbols-outlined text-xl">restaurant</span>
            Order Now
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;