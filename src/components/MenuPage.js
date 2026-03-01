import React, { useState, useEffect } from 'react';
import Header from './Header';
import OrderSummary from './OrderSummary';

import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [sortOption, setSortOption] = useState("Recommended");

  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  const categories = ["All Items", "Appetizers", "Main Courses", "Dessert", "Beverages"];

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().name, // Map 'name' to 'title'
        price: doc.data().price,
        description: doc.data().description,
        category: doc.data().category,
        image: doc.data().image,
        popular: doc.data().popular,
        // Default values for missing fields
        time: "15-20 mins",
        tag: doc.data().popular ? { icon: "star", title: "Popular" } : null
      }));
      setMenuItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching menu items:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // eslint-disable-next-line no-unused-vars
  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getFilteredItems = () => {
    let filtered = selectedCategory === "All Items"
      ? menuItems
      : menuItems.filter(item => {
        // Normalize categories for comparison
        const normalize = (str) => str.toLowerCase().replace(/s$/, ''); // Remove trailing 's'
        const itemCat = normalize(item.category);
        const selectedCat = normalize(selectedCategory);
        // Special handling for mappings if needed
        if (selectedCat === 'dessert' && itemCat === 'dessert') return true;
        if (selectedCat === 'main course' && itemCat === 'main') return true;
        return itemCat === selectedCat || item.category === selectedCategory;
      });

    // Mapping fallback for simple matches
    if (selectedCategory !== "All Items") {
      const catMap = {
        "Appetizers": "appetizers",
        "Main Courses": "mains",
        "Dessert": "desserts",
        "Beverages": "beverages"
      };
      const target = catMap[selectedCategory];
      if (target) {
        filtered = menuItems.filter(item => item.category === target);
      }
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOption === "Price: Low to High") return a.price - b.price;
    if (sortOption === "Price: High to Low") return b.price - a.price;
    return 0;
  });

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background-dark text-white font-display overflow-x-hidden antialiased selection:bg-primary selection:text-black pt-20">

      {/* Background Glow Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* --- Styles for Hide Scrollbar & Sticky positioning --- */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Header />

      {/* --- MOBILE CATEGORY BAR (STICKY & SCROLLABLE) --- */}
      {/* This replaces the sidebar on mobile. It sticks right below the header. */}
      <div className="lg:hidden sticky top-20 z-40 bg-[#12110e]/95 backdrop-blur-xl border-b border-[#393528]/30 w-full">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-4 py-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300
                ${selectedCategory === category
                  ? "bg-primary text-black border-primary shadow-glow scale-105"
                  : "bg-transparent text-[#bab29c] border-[#393528] hover:border-primary hover:text-primary"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      {/* ------------------------------------------------ */}

      {/* Main Layout */}
      <div className="relative z-10 flex flex-1 w-full max-w-[1920px] mx-auto">

        {/* Sidebar (Desktop Only - Hidden on Mobile) */}
        <aside className="hidden lg:flex flex-col w-64 fixed h-[calc(100vh-80px)] top-20 left-0 border-r border-[#393528]/30 bg-[#12110e]/50 backdrop-blur-sm overflow-y-auto z-40 py-10 pl-6">
          <nav className="flex flex-col gap-2 w-full pr-4">
            <h3 className="text-[#bab29c]/40 text-xs font-bold uppercase tracking-[0.2em] mb-4 pl-6">Menu Categories</h3>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative flex items-center gap-4 px-6 py-4 rounded-r-full text-left transition-all group w-full ${selectedCategory === category
                  ? "text-primary bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary"
                  : "text-[#bab29c] hover:text-white hover:bg-white/5"
                  }`}
              >
                <span className={`text-sm tracking-wide ${selectedCategory === category ? 'font-bold' : 'font-medium'}`}>
                  {category}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pr-6 pb-6">
            <div className="p-6 rounded-2xl bg-card-dark border border-[#393528]/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h4 className="text-primary font-serif italic text-lg mb-2 relative z-10">Chef's Table</h4>
              <p className="text-[#bab29c] text-xs leading-relaxed mb-4 relative z-10">Experience our exclusive 7-course tasting menu.</p>
              <button className="text-white text-xs font-bold uppercase tracking-widest border-b border-primary pb-1 hover:text-primary transition-colors relative z-10">Reserve Now</button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 w-full lg:pl-72 lg:pr-10 px-4 py-8 lg:py-12">

          {/* Header Section (Adjusted for Mobile) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 lg:mb-12 animate-fade-in">
            <div className="hidden lg:block">
              <span className="text-primary font-serif italic text-xl mb-1 block">Selected Category</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-display tracking-tight leading-tight">
                {selectedCategory}
              </h2>
            </div>
            {/* Mobile Title (Smaller) */}
            <div className="lg:hidden text-center w-full">
              <h2 className="text-2xl font-bold text-white font-display tracking-wide uppercase">{selectedCategory}</h2>
              <div className="h-0.5 w-10 bg-primary mx-auto mt-2 rounded-full"></div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center justify-between lg:justify-end gap-4 text-[#bab29c] text-xs lg:text-sm border-b border-[#393528] pb-2 w-full lg:w-auto mt-4 lg:mt-0">
              <span>Sort by:</span>
              <select
                className="bg-transparent border-none text-white focus:ring-0 cursor-pointer text-xs lg:text-sm font-medium py-0 pl-1 pr-6 outline-none"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option className="bg-card-dark text-black">Recommended</option>
                <option className="bg-card-dark text-black">Price: Low to High</option>
                <option className="bg-card-dark text-black">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 pb-24">
            {sortedItems.map(item => (
              <MenuCard
                key={item.id}
                item={item}
                onAdd={() => addToCart(item)}
              />
            ))}
          </div>

          {/* Empty State */}
          {sortedItems.length === 0 && (
            <div className="w-full text-center py-20">
              <span className="material-symbols-outlined text-6xl text-[#bab29c]/20 mb-4">no_food</span>
              <p className="text-[#bab29c] text-lg">No items found in this category.</p>
            </div>
          )}

          <div className="w-full text-center mt-6 px-6 pb-20 lg:pb-0">
            <p className="font-serif italic text-lg lg:text-2xl text-[#bab29c]/40">"Dining is not just eating, it is an art of the senses."</p>
            <div className="w-20 h-[1px] bg-primary/30 mx-auto mt-6"></div>
          </div>
        </main>
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <button
            onClick={() => setShowCheckout(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-[#ffd700] to-[#e9b10c] text-black px-5 py-3 lg:px-6 lg:py-4 rounded-full shadow-lg hover:scale-105 transition-transform font-bold"
          >
            <span className="material-symbols-outlined text-xl lg:text-2xl">shopping_bag</span>
            <span className="text-sm lg:text-base">View Order (₱{getTotalPrice().toFixed(2)})</span>
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <OrderSummary
          cart={cart}
          totalPrice={getTotalPrice()}
          onClose={() => setShowCheckout(false)}
          onComplete={() => {
            setCart([]);
            setShowCheckout(false);
          }}
          updateCart={setCart}
        />
      )}
    </div>
  );
};

// Helper Component for Menu Cards
const MenuCard = ({ item, onAdd }) => (
  <div className="bg-card-dark rounded-xl overflow-hidden shadow-lg border border-[#393528]/50 group hover:border-primary/50 transition-all duration-300 flex flex-col h-full relative animate-fade-in-up">
    <div className="relative h-56 lg:h-64 overflow-hidden">
      <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/0 transition-colors duration-500"></div>
      <div
        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url('${item.image}')`, ...item.imageStyle }}
      ></div>
      <div className="absolute bottom-4 left-4 z-20">
        <span className="bg-black/70 backdrop-blur-md text-white px-3 py-1 lg:px-4 lg:py-1.5 rounded-full border border-primary/30 font-display font-bold text-sm lg:text-lg">
          ₱{item.price.toFixed(2)}
        </span>
      </div>
      {item.tag && (
        <div className="absolute top-4 right-4 z-20">
          <div className="size-8 rounded-full bg-[#1a1814] border border-primary text-primary flex items-center justify-center shadow-inner-gold" title={item.tag.title}>
            <span className="material-symbols-outlined text-[18px]">{item.tag.icon}</span>
          </div>
        </div>
      )}
    </div>
    <div className="p-5 lg:p-6 flex flex-col flex-1 relative">
      <div className="flex justify-between items-start mb-2 lg:mb-3">
        <h3 className="text-xl lg:text-2xl font-display font-medium text-white group-hover:text-primary transition-colors">{item.title}</h3>
      </div>
      <p className="text-[#bab29c] text-xs lg:text-sm leading-relaxed mb-4 lg:mb-6 font-light line-clamp-3">
        {item.description}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-[#393528]/30 pt-4">
        <span className="text-[10px] lg:text-xs text-[#bab29c]/60 font-medium uppercase tracking-widest">{item.time}</span>

        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-full bg-primary text-black text-xs lg:text-sm font-bold flex items-center gap-2 shadow-glow hover:bg-white transition-all duration-300 transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px] lg:text-[18px]">add_shopping_cart</span>
          Add
        </button>
      </div>
    </div>
  </div>
);

export default MenuPage;