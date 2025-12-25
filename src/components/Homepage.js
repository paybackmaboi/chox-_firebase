import React from 'react'; // Removed useState and useEffect imports as they are no longer needed
import Header from './Header'; 
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="bg-[#050505] text-[#F5F5F5] font-display selection:bg-[#D4AF37] selection:text-black overflow-x-hidden relative">
      
      {/* CSS Animation for Text Gradients Only (Particles keyframes removed) */}
      <style>{`
        .text-gradient-gold {
          background: linear-gradient(to right, #AA8C2C, #F3D675, #D4AF37, #AA8C2C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: shine 6s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-[#050505]"></div>
          </div>
          
          <div className="relative z-30 text-center px-6 max-w-5xl animate-fade-in-up">
            <div className="mb-8 flex justify-center">
              <div className="p-5 rounded-full border border-[#D4AF37]/50 bg-black/60 backdrop-blur-md shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                <img 
                  src="/logo.jpg" 
                  alt="CHOX Kitchen Logo" 
                  className="w-24 h-24 rounded-full object-cover animate-pulse shadow-glow" 
                />
              </div>
            </div>
            
            <h1 className="text-gradient-gold text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter mb-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
              CHOX KITCHEN
            </h1>
            
            <p className="text-white text-xl md:text-3xl font-light tracking-wide mb-14 drop-shadow-md">
              Taste the World, Delivered to Your Door
            </p>
            
            <Link to="/menu" className="group relative inline-block px-12 py-5 overflow-hidden border border-[#D4AF37] text-[#F3D675] transition-all duration-500 hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.8)] rounded-sm bg-black/50 backdrop-blur-sm">
              <span className="relative z-10 text-base font-bold uppercase tracking-[0.3em]">Order Now</span>
              <div className="absolute inset-0 h-full w-full scale-x-0 bg-gradient-to-r from-[#AA8C2C] to-[#F3D675] transition-transform duration-500 ease-out group-hover:scale-x-100 origin-left"></div>
            </Link>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#D4AF37] animate-bounce z-30">
            <span className="material-symbols-outlined text-4xl shadow-glow">keyboard_arrow_down</span>
          </div>
        </div>

        {/* SELECTION / MENU HIGHLIGHTS */}
        <div className="w-full bg-[#050505] py-24 lg:py-32 px-4 lg:px-20 relative">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="text-center mb-20 relative z-10">
            <h3 className="text-[#D4AF37] text-sm font-bold uppercase tracking-[0.3em] mb-4">Selection</h3>
            <h2 className="text-5xl md:text-6xl font-light text-white">Curated Highlights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto relative z-10">
            {/* Card 1 */}
            <div className="group relative h-[550px] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-700 overflow-hidden bg-[#0a0a0a] rounded-sm hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" style={{ backgroundImage: 'url("/images/1.jpg")' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 left-0 w-full p-10 border-t border-[#D4AF37]/10 backdrop-blur-md bg-black/40 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-3xl text-gradient-gold font-display font-medium mb-2">Spicy Basil</h3>
                    <p className="text-gray-300 text-sm font-light uppercase tracking-wider">Thai chili, minced chicken</p>
                  </div>
                  <span className="text-4xl font-light text-white italic">₱150</span>
                </div>
              </div>
            </div>

            {/* Card 2 (Offset) */}
            <div className="group relative h-[550px] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-700 overflow-hidden bg-[#0a0a0a] rounded-sm md:-mt-12 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" style={{ backgroundImage: 'url("/images/2.jpg")' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700"></div>
              <div className="absolute top-4 right-4 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">Bestseller</div>
              <div className="absolute bottom-0 left-0 w-full p-10 border-t border-[#D4AF37]/10 backdrop-blur-md bg-black/40 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-3xl text-gradient-gold font-display font-medium mb-2">Truffle Pasta</h3>
                    <p className="text-gray-300 text-sm font-light uppercase tracking-wider">Creamy sauce, parmesan</p>
                  </div>
                  <span className="text-4xl font-light text-white italic">₱190</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative h-[550px] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-700 overflow-hidden bg-[#0a0a0a] rounded-sm hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" style={{ backgroundImage: 'url("/images/3.jpg")' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 left-0 w-full p-10 border-t border-[#D4AF37]/10 backdrop-blur-md bg-black/40 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-3xl text-gradient-gold font-display font-medium mb-2">Dragon Roll</h3>
                    <p className="text-gray-300 text-sm font-light uppercase tracking-wider">Eel, avocado, tobiko</p>
                  </div>
                  <span className="text-4xl font-light text-white italic">₱220</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center relative z-10">
            <Link to="/menu" className="inline-block text-[#D4AF37] text-sm uppercase tracking-[0.3em] hover:text-white transition-colors border-b border-[#D4AF37] pb-2 hover:pb-3 hover:border-white">
              View Full Menu
            </Link>
          </div>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div className="w-full bg-[#0a0a0a] py-32 relative overflow-hidden border-t border-[#333]">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-3xl font-light text-white uppercase tracking-widest">
                <span className="text-gradient-gold font-bold">How</span> It Works
              </h2>
            </div>
            
            <div className="relative flex flex-col md:flex-row justify-between items-center gap-16 md:gap-0">
              <div className="absolute top-10 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent hidden md:block"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center group w-full md:w-1/3">
                <div className="w-20 h-20 rounded-full bg-[#050505] border border-[#D4AF37] flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:bg-[#D4AF37] group-hover:text-black group-hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all duration-500 transform group-hover:-translate-y-2">
                  <span className="material-symbols-outlined text-3xl text-[#D4AF37] group-hover:text-black">search</span>
                </div>
                <h4 className="text-[#F3D675] font-bold text-xl mb-3 tracking-widest">BROWSE</h4>
                <p className="text-gray-400 text-sm max-w-[200px] leading-relaxed">Explore our exquisite global menu curated by top chefs.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group w-full md:w-1/3">
                <div className="w-20 h-20 rounded-full bg-[#050505] border border-[#D4AF37] flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:bg-[#D4AF37] group-hover:text-black group-hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all duration-500 transform group-hover:-translate-y-2">
                  <span className="material-symbols-outlined text-3xl text-[#D4AF37] group-hover:text-black">touch_app</span>
                </div>
                <h4 className="text-[#F3D675] font-bold text-xl mb-3 tracking-widest">SELECT</h4>
                <p className="text-gray-400 text-sm max-w-[200px] leading-relaxed">Customize your meal to perfection with premium add-ons.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group w-full md:w-1/3">
                <div className="w-20 h-20 rounded-full bg-[#050505] border border-[#D4AF37] flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:bg-[#D4AF37] group-hover:text-black group-hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all duration-500 transform group-hover:-translate-y-2">
                  <span className="material-symbols-outlined text-3xl text-[#D4AF37] group-hover:text-black">local_shipping</span>
                </div>
                <h4 className="text-[#F3D675] font-bold text-xl mb-3 tracking-widest">RECEIVE</h4>
                <p className="text-gray-400 text-sm max-w-[200px] leading-relaxed">Enjoy gourmet food delivered hot to your doorstep.</p>
              </div>
            </div>
          </div>
        </div>

        {/* TESTIMONIAL SECTION */}
        <div className="w-full bg-[#050505] py-32 px-4 flex justify-center relative">
          <div className="relative w-full max-w-6xl h-[600px] rounded-sm overflow-hidden border border-[#D4AF37]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] group">
            <div className="absolute inset-0 bg-cover bg-center blur-[2px] opacity-60 scale-105 group-hover:scale-100 transition-transform duration-[2s]" style={{ backgroundImage: 'url("/images/4.jpg")' }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-24 max-w-3xl">
              <span className="material-symbols-outlined text-8xl text-[#D4AF37]/20 mb-8">format_quote</span>
              <p className="text-3xl md:text-5xl text-white font-light italic leading-tight mb-12 drop-shadow-lg">
                "The Spicy Basil Chicken is absolutely authentic. It reminds me of my trip to Bangkok. A truly <span className="text-[#D4AF37] font-normal">premium experience</span>."
              </p>
              <div className="flex items-center gap-6">
                <div className="h-[2px] w-16 bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
                <div>
                  <h4 className="text-[#F3D675] text-xl font-bold tracking-widest uppercase">Sarah Jenkins</h4>
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Food Blogger</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEWSLETTER SECTION */}
        <div className="w-full bg-[#080808] py-24 px-4 border-t border-[#D4AF37]/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none"></div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-light text-white mb-8">
              Join the <span className="text-gradient-gold font-normal">Inner Circle</span>
            </h2>
            <p className="text-gray-400 mb-12 font-light text-lg">Get exclusive access to secret menus, chef's specials, and golden invites.</p>
            <div className="flex flex-col sm:flex-row gap-0 justify-center items-center max-w-md mx-auto">
              <input 
                className="w-full bg-transparent border-b border-[#D4AF37]/50 py-4 px-4 text-white focus:outline-none focus:border-[#D4AF37] placeholder-gray-600 font-light text-lg rounded-none transition-colors" 
                placeholder="Email Address" 
                type="email"
              />
              <button className="w-full sm:w-auto px-10 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-white transition-colors duration-300 shadow-[0_0_30px_rgba(212,175,55,0.3)] mt-6 sm:mt-0 sm:ml-4 sm:border-b sm:border-transparent">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full bg-black py-16 border-t border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-gradient-gold font-bold text-2xl tracking-[0.2em]">CHOX</div>
            <div className="flex gap-10 flex-wrap justify-center">
              <Link to="/menu" className="text-sm text-gray-400 hover:text-[#D4AF37] uppercase tracking-widest transition-colors duration-300">Menu</Link>
              <Link to="/about" className="text-sm text-gray-400 hover:text-[#D4AF37] uppercase tracking-widest transition-colors duration-300">Story</Link>
              <Link to="/" className="text-sm text-gray-400 hover:text-[#D4AF37] uppercase tracking-widest transition-colors duration-300">Locations</Link>
              <Link to="/about" className="text-sm text-gray-400 hover:text-[#D4AF37] uppercase tracking-widest transition-colors duration-300">Contact</Link>
            </div>
            <div className="flex gap-6">
              <a className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-300" href="#"><span className="material-symbols-outlined text-xl">public</span></a>
              <a className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-300" href="#"><span className="material-symbols-outlined text-xl">share</span></a>
            </div>
          </div>
          <div className="text-center mt-10 text-xs text-gray-700 uppercase tracking-widest">
            © 2024 CHOX KITCHEN. All Rights Reserved.
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Homepage;