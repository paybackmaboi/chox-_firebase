import React, { useState, useEffect } from 'react';
import Header from './Header'; 
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Menu items data
  const menuItems = [
    {
      id: 1,
      image: '/images/1.jpg',
      title: 'Spicy Basil',
      description: 'Thai chili, minced chicken',
      price: '₱150'
    },
    {
      id: 2,
      image: '/images/2.jpg',
      title: 'Truffle Pasta',
      description: 'Creamy sauce, parmesan',
      price: '₱190',
      badge: 'Bestseller'
    },
    {
      id: 3,
      image: '/images/3.jpg',
      title: 'Dragon Roll',
      description: 'Eel, avocado, tobiko',
      price: '₱220'
    },
    {
      id: 4,
      image: '/images/4.jpg',
      title: 'Premium Steak',
      description: 'Wagyu beef, truffle butter',
      price: '₱450'
    },
    {
      id: 5,
      image: '/images/5.jpg',
      title: 'Seafood Platter',
      description: 'Fresh catch, lemon butter',
      price: '₱380'
    },
    {
      id: 6,
      image: '/images/6.jpg',
      title: 'Sushi Combo',
      description: 'Assorted fresh sushi',
      price: '₱320'
    }
  ];

  // Auto-slide every 3 seconds (industry standard)
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % menuItems.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPaused, menuItems.length]);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + menuItems.length) % menuItems.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % menuItems.length);
  };

  return (
    <div className="bg-[#1a1a1a] text-[#F5F5F5] font-display selection:bg-[#D4AF37] selection:text-black overflow-x-hidden relative">
      
      {/* Enhanced CSS Animations with Gold Theme */}
      <style>{`
        .text-gradient-gold {
          background: linear-gradient(to right, #AA8C2C, #F3D675, #D4AF37, #FFD700, #AA8C2C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: shine 4s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
        .gold-glow {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2);
        }
        .gold-glow-strong {
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4), 0 0 90px rgba(255, 215, 0, 0.2);
        }
        .gold-pulse {
          animation: goldPulse 3s ease-in-out infinite;
        }
        @keyframes goldPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
          50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.4); }
        }
        .gold-shimmer {
          position: relative;
          overflow: hidden;
        }
        .gold-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          to { left: 100%; }
        }
        .animate-gradient-shift {
          animation: gradientShift 3s ease infinite;
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Smooth Carousel Transition */
        .carousel-smooth {
          transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        
        /* Fade effect for smoother transitions */
        .carousel-item {
          transition: opacity 800ms ease-in-out, transform 800ms cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      {/* ------------------------------- */}

      <div className="relative flex min-h-screen w-full flex-col z-10">
        
        {/* --- UNIFORM HEADER --- */}
        <Header />
        {/* ---------------------- */}

        {/* HERO SECTION */}
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/open.jpg")' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#1a1a1a]"></div>
          </div>
          
          <div className="relative z-30 text-center px-6 max-w-5xl animate-fade-in-up">
            <div className="mb-8 flex justify-center">
              <div className="p-5 rounded-full border-2 border-[#D4AF37] bg-black/40 backdrop-blur-md gold-glow-strong gold-pulse">
                <img 
                  src="/logo.jpg" 
                  alt="CHOX Kitchen Logo" 
                  className="w-24 h-24 rounded-full object-cover animate-pulse" 
                />
              </div>
            </div>
            
            <h1 className="text-gradient-gold text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter mb-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
              CHOX KITCHEN
            </h1>
            
            <p className="text-white text-xl md:text-3xl font-light tracking-wide mb-14 drop-shadow-md">
              Taste the World, Delivered to Your Door
            </p>
            
           
          </div>
          
        
        </div>

        {/* SELECTION / MENU HIGHLIGHTS */}
        <div className="w-full bg-[#1a1a1a] py-24 lg:py-32 px-4 lg:px-20 relative">
          {/* Enhanced Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-[#FFD700]/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
          <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-[#D4AF37]/8 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-20 left-20 w-[250px] h-[250px] bg-[#F3D675]/8 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="text-center mb-20 relative z-10">
            <h3 className="text-[#FFD700] text-sm font-bold uppercase tracking-[0.3em] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Selection</h3>
            <h2 className="text-5xl md:text-6xl font-light text-white">Curated <span className="text-gradient-gold">Highlights</span></h2>
          </div>
          
          {/* Carousel Container */}
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Carousel Wrapper */}
            <div className="relative overflow-hidden">
              <div 
                className="flex carousel-smooth"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {menuItems.map((item, index) => (
                  <div key={item.id} className="w-full flex-shrink-0 px-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      {/* Display 3 items at a time */}
                      {[0, 1, 2].map((offset) => {
                        const itemIndex = (index + offset) % menuItems.length;
                        const displayItem = menuItems[itemIndex];
                        const isCenter = offset === 1;
                        return (
                          <div 
                            key={displayItem.id} 
                            className={`carousel-item group relative h-[550px] border-2 overflow-hidden bg-[#252525] rounded-sm gold-shimmer ${
                              isCenter 
                                ? 'md:-mt-12 border-[#FFD700] shadow-[0_0_60px_rgba(255,215,0,0.6)] scale-105 z-10' 
                                : 'border-[#D4AF37]/30 hover:border-[#FFD700] hover:shadow-[0_0_60px_rgba(255,215,0,0.4)]'
                            }`}
                            style={{
                              transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={() => isCenter && setIsPaused(true)}
                            onMouseLeave={() => isCenter && setIsPaused(false)}
                          >
                            <div 
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                              style={{ 
                                backgroundImage: `url("${displayItem.image}")`,
                                transition: 'transform 1000ms cubic-bezier(0.4, 0, 0.2, 1), opacity 800ms ease-in-out'
                              }}
                            ></div>
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-700 ${
                              isCenter ? 'opacity-70 group-hover:opacity-50' : 'opacity-80 group-hover:opacity-60'
                            }`}></div>
                            {displayItem.badge && (
                              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black text-xs font-bold px-4 py-2 uppercase tracking-widest gold-glow animate-pulse">
                                {displayItem.badge}
                              </div>
                            )}
                            {isCenter && (
                              <div className="absolute top-4 left-4 bg-[#FFD700]/90 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Featured
                              </div>
                            )}
                            <div className={`absolute bottom-0 left-0 w-full p-10 border-t backdrop-blur-md bg-black/30 transition-transform duration-500 ${
                              isCenter 
                                ? 'border-[#FFD700]/30 translate-y-0' 
                                : 'border-[#D4AF37]/10 translate-y-2 group-hover:translate-y-0'
                            }`}>
                              <div className="flex justify-between items-end">
                                <div>
                                  <h3 className={`text-3xl text-gradient-gold font-display font-medium mb-2 transition-all duration-500 ${isCenter ? 'drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : ''}`}>
                                    {displayItem.title}
                                  </h3>
                                  <p className="text-gray-300 text-sm font-light uppercase tracking-wider">{displayItem.description}</p>
                                </div>
                                <span className={`text-4xl font-light text-white italic transition-colors duration-500 ${isCenter ? 'text-[#FFD700]' : ''}`}>
                                  {displayItem.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#FFD700]/20 hover:bg-[#FFD700]/40 backdrop-blur-md p-3 rounded-full transition-all duration-300 gold-glow hidden md:block hover:scale-110 active:scale-95"
              aria-label="Previous"
            >
              <span className="material-symbols-outlined text-[#FFD700] text-3xl">chevron_left</span>
            </button>
            <button 
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#FFD700]/20 hover:bg-[#FFD700]/40 backdrop-blur-md p-3 rounded-full transition-all duration-300 gold-glow hidden md:block hover:scale-110 active:scale-95"
              aria-label="Next"
            >
              <span className="material-symbols-outlined text-[#FFD700] text-3xl">chevron_right</span>
            </button>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-12">
              {menuItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-500 rounded-full ${
                    currentSlide === index 
                      ? 'w-12 h-3 bg-[#FFD700] gold-glow scale-110' 
                      : 'w-3 h-3 bg-gray-600 hover:bg-gray-400 hover:scale-125'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-20 text-center relative z-10">
            <Link to="/menu" className="group relative inline-flex items-center justify-center px-16 py-6 overflow-hidden font-bold tracking-[0.3em] text-black uppercase bg-gradient-to-r from-[#FFD700] via-[#F3D675] to-[#FFD700] rounded-sm transition-all duration-500 hover:scale-105 gold-glow-strong hover:shadow-[0_0_80px_rgba(255,215,0,0.8)] bg-[length:200%_100%] hover:bg-[position:100%_0] animate-gradient-shift">
              <span className="relative z-10 flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
                View Full Menu
                <span className="material-symbols-outlined text-2xl group-hover:translate-x-2 transition-transform duration-300">arrow_forward</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            </Link>
          </div>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div className="w-full bg-[#222222] py-32 relative overflow-hidden border-t border-[#444]">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-3xl font-light text-white uppercase tracking-widest">
                <span className="text-gradient-gold font-bold">How</span> It Works
              </h2>
            </div>
            
            <div className="relative flex flex-col md:flex-row justify-between items-center gap-16 md:gap-0">
              <div className="absolute top-10 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent hidden md:block"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center group w-full md:w-1/3">
                <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-[#FFD700] flex items-center justify-center mb-8 gold-glow group-hover:bg-gradient-to-br group-hover:from-[#FFD700] group-hover:to-[#D4AF37] group-hover:text-black group-hover:shadow-[0_0_50px_rgba(255,215,0,0.8)] transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-110">
                  <span className="material-symbols-outlined text-3xl text-[#FFD700] group-hover:text-black">search</span>
                </div>
                <h4 className="text-[#FFD700] font-bold text-xl mb-3 tracking-widest drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">BROWSE</h4>
                <p className="text-gray-400 text-sm max-w-[200px] leading-relaxed">Explore our exquisite global menu curated by top chefs.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group w-full md:w-1/3">
                <div className="w-20 h-20 rounded-full bg-[#050505] border-2 border-[#FFD700] flex items-center justify-center mb-8 gold-glow group-hover:bg-gradient-to-br group-hover:from-[#FFD700] group-hover:to-[#D4AF37] group-hover:text-black group-hover:shadow-[0_0_50px_rgba(255,215,0,0.8)] transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-110">
                  <span className="material-symbols-outlined text-3xl text-[#FFD700] group-hover:text-black">touch_app</span>
                </div>
                <h4 className="text-[#FFD700] font-bold text-xl mb-3 tracking-widest drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">SELECT</h4>
                <p className="text-gray-400 text-sm max-w-[200px] leading-relaxed">Customize your meal to perfection with premium add-ons.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group w-full md:w-1/3">
                <div className="w-20 h-20 rounded-full bg-[#050505] border-2 border-[#FFD700] flex items-center justify-center mb-8 gold-glow group-hover:bg-gradient-to-br group-hover:from-[#FFD700] group-hover:to-[#D4AF37] group-hover:text-black group-hover:shadow-[0_0_50px_rgba(255,215,0,0.8)] transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-110">
                  <span className="material-symbols-outlined text-3xl text-[#FFD700] group-hover:text-black">local_shipping</span>
                </div>
                <h4 className="text-[#FFD700] font-bold text-xl mb-3 tracking-widest drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">RECEIVE</h4>
                <p className="text-gray-400 text-sm max-w-[200px] leading-relaxed">Enjoy gourmet food delivered hot to your doorstep.</p>
              </div>
            </div>
          </div>
        </div>

        {/* TESTIMONIAL SECTION */}
        <div className="w-full bg-[#1a1a1a] py-32 px-4 flex justify-center relative">
          <div className="relative w-full max-w-6xl h-[600px] rounded-sm overflow-hidden border-2 border-[#D4AF37]/40 shadow-[0_0_80px_rgba(255,215,0,0.2)] group gold-shimmer">
            <div className="absolute inset-0 bg-cover bg-center blur-[2px] opacity-70 scale-105 group-hover:scale-100 transition-transform duration-[2s]" style={{ backgroundImage: 'url("/images/4.jpg")' }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/30"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-24 max-w-3xl">
              <span className="material-symbols-outlined text-8xl text-[#FFD700]/30 mb-8 drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">format_quote</span>
              <p className="text-3xl md:text-5xl text-white font-light italic leading-tight mb-12 drop-shadow-lg">
                "The Spicy Basil Chicken is absolutely authentic. It reminds me of my trip to Bangkok. A truly <span className="text-gradient-gold font-normal drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]">premium experience</span>."
              </p>
              <div className="flex items-center gap-6">
                <div className="h-[3px] w-20 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-transparent gold-glow"></div>
                <div>
                  <h4 className="text-[#FFD700] text-xl font-bold tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Sarah Jenkins</h4>
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Food Blogger</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOCATION MAP SECTION */}
        <div className="w-full bg-[#222222] py-24 px-4 border-t border-[#FFD700]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700]/10 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4AF37]/8 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-light text-white mb-4">
                Visit <span className="text-gradient-gold font-normal">Our Location</span>
              </h2>
              <p className="text-gray-400 font-light text-lg">Find us and experience culinary excellence in person</p>
            </div>
            
            <div className="relative rounded-lg overflow-hidden border-2 border-[#FFD700]/30 gold-glow-strong">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!4v1772324276434!6m8!1m7!1sK3gw1A_d7oAX5yQR8yZ0YQ!2m2!1d10.40243225524867!2d123.9200615332288!3f322.07491673568387!4f-26.468847362759313!5f0.7820865974627469"
                width="100%" 
                height="450" 
                style={{ border: 0 }}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                allow="accelerometer; gyroscope; magnetometer"
                title="CHOX Kitchen Location"
                className="w-full"
              ></iframe>
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 text-[#FFD700] text-lg">
                <span className="material-symbols-outlined text-3xl">location_on</span>
                <span className="text-gray-300">Cebu, Philippines</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full bg-[#1a1a1a] border-t border-[#FFD700]/20 relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-16">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              
              {/* Company Info */}
              <div>
                <h3 className="text-gradient-gold font-bold text-2xl tracking-[0.2em] mb-4">CHOX KITCHEN</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Experience culinary excellence with our premium selection of dishes, crafted by expert chefs and delivered fresh to your door.
                </p>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span className="material-symbols-outlined text-[#FFD700]">location_on</span>
                  <span>Cebu, Philippines</span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">Quick Links</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/menu" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
                      Menu
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">Contact Us</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-[#FFD700] text-xl">call</span>
                    <div>
                      <p className="text-white font-medium mb-1">Phone</p>
                      <a href="tel:+639123456789" className="hover:text-[#FFD700] transition-colors">
                        +63 912 345 6789
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-[#FFD700] text-xl">mail</span>
                    <div>
                      <p className="text-white font-medium mb-1">Email</p>
                      <a href="mailto:info@choxkitchen.com" className="hover:text-[#FFD700] transition-colors">
                        info@choxkitchen.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-[#FFD700] text-xl">schedule</span>
                    <div>
                      <p className="text-white font-medium mb-1">Hours</p>
                      <p>Mon - Sun: 10:00 AM - 10:00 PM</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Social Media & Newsletter */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">Stay Connected</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Follow us on social media for updates and special offers.
                </p>
                <div className="flex gap-4 mb-6">
                  <a href="#" className="w-10 h-10 rounded-full bg-[#252525] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all duration-300 gold-glow">
                    <span className="material-symbols-outlined text-xl">public</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[#252525] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all duration-300 gold-glow">
                    <span className="material-symbols-outlined text-xl">share</span>
                  </a>
                </div>
                <div className="mt-4">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="w-full bg-[#252525] border border-[#FFD700]/30 rounded px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors mb-2"
                  />
                  <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold text-sm py-2 rounded hover:from-[#F3D675] hover:to-[#FFD700] transition-all duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#FFD700]/20 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm">
                  © 2024 CHOX KITCHEN. All Rights Reserved.
                </p>
                <div className="flex gap-6 text-sm">
                  <Link to="/privacy" className="text-gray-500 hover:text-[#FFD700] transition-colors">
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="text-gray-500 hover:text-[#FFD700] transition-colors">
                    Terms of Service
                  </Link>
                  <Link to="/cookies" className="text-gray-500 hover:text-[#FFD700] transition-colors">
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Homepage;