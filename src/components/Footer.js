import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 md:py-16 overflow-hidden">
      {/* Background overlay with transparency */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Shining gold accent elements */}
      <div className="absolute top-10 left-20 w-32 h-32 bg-yellow-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-600/25 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Section 1: Brand */}
          <div className="group">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
              🍽️ CHOX KITCHEN
            </h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              Delicious food delivered fresh to your doorstep.
              Experience culinary excellence with every bite.
            </p>
            <div className="flex gap-4 text-2xl">
              <button type="button" aria-label="Facebook" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 transform hover:scale-110">📘</button>
              <button type="button" aria-label="Instagram" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 transform hover:scale-110">📷</button>
              <button type="button" aria-label="Twitter" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 transform hover:scale-110">🐦</button>
              <button type="button" aria-label="Email" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 transform hover:scale-110">📧</button>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="group">
            <h4 className="text-lg font-semibold mb-4 text-gray-200 group-hover:text-yellow-400 transition-colors duration-300">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#menu" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block">Menu</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block">Contact</a></li>
              <li><a href="#delivery" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block">Delivery Info</a></li>
            </ul>
          </div>

          {/* Section 3: Contact Info */}
          <div className="group">
            <h4 className="text-lg font-semibold mb-4 text-gray-200 group-hover:text-yellow-400 transition-colors duration-300">Contact Info</h4>
            <div className="space-y-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              <p className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-300">
                <span className="text-yellow-400">📞</span> 09276402119
              </p>
              <p className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-300">
                <span className="text-yellow-400">📧</span> info@choxkitchen.com
              </p>
              <p className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-300">
                <span className="text-yellow-400">📍</span> Blk 2 lot 49 Camella Lessandra Miramonte, Cebu City
              </p>
            </div>
          </div>

          {/* Section 4: Hours */}
          <div className="group">
            <h4 className="text-lg font-semibold mb-4 text-gray-200 group-hover:text-yellow-400 transition-colors duration-300">Hours</h4>
            <div className="space-y-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              <p className="flex items-center gap-2">
                <span className="text-yellow-400">🕒</span> Monday - Friday: 10AM - 10PM
              </p>
              <p className="flex items-center gap-2">
                <span className="text-yellow-400">🕒</span> Saturday - Sunday: 9AM - 11PM
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center pt-8 border-t border-yellow-400/20 text-gray-500 text-sm">
          <p className="hover:text-yellow-400 transition-colors duration-300">
            &copy; {new Date().getFullYear()} CHOX KITCHEN. All rights reserved.
          </p>
        </div>
      </div>

      {/* Top gradient */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-900/80 to-transparent"></div>

      {/* Animation styles */}
      <style>{`
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </footer>
  );
};

export default Footer;