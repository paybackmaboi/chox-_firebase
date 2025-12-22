import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [sortOption, setSortOption] = useState("Recommended");

  // Define your categories here
  const categories = ["All Items", "Appetizers", "Main Courses", "Dessert", "Beverages"];

  // MENU DATA
  const menuItems = [
    {
      id: 1,
      title: "Gold Leaf Steak",
      price: 145.00,
      description: "Premium A5 Wagyu beef perfectly seared and wrapped in edible 24k gold leaf. Served with truffle mashed potatoes.",
      time: "30 mins",
      category: "Main Courses",
      image: "/images/1.jpg", 
      tag: { icon: "local_fire_department", title: "Chef's Special" }
    },
    {
      id: 2,
      title: "Saffron Risotto",
      price: 34.00,
      description: "Creamy arborio rice infused with premium saffron threads, finished with parmigiano reggiano and a touch of gold dust.",
      time: "20 mins",
      category: "Main Courses",
      image: "/images/2.jpg",
      tag: { icon: "eco", title: "Vegetarian" }
    },
    {
      id: 3,
      title: "Truffle Pasta",
      price: 42.00,
      description: "Handmade tagliatelle pasta tossed in a rich butter sauce, topped generously with shaved black winter truffles.",
      time: "25 mins",
      category: "Main Courses",
      image: "/images/3.jpg",
      tag: { icon: "restaurant_menu", title: "Chef's Choice" }
    },
    {
      id: 4,
      title: "Royal Ribeye",
      price: 58.00,
      description: "Dry-aged for 45 days, this bone-in ribeye is grilled to perfection and served with a side of roasted garlic butter.",
      time: "40 mins",
      category: "Main Courses",
      image: "/images/4.jpg",
      tag: { icon: "thumb_up", title: "Top Rated" }
    },
    {
      id: 5,
      title: "Imperial Lamb",
      price: 85.00,
      description: "Succulent rack of lamb with a pistachio crust, served with mint reduction and roasted root vegetables.",
      time: "35 mins",
      category: "Main Courses",
      image: "/images/5.jpg",
      imageStyle: { filter: 'hue-rotate(15deg)' }
    },
    {
      id: 6,
      title: "Golden Beet Salad",
      price: 28.00,
      description: "Roasted golden beets, goat cheese mousse, candied walnuts, and citrus vinaigrette.",
      time: "15 mins",
      category: "Appetizers", 
      image: "/images/6.jpg",
      imageStyle: { filter: 'hue-rotate(-20deg)' }
    },
    {
      id: 7,
      title: "24K Chocolate Dome",
      price: 45.00,
      description: "Dark chocolate sphere melting under hot caramel sauce to reveal a gold-dusted hazelnut mousse.",
      time: "15 mins",
      category: "Dessert",
      image: "/images/1.jpg", 
      tag: { icon: "cake", title: "Sweet Tooth" }
    },
    {
      id: 8,
      title: "Sparkling Gold Elixir",
      price: 18.00,
      description: "A refreshing blend of elderflower, prosecco, and edible gold flakes.",
      time: "5 mins",
      category: "Beverages",
      image: "/images/2.jpg"
    }
  ];

  // Filter Logic
  const filteredItems = selectedCategory === "All Items"
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  // Sort Logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOption === "Price: Low to High") return a.price - b.price;
    if (sortOption === "Price: High to Low") return b.price - a.price;
    return 0;
  });

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background-dark text-white font-display overflow-x-hidden antialiased selection:bg-primary selection:text-black">
      
      {/* Background Glow Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Header with Navigation */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#12110e]/90 border-b border-[#393528]/30">
        <div className="w-full mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer pl-4 lg:pl-0">
            <div className="size-10 rounded-full border border-primary/30 flex items-center justify-center shadow-glow bg-[#1a1814]">
              <span className="material-symbols-outlined text-primary text-2xl">restaurant</span>
            </div>
            <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#fff5d6] via-[#e9b10c] to-[#b8860b] font-display uppercase drop-shadow-md">
              Chox Kitchen
            </h1>
          </Link>

          {/* Center Navigation Links (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-[#bab29c] hover:text-primary transition-colors tracking-wide">Home</Link>
            <Link to="/about" className="text-sm font-medium text-[#bab29c] hover:text-primary transition-colors tracking-wide">About Us</Link>
            {/* Note: Services/Contact often link to sections on Home, using /#id works if set up */}
            <Link to="/" className="text-sm font-medium text-[#bab29c] hover:text-primary transition-colors tracking-wide">Services</Link>
            <Link to="/" className="text-sm font-medium text-[#bab29c] hover:text-primary transition-colors tracking-wide">Contact</Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-6">
            <button className="relative group p-2 rounded-full hover:bg-white/5 transition-colors hidden sm:block">
              <span className="material-symbols-outlined text-[#bab29c] group-hover:text-primary transition-colors text-2xl">search</span>
            </button>
            <button className="relative group p-2 rounded-full hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-[#bab29c] group-hover:text-primary transition-colors text-2xl">shopping_cart</span>
              <div className="absolute top-1 right-0 size-4 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-glow">3</div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-1 w-full max-w-[1920px] mx-auto">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 fixed h-[calc(100vh-80px)] top-20 left-0 border-r border-[#393528]/30 bg-[#12110e]/50 backdrop-blur-sm overflow-y-auto z-40 py-10 pl-6">
          <nav className="flex flex-col gap-2 w-full pr-4">
            <h3 className="text-[#bab29c]/40 text-xs font-bold uppercase tracking-[0.2em] mb-4 pl-6">Menu Categories</h3>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative flex items-center gap-4 px-6 py-4 rounded-r-full text-left transition-all group w-full ${
                  selectedCategory === category
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

        {/* Mobile Filter Bar */}
        <div className="lg:hidden w-full sticky top-20 z-40 bg-[#12110e]/95 backdrop-blur-xl border-b border-[#393528]/30 overflow-x-auto">
          <nav className="flex items-center p-4 gap-2 min-w-max">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "font-bold text-black bg-primary shadow-glow"
                    : "font-medium text-[#bab29c] bg-white/5 border border-transparent hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        {/* Product Grid */}
        <main className="flex-1 w-full lg:pl-72 lg:pr-10 px-4 py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
            <div>
              <span className="text-primary font-serif italic text-xl mb-1 block">Selected Category</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-display tracking-tight leading-tight">
                {selectedCategory}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[#bab29c] text-sm border-b border-[#393528] pb-2">
              <span>Sort by:</span>
              <select 
                className="bg-transparent border-none text-white focus:ring-0 cursor-pointer text-sm font-medium py-0 pl-1 pr-6 outline-none"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option className="bg-card-dark">Recommended</option>
                <option className="bg-card-dark">Price: Low to High</option>
                <option className="bg-card-dark">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 pb-20">
            {sortedItems.map(item => (
              <MenuCard 
                key={item.id}
                title={item.title}
                price={`$${item.price.toFixed(2)}`}
                desc={item.description}
                time={item.time}
                image={item.image}
                imageStyle={item.imageStyle}
                tagIcon={item.tag?.icon}
                tagTitle={item.tag?.title}
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

          <div className="w-full text-center mt-10 px-6 pb-20">
            <p className="font-serif italic text-2xl text-[#bab29c]/40">"Dining is not just eating, it is an art of the senses."</p>
            <div className="w-20 h-[1px] bg-primary/30 mx-auto mt-6"></div>
          </div>
        </main>
      </div>

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="flex items-center gap-3 bg-gold-gradient text-black px-6 py-4 rounded-full shadow-glow-hover hover:scale-105 transition-transform font-bold">
          <span className="material-symbols-outlined">shopping_bag</span>
          <span className="hidden sm:inline">View Order ($145.00)</span>
        </button>
      </div>
    </div>
  );
};

// Helper Component for Menu Cards
const MenuCard = ({ title, price, desc, time, image, imageStyle, tagIcon, tagTitle }) => (
  <div className="bg-card-dark rounded-xl overflow-hidden shadow-lg border border-[#393528]/50 group hover:border-primary/50 transition-all duration-300 flex flex-col h-full relative animate-fade-in-up">
    <div className="relative h-64 overflow-hidden">
      <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/0 transition-colors duration-500"></div>
      <div 
        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
        style={{ backgroundImage: `url('${image}')`, ...imageStyle }}
      ></div>
      <div className="absolute bottom-4 left-4 z-20">
        <span className="bg-black/70 backdrop-blur-md text-white px-4 py-1.5 rounded-full border border-primary/30 font-display font-bold text-lg">
          {price}
        </span>
      </div>
      {tagIcon && (
        <div className="absolute top-4 right-4 z-20">
          <div className="size-8 rounded-full bg-[#1a1814] border border-primary text-primary flex items-center justify-center shadow-inner-gold" title={tagTitle}>
            <span className="material-symbols-outlined text-[18px]">{tagIcon}</span>
          </div>
        </div>
      )}
    </div>
    <div className="p-6 flex flex-col flex-1 relative">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-2xl font-display font-medium text-white group-hover:text-primary transition-colors">{title}</h3>
      </div>
      <p className="text-[#bab29c] text-sm leading-relaxed mb-6 font-light">
        {desc}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-[#393528]/30 pt-4">
        <span className="text-xs text-[#bab29c]/60 font-medium uppercase tracking-widest">{time}</span>
        <button className="size-10 rounded-full bg-primary text-black flex items-center justify-center shadow-glow hover:bg-white hover:scale-110 transition-all duration-300 group-hover:translate-x-0 translate-x-0">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
  </div>
);

export default MenuPage;