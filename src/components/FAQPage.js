import React, { useState } from 'react';
import Header from './Header'; 
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqCategories = [
    {
      title: "Ordering & Payment",
      icon: "receipt_long",
      questions: [
        {
          question: "How do I place an order?",
          answer: "Ordering is simple! 1. Browse our Menu. 2. Click 'Add to Cart' on your desired items. 3. Go to 'View Order', fill in your delivery details, and upload your payment receipt. 4. Submit and track your food live!"
        },
        {
          question: "What payment methods do you accept?",
          answer: "We currently accept GCash and Bank Transfers. You will need to upload a screenshot of your payment receipt during checkout (50% downpayment required for confirmation)."
        },
        {
          question: "Can I cancel my order?",
          answer: "You can cancel your order only if the status is still 'Pending'. Once the kitchen starts 'Preparing' your food, cancellations are no longer accepted."
        }
      ]
    },
    {
      title: "Delivery & Tracking",
      icon: "local_shipping",
      questions: [
        {
          question: "Where do you deliver?",
          answer: "We currently deliver to selected areas within Cebu City and Mandaue. Delivery fees may vary based on distance."
        },
        {
          question: "How long does delivery take?",
          answer: "Our standard preparation and delivery time is 30-45 minutes depending on your location and order size. You can track your order status in real-time using the tracking link provided."
        }
      ]
    }
  ];

  return (
    // Base Background: Deep Luxury Dark (almost black but warmer)
    <div className="bg-[#12110e] font-display text-[#F5F5F5] antialiased overflow-x-hidden min-h-screen pt-20 selection:bg-[#e9b10c] selection:text-black">
      <div className="relative flex min-h-screen w-full flex-col group/design-root">
        
        {/* --- UNIFORM HEADER --- */}
        <Header />
        {/* ---------------------- */}

        {/* HERO SECTION */}
        <div className="relative w-full border-b border-[#393528]/50">
          {/* Background Image with Professional Overlay */}
          <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: 'url("/images/open.jpg")' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#12110e]/95 via-[#12110e]/90 to-[#12110e]"></div>
          </div>
          
          <div className="relative z-10 layout-container flex flex-col items-center justify-center px-4 py-20 lg:py-28 text-center">
            <div className="flex flex-col gap-4 max-w-[800px] animate-fade-in-up">
              <span className="text-[#e9b10c] text-sm font-bold tracking-[0.2em] uppercase mb-2">Support Center</span>
              <h1 className="text-white text-4xl md:text-6xl font-light tracking-tight drop-shadow-lg">
                Frequently Asked <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#e9b10c] to-[#fceeb5]">Questions</span>
              </h1>
              <p className="text-[#bab29c] text-lg font-light leading-relaxed max-w-2xl mx-auto mt-4">
                Everything you need to know about our services, delivery, and culinary experience.
              </p>
            </div>
            
            {/* Professional Search Bar */}
            <div className="mt-12 w-full max-w-[600px] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#e9b10c]/20 to-[#e9b10c]/0 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex w-full items-center bg-[#1a1814] rounded-xl border border-[#393528] overflow-hidden transition-all focus-within:border-[#e9b10c]/50 focus-within:shadow-[0_0_20px_rgba(233,177,12,0.1)]">
                  <div className="pointer-events-none pl-6 text-[#bab29c] group-focus-within:text-[#e9b10c] transition-colors">
                    <span className="material-symbols-outlined text-2xl">search</span>
                  </div>
                  <input 
                    className="block w-full bg-transparent py-5 pl-4 pr-32 text-white placeholder:text-[#5a5446] focus:outline-none font-light text-lg" 
                    placeholder="How can we help you?" 
                    type="text" 
                  />
                  <div className="absolute right-2">
                    <button className="rounded-lg bg-[#e9b10c] px-6 py-2.5 text-sm font-bold text-[#12110e] hover:bg-[#ffcd38] transition-all shadow-lg hover:shadow-[#e9b10c]/20">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="layout-container flex flex-col items-center flex-1 px-4 py-16 md:px-10 relative z-10">
          <div className="w-full max-w-[1000px] space-y-16">
            
            {/* Dynamic FAQ Categories */}
            {faqCategories.map((category, catIndex) => (
              <section key={catIndex} className="animate-fade-in-up" style={{ animationDelay: `${0.2 + (catIndex * 0.1)}s` }}>
                
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#1a1814] border border-[#393528] flex items-center justify-center text-[#e9b10c] shadow-glow">
                    <span className="material-symbols-outlined">{category.icon}</span>
                  </div>
                  <h2 className="text-white text-2xl font-display font-medium tracking-wide">{category.title}</h2>
                </div>
                
                {/* Questions Grid */}
                <div className="grid gap-4">
                  {category.questions.map((item, qIndex) => {
                    const uniqueId = `${catIndex}-${qIndex}`;
                    const isOpen = activeIndex === uniqueId;

                    return (
                      <div 
                        key={uniqueId} 
                        className={`group rounded-xl border transition-all duration-300 overflow-hidden
                          ${isOpen 
                            ? 'bg-[#1a1814] border-[#e9b10c]/30 shadow-[0_4px_20px_-10px_rgba(233,177,12,0.15)]' 
                            : 'bg-[#1a1814]/50 border-[#393528] hover:border-[#e9b10c]/20 hover:bg-[#1a1814]'
                          }`}
                      >
                        <button
                          onClick={() => toggleAccordion(uniqueId)}
                          className="flex w-full cursor-pointer items-center justify-between gap-6 p-6 select-none focus:outline-none text-left"
                        >
                          <p className={`text-base md:text-lg font-light transition-colors ${isOpen ? 'text-white' : 'text-[#e2dcc8] group-hover:text-white'}`}>
                            {item.question}
                          </p>
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 
                            ${isOpen ? 'border-[#e9b10c] bg-[#e9b10c] text-black rotate-180' : 'border-[#393528] text-[#5a5446] group-hover:border-[#e9b10c]/50 group-hover:text-[#e9b10c]'}`}>
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                          </div>
                        </button>
                        
                        <div 
                          className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                          <div className="px-6 pb-6 pt-0">
                            <div className="h-px w-full bg-[#393528]/50 mb-4"></div>
                            <p className="text-[#bab29c] text-sm leading-relaxed font-light">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Contact Support CTA (Premium Card) */}
            <div className="relative mt-16 rounded-2xl overflow-hidden border border-[#393528] p-10 text-center shadow-2xl group">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1814] to-[#12110e]"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9b10c]/5 rounded-full blur-[80px] group-hover:bg-[#e9b10c]/10 transition-colors duration-700"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="rounded-full bg-[#e9b10c]/10 p-5 border border-[#e9b10c]/20 shadow-[0_0_30px_rgba(233,177,12,0.1)]">
                  <span className="material-symbols-outlined text-[#e9b10c] text-4xl">support_agent</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-white text-2xl font-display font-medium">Still have questions?</h3>
                  <p className="text-[#8a8476] max-w-md mx-auto font-light">
                    Can't find the answer you're looking for? Our dedicated concierge team is here to assist you.
                  </p>
                </div>

                <Link to="/about" className="inline-flex items-center gap-2 rounded-full bg-[#e9b10c] px-8 py-3 text-[#12110e] text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-[#e9b10c]/30 transform hover:-translate-y-1">
                  <span>Contact Support</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </div>

          </div>
        </main>

        {/* FOOTER */}
        <footer className="w-full border-t border-[#393528] bg-[#0e0d0b] py-16 px-6 mt-10">
          <div className="layout-container mx-auto max-w-[1280px]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full border border-[#e9b10c]/30 flex items-center justify-center bg-[#1a1814]">
                    <span className="material-symbols-outlined text-[#e9b10c] text-lg">restaurant_menu</span>
                  </div>
                  <span className="font-bold text-xl tracking-widest text-[#f5f5f5]">CHOX</span>
                </div>
                <p className="text-[#8a8476] text-sm leading-relaxed font-light">
                  Elevating the dining experience with premium ingredients and golden touches. Delivered fresh to your door.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Company</h4>
                <Link to="/about" className="text-[#bab29c] hover:text-[#e9b10c] text-sm transition-colors w-fit">Our Story</Link>
                <Link to="#" className="text-[#bab29c] hover:text-[#e9b10c] text-sm transition-colors w-fit">Careers</Link>
                <Link to="#" className="text-[#bab29c] hover:text-[#e9b10c] text-sm transition-colors w-fit">Press</Link>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Support</h4>
                <Link to="/faq" className="text-[#bab29c] hover:text-[#e9b10c] text-sm transition-colors w-fit">Help Center</Link>
                <Link to="#" className="text-[#bab29c] hover:text-[#e9b10c] text-sm transition-colors w-fit">Terms of Service</Link>
                <Link to="#" className="text-[#bab29c] hover:text-[#e9b10c] text-sm transition-colors w-fit">Privacy Policy</Link>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Connect</h4>
                <div className="flex gap-4">
                  <a className="w-10 h-10 rounded-full border border-[#393528] flex items-center justify-center text-[#bab29c] hover:border-[#e9b10c] hover:text-[#e9b10c] hover:bg-[#e9b10c]/10 transition-all" href="#">
                    <span className="material-symbols-outlined text-lg">public</span>
                  </a>
                  <a className="w-10 h-10 rounded-full border border-[#393528] flex items-center justify-center text-[#bab29c] hover:border-[#e9b10c] hover:text-[#e9b10c] hover:bg-[#e9b10c]/10 transition-all" href="#">
                    <span className="material-symbols-outlined text-lg">photo_camera</span>
                  </a>
                  <a className="w-10 h-10 rounded-full border border-[#393528] flex items-center justify-center text-[#bab29c] hover:border-[#e9b10c] hover:text-[#e9b10c] hover:bg-[#e9b10c]/10 transition-all" href="#">
                    <span className="material-symbols-outlined text-lg">chat</span>
                  </a>
                </div>
              </div>

            </div>
            
            <div className="mt-16 border-t border-[#393528] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p className="text-[#5a5446] text-xs uppercase tracking-wider">© 2024 Chox Kitchen. All rights reserved.</p>
              <p className="text-[#5a5446] text-xs">Cebu City, Philippines</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default FAQPage;