import React from 'react';
import Hero from './Hero';
import Services from './Services';
import Mission from './Mission';
import Team from './Team';

const LandingPage = () => {
  return (
    <main>
      <Hero />
      <Services />
      <Mission />
      <Team />
      
      {/* CTA / Contact Section */}
      <section className="px-4 md:px-10 py-20 relative overflow-hidden" id="contact">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto w-full bg-primary rounded-3xl p-8 md:p-16 text-center relative z-10 shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to Innovate Together?</h2>
          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Whether you need a custom software solution or an accessibility audit, our team is ready to help you build a more inclusive future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
              Start a Project
            </button>
            <button className="bg-primary border-2 border-white text-white hover:bg-primary/80 px-8 py-4 rounded-xl font-bold text-lg transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;