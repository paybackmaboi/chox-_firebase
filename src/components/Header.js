import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#12110e]/90 border-b border-[#393528]/30 font-display">
      <div className="w-full mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="size-10 rounded-full border border-[#e9b10c]/30 flex items-center justify-center shadow-glow bg-[#1a1814]">
            <span className="material-symbols-outlined text-[#e9b10c] text-2xl">restaurant</span>
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#fff5d6] via-[#e9b10c] to-[#b8860b] font-display uppercase drop-shadow-md">
            Chox Kitchen
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-[#bab29c] hover:text-[#e9b10c] transition-colors tracking-wide">Home</Link>
          <Link to="/menu" className="text-sm font-medium text-[#bab29c] hover:text-[#e9b10c] transition-colors tracking-wide">Menu</Link>
          <Link to="/about" className="text-sm font-medium text-[#bab29c] hover:text-[#e9b10c] transition-colors tracking-wide">About Us</Link>
          <Link to="/contact" className="text-sm font-medium text-[#bab29c] hover:text-[#e9b10c] transition-colors tracking-wide">Contact</Link>
        </nav>

        {/* Right Icons & Mobile Toggle */}
        <div className="flex items-center gap-6">
          <button className="relative group p-2 rounded-full hover:bg-white/5 transition-colors hidden sm:block">
            <span className="material-symbols-outlined text-[#bab29c] group-hover:text-[#e9b10c] transition-colors text-2xl">search</span>
          </button>
          <button className="relative group p-2 rounded-full hover:bg-white/5 transition-colors hidden sm:block">
            <span className="material-symbols-outlined text-[#bab29c] group-hover:text-[#e9b10c] transition-colors text-2xl">person</span>
          </button>
          <button className="relative group p-2 rounded-full hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[#bab29c] group-hover:text-[#e9b10c] transition-colors text-2xl">shopping_cart</span>
            <div className="absolute top-1 right-0 size-4 bg-[#e9b10c] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-glow">3</div>
          </button>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden text-[#bab29c] hover:text-[#e9b10c]" onClick={() => setIsOpen(!isOpen)}>
            <span className="material-symbols-outlined text-3xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#12110e] border-b border-[#393528]/30 py-4 px-6 flex flex-col gap-4 shadow-xl h-screen z-50">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-[#bab29c] hover:text-[#e9b10c] text-xl font-medium py-3 border-b border-[#393528]/30">Home</Link>
          <Link to="/menu" onClick={() => setIsOpen(false)} className="text-[#bab29c] hover:text-[#e9b10c] text-xl font-medium py-3 border-b border-[#393528]/30">Menu</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="text-[#bab29c] hover:text-[#e9b10c] text-xl font-medium py-3 border-b border-[#393528]/30">About Us</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="text-[#bab29c] hover:text-[#e9b10c] text-xl font-medium py-3 border-b border-[#393528]/30">Contact</Link>
        </div>
      )}
    </header>
  );
};

export default Header;