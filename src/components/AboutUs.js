import React from 'react';
import Header from './Header'; 
import Footer from './Footer'; // Import the new Footer component

const AboutPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-x-hidden antialiased selection:bg-primary/30 min-h-screen pt-20">
      <div className="relative flex min-h-screen w-full flex-col group/design-root">
        
        <Header />

        <main className="flex-grow"> 
          {/* Artistic Hero Section */}
          <section className="relative h-[85vh] w-full overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAr7xCYRVfsHgn5zxT0VLmTQ_KbciPuUDx5pHILgBOWMUwYRyT75ZjhuIKBWy4PfKirjGw90hnZQJjhY7lB4TRxv31sKou4A6Q7Yl2pHmbn8sIUUv-AMysMH_iLwXixmCpfgQrbt9KeccrTfEdjdFQSYSVDiYSuPESY36BWL_HBmubpLhr8uRKoMVCvvVfECrKdVYTrjkMdjRQOBYOFGZ8Bu0DREH0mqQmrRAASd35g80M64P_hRwjJKrH45d7LS2Ycrem5V8SYSLM')" }}
            >
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-[#181611]/30 via-[#181611]/10 to-[#181611]"></div>
            
            <div className="absolute bottom-16 left-6 right-6 md:left-20 md:w-[600px] z-10">
              <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-[#221e10]/60 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
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
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-surface-dark to-transparent opacity-50 pointer-events-none"></div>
            <div className="absolute top-1/2 left-10 w-px h-64 bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
            
            <div className="max-w-[1280px] mx-auto">
              <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-dark p-4 rounded-full border border-primary/20">
              <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
            </div>
            
            <div className="max-w-[1280px] mx-auto">
              <div className="text-center mb-20 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display text-black mb-6">The Philosophy</h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
                <p className="text-gray-800 font-light italic">"We don't just cook; we curate moments of golden delight."</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-10 bottom-10 left-1/3 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                <div className="hidden md:block absolute top-10 bottom-10 right-1/3 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
                
                {/* Column 1 */}
                <div className="flex flex-col items-center text-center p-6 group hover:-translate-y-2 transition-transform duration-500">
                  <div className="mb-6 h-16 w-16 rounded-full bg-[#181611] border border-primary/30 flex items-center justify-center shadow-glow">
                    <span className="material-symbols-outlined text-primary text-2xl">diamond</span>
                  </div>
                  <h3 className="text-xl text-primary font-medium mb-4 uppercase tracking-widest">Vision</h3>
                  <p className="text-gray-800 font-light leading-relaxed">
                    To redefine luxury dining through innovative culinary techniques that surprise the palate and visually stun the guest.
                  </p>
                </div>
                
                {/* Column 2 */}
                <div className="flex flex-col items-center text-center p-6 group hover:-translate-y-2 transition-transform duration-500 delay-100">
                  <div className="mb-6 h-16 w-16 rounded-full bg-[#181611] border border-primary/30 flex items-center justify-center shadow-glow">
                    <span className="material-symbols-outlined text-primary text-2xl">handyman</span>
                  </div>
                  <h3 className="text-xl text-primary font-medium mb-4 uppercase tracking-widest">Craftsmanship</h3>
                  <p className="text-gray-800 font-light leading-relaxed">
                    Meticulous attention to detail in every plate we serve. From the precise cut of sashimi to the delicate garnish placement.
                  </p>
                </div>
                
                {/* Column 3 */}
                <div className="flex flex-col items-center text-center p-6 group hover:-translate-y-2 transition-transform duration-500 delay-200">
                  <div className="mb-6 h-16 w-16 rounded-full bg-[#181611] border border-primary/30 flex items-center justify-center shadow-glow">
                    <span className="material-symbols-outlined text-primary text-2xl">eco</span>
                  </div>
                  <h3 className="text-xl text-primary font-medium mb-4 uppercase tracking-widest">Sourcing</h3>
                  <p className="text-gray-800 font-light leading-relaxed">
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
        
        {/* Replaced hardcoded footer with the new Component */}
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;