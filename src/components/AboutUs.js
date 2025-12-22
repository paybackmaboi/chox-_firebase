import React from 'react';
import { Link } from 'react-router-dom';


const AboutPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-x-hidden antialiased selection:bg-primary/30 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col group/design-root">
        
        {/* Refined Header */}
        <header className="fixed top-0 z-50 w-full border-b border-[#393528]/50 bg-[#181611]/90 backdrop-blur-md transition-all duration-300">
          <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6 lg:px-12">
            <div className="flex items-center gap-4">
              <div className="size-8 text-primary drop-shadow-[0_0_8px_rgba(233,177,12,0.6)]">
                <svg className="h-full w-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-widest text-primary text-glow font-display">CHOX KITCHEN</h2>
            </div>
            
            <nav className="hidden md:flex items-center gap-10">
              <Link to="/" className="text-white/70 hover:text-primary transition-colors text-sm font-medium uppercase tracking-widest">Home</Link>
              <Link to="/menu" className="text-white/70 hover:text-primary transition-colors text-sm font-medium uppercase tracking-widest">Menu</Link>
              <Link to="/about" className="text-primary text-glow text-sm font-bold uppercase tracking-widest border-b border-primary/50 pb-1">About</Link>
              
            </nav>
            
            <Link to="/menu" className="hidden md:flex items-center justify-center rounded-sm bg-primary px-6 py-2 text-background-dark text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-glow">
              Order Now
            </Link>
            
            {/* Mobile Menu Icon */}
            <button className="md:hidden text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </header>

        <main className="flex-grow pt-20">
          {/* Artistic Hero Section */}
          <section className="relative h-[85vh] w-full overflow-hidden">
            {/* Background Image - Replace URL with your actual hero image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAr7xCYRVfsHgn5zxT0VLmTQ_KbciPuUDx5pHILgBOWMUwYRyT75ZjhuIKBWy4PfKirjGw90hnZQJjhY7lB4TRxv31sKou4A6Q7Yl2pHmbn8sIUUv-AMysMH_iLwXixmCpfgQrbt9KeccrTfEdjdFQSYSVDiYSuPESY36BWL_HBmubpLhr8uRKoMVCvvVfECrKdVYTrjkMdjRQOBYOFGZ8Bu0DREH0mqQmrRAASd35g80M64P_hRwjJKrH45d7LS2Ycrem5V8SYSLM')" }}
            >
            </div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#181611]/30 via-[#181611]/10 to-[#181611]"></div>
            
            {/* Floating Glass Card */}
            <div className="absolute bottom-16 left-6 right-6 md:left-20 md:w-[600px] z-10">
              <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-[#221e10]/60 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
                {/* Decorative Embossed Logo Watermark */}
                <div className="absolute -right-10 -top-10 text-primary/5 rotate-12 select-none pointer-events-none">
                  <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 48 48">
                    <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fillRule="evenodd"></path>
                  </svg>
                </div>
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="h-px w-20 bg-primary"></div>
                  <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[0.9]">
                    Our <br/><span className="text-primary italic font-medium">Story</span>
                  </h1>
                  <p className="font-display text-lg text-white/80 leading-relaxed font-light">
                    Where culinary artistry meets timeless tradition. Experience the golden standard of modern dining.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Asymmetrical Heritage Section */}
          <section className="relative bg-background-dark py-24 px-6 md:px-20 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-surface-dark to-transparent opacity-50 pointer-events-none"></div>
            <div className="absolute top-1/2 left-10 w-px h-64 bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
            
            <div className="max-w-[1280px] mx-auto">
              <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                {/* Text Block (Left) */}
                <div className="flex-1 space-y-8 relative">
                  <div className="flex items-center gap-4 text-primary/60 mb-2">
                    <span className="material-symbols-outlined text-sm">history_edu</span>
                    <span className="uppercase tracking-[0.2em] text-xs">Since 1998</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl text-white font-display font-medium leading-tight">
                    A Heritage of <span className="text-primary italic">Excellence</span>
                  </h2>
                  <div className="space-y-6 text-neutral-300 font-light text-lg leading-loose">
                    <p>
                      Founded on the principles of exquisite taste and refined presentation, CHOX KITCHEN brings a touch of gold to every meal. Our journey began not in a bustling kitchen, but in a small family garden where the connection between earth and plate was first understood.
                    </p>
                    <p>
                      Decades later, that respect for ingredients remains our guiding star. We blend classical French techniques with bold, modern innovation to create dishes that are not merely eaten, but experienced.
                    </p>
                  </div>
                  <div className="pt-4">
                    <img alt="Signature" className="h-12 opacity-60 invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ42GsFz9kwU4WxjSh_oY6_aeBA9higPKT449_rmRqk-0_Ul8WUhLpZDajwXZhs63_PFhHSY5K246wQv32w3crXf1cAJ2icU0AdtC-oz8pYXcyaHoBBNhCcG7HnBYgj-1r9RXUzwO_kmLxLSUj47Nil--JPlGDDyXQTXa8Kuq7UEW7XpZNWLfhvv6R4MxfBZ-99t4rrnc18uxin6ALixkfFbsQrK-f0kR0LQIaTnXBDbVXr343Vj_b8N1aqi3U5gNAyygra0mOfJU"/>
                  </div>
                </div>
                
                {/* Image Block (Right - Asymmetrical/Offset) */}
                <div className="flex-1 w-full relative lg:translate-y-12">
                  <div className="absolute -inset-4 border border-primary/20 translate-x-4 translate-y-4 z-0 rounded-lg"></div>
                  <div className="relative z-10 aspect-[3/4] overflow-hidden rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                    <img alt="Chefs working" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkczzdEyy9Iw9cYZSGafKfkfxGeTW8iPeb8EX-F1qOdZd-V_2ps7zB0ANTysyA8K46lz8Z-qDwyOaH7Nl6ttIXoOXI9Wmgjsdb43p60D20JbkH-CFUKJtQhwTfy1fFy3cqeyQPxlEKu57UyUgu8C1H-W5FThhsXXmp7gA96r6Fbq9CqqlcPfTZBmag1_S-0V4P38eurOwl0uLPCJkSLnaRaSlVEMVKc_9rgnvRmuc38kX7spb5ysCEw0wvnOE8ihPdEsgRn1Z8XFY"/>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Multi-layered Philosophy Section */}
          <section className="relative bg-surface-dark py-32 px-6 md:px-20 border-y border-primary/10">
            {/* Golden filigree divider center top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-dark p-4 rounded-full border border-primary/20">
              <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
            </div>
            
            <div className="max-w-[1280px] mx-auto">
              <div className="text-center mb-20 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display text-white mb-6">The Philosophy</h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
                <p className="text-neutral-400 font-light italic">"We don't just cook; we curate moments of golden delight."</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Vertical dividers for desktop */}
                <div className="hidden md:block absolute top-10 bottom-10 left-1/3 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                <div className="hidden md:block absolute top-10 bottom-10 right-1/3 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                
                {/* Column 1 */}
                <div className="flex flex-col items-center text-center p-6 group hover:-translate-y-2 transition-transform duration-500">
                  <div className="mb-6 h-16 w-16 rounded-full bg-[#181611] border border-primary/30 flex items-center justify-center shadow-glow">
                    <span className="material-symbols-outlined text-primary text-2xl">diamond</span>
                  </div>
                  <h3 className="text-xl text-primary font-medium mb-4 uppercase tracking-widest">Vision</h3>
                  <p className="text-neutral-400 font-light leading-relaxed">
                    To redefine luxury dining through innovative culinary techniques that surprise the palate and visually stun the guest.
                  </p>
                </div>
                
                {/* Column 2 */}
                <div className="flex flex-col items-center text-center p-6 group hover:-translate-y-2 transition-transform duration-500 delay-100">
                  <div className="mb-6 h-16 w-16 rounded-full bg-[#181611] border border-primary/30 flex items-center justify-center shadow-glow">
                    <span className="material-symbols-outlined text-primary text-2xl">handyman</span>
                  </div>
                  <h3 className="text-xl text-primary font-medium mb-4 uppercase tracking-widest">Craftsmanship</h3>
                  <p className="text-neutral-400 font-light leading-relaxed">
                    Meticulous attention to detail in every plate we serve. From the precise cut of sashimi to the delicate garnish placement.
                  </p>
                </div>
                
                {/* Column 3 */}
                <div className="flex flex-col items-center text-center p-6 group hover:-translate-y-2 transition-transform duration-500 delay-200">
                  <div className="mb-6 h-16 w-16 rounded-full bg-[#181611] border border-primary/30 flex items-center justify-center shadow-glow">
                    <span className="material-symbols-outlined text-primary text-2xl">eco</span>
                  </div>
                  <h3 className="text-xl text-primary font-medium mb-4 uppercase tracking-widest">Sourcing</h3>
                  <p className="text-neutral-400 font-light leading-relaxed">
                    We partner with local artisans and global suppliers to ensure only the finest, sustainable ingredients enter our kitchen.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="bg-background-dark py-24 px-6 md:px-20">
            <div className="max-w-[1280px] mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-display text-white mb-2">Culinary <span className="text-primary">Artists</span></h2>
                  <p className="text-neutral-500 text-sm uppercase tracking-widest">The minds behind the menu</p>
                </div>
                <a className="group flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider hover:text-white transition-colors" href="#">
                  Join the team 
                  <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                </a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Team Card 1 */}
                <div className="group relative">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface-dark mb-4 relative">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-color"></div>
                    <img alt="Executive Chef" className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSHw05fZ5OoxSnx5VdI6sesS9MWGw4enk2GHqgRgsmhhIjq0KeRjgY6nsnHCgOCeguqeQmnzqZ4uNpm4AiP8N6E7SgElQGnOQ8D_YPur6M6rkr9aMukQXIFUtENpGFmVJPFyP0BFzlxNWP0akMZugEX0mwZ-x7mtO8oRSIR7WE4czG4m-aXJJuNoHkV3BSXOmMLXbc6BUbzh6rUgx3w6qHl2QaAaG6DbX3UL9xmbQJpDBSdnuHNdDs8Ue63AncCI9FWSHrQ95ObY4"/>
                  </div>
                  <h3 className="text-xl text-white font-display group-hover:text-primary transition-colors">Alexander Chox</h3>
                  <p className="text-sm text-primary/80 italic font-light">Executive Chef & Founder</p>
                </div>
                
                {/* Team Card 2 */}
                <div className="group relative lg:translate-y-8">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface-dark mb-4 relative">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-color"></div>
                    <img alt="Sous Chef" className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOHaYPQFMdkkY4NYTr8kSfj1YuJcGhruxGYR7d2cRnrmxW5q53X5Nt92Hy1hCkR2LoLbtxkjST5MY34vvSyUVC97Bm3Vgm9efi_B0xnDKB_RnU9cApKHW7skbcZ4uNpwf0m9Bil7m8wVhYHvBbOJ96acxK0doC_qHfKm-33iTgfX3zBJlm1IgE--kbckpNlUpy5DBG5DLlnuzTuVPVeSIJP7WI9IVCy6Qj4AQn9y5uJ66t6C0HTUxaYFo5kq2g3F5ZE7uFuG7PQKo"/>
                  </div>
                  <h3 className="text-xl text-white font-display group-hover:text-primary transition-colors">Elena Rossi</h3>
                  <p className="text-sm text-primary/80 italic font-light">Head of Pastry</p>
                </div>
                
                {/* Team Card 3 */}
                <div className="group relative">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface-dark mb-4 relative">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-color"></div>
                    <img alt="Sommelier" className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB69o3U4LUrlto2Srp0T4h1DJPaViITX9sKdpGKosFpDwv7EbuiI3TtdB8tWfvJMD1v-6IBmyrh3ZqSTRWIrm2gdPGb0PtbbLUSkjUlKnuHWNfsSUKtz0Y8n_HD7k1uvE5E2OqoRY6KPR2zhE1nqKQ_M9whzDdP8xDxn2-B4_cwF5whChtrsOILWO3GNTKNpsF5Xx7tRCoJWHN4pFcb5VDu1HvmR7ZB8HNEMARsBKt5nbxRVX08UWzdYR_-MHCfri7W2EwoQYha8s0"/>
                  </div>
                  <h3 className="text-xl text-white font-display group-hover:text-primary transition-colors">Marcus Thorne</h3>
                  <p className="text-sm text-primary/80 italic font-light">Lead Sommelier</p>
                </div>
                
                {/* Team Card 4 */}
                <div className="group relative lg:translate-y-8">
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface-dark mb-4 relative">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-color"></div>
                    <img alt="Manager" className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2Ym9NbnfyRZaDhJ_bcA7EoMXXfb3ttxOxiyk59cJzLVTFcn-xQOAo7QGPGV3R6T2Mf6LjH1VFZfwchdl2_XahG_DcS5VdUGNzuJt7_E26i-N-DIxM4SaNwpItd3quTo0MzogwUinJkndruPHOjtCCOz2CG6EHG-JUgj997I_CtdR-JIHCvyZjm57HMSTkSZKJE5hZ8PFPt4omce11sTijVAlr4vv_uMorCSpCCOMpMlPE9rXp7ekjabpoxGtImoY0ojWOXYX7A0E"/>
                  </div>
                  <h3 className="text-xl text-white font-display group-hover:text-primary transition-colors">Sarah Jenkins</h3>
                  <p className="text-sm text-primary/80 italic font-light">General Manager</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-[#393528]/50 bg-[#12110e] py-12 px-6">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="size-6 text-primary">
                <svg className="h-full w-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-white font-bold tracking-widest text-sm">CHOX KITCHEN</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link to="#" className="text-neutral-500 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="#" className="text-neutral-500 hover:text-primary transition-colors">Terms of Service</Link>
            </div>
            <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 text-primary hover:bg-primary hover:text-background-dark transition-all">
                <span className="sr-only">Facebook</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 text-primary hover:bg-primary hover:text-background-dark transition-all">
                <span className="sr-only">Instagram</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-neutral-600">
            © 2024 CHOX KITCHEN. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;