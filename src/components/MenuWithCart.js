import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Header from './Header';
import Footer from './Footer';
import OrderSummary from './OrderSummary';

const MenuWithCart = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
    { id: 'mains', name: 'Main Courses', icon: '🍖' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' }
  ];

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching menu items:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

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

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCompleteOrder = () => {
    setCart([]);
    setShowCheckout(false);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setCurrentImageIndex(0);
  };

  const getItemImages = (item) => {

    if (item.id === 1) {
      return ['/1.jpg', '/sandwich.jpg', '/sandwich1.jpg', '/sandwich3.jpg'];
    }


    if (item.id === 18) {
      return ['/2.jpg', '/bonelessPorkchop.jpg', '/bonelessPorkchop1.jpg'];
    }

    if (item.id === 11) {
      return ['/3.jpg', '/mangoTapoica.jpg', '/mangoTapoica1.jpg'];
    }
    // For other items, just show the main image
    return [item.image];
  };

  const nextImage = () => {
    const images = selectedItem ? getItemImages(selectedItem) : [];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = selectedItem ? getItemImages(selectedItem) : [];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-[#1a1612]">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden text-[#ffd700] border-b-[3px] border-[#ffd700] shadow-[inset_0_0_100px_rgba(255,215,0,0.1)] bg-[linear-gradient(135deg,#2a2214_0%,#1a1612_50%,#3d2e1a_100%)]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-80 animate-shimmer pointer-events-none" style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1.5" fill="%23ffd700" opacity="0.4"/><circle cx="75" cy="75" r="1.5" fill="%23ffd700" opacity="0.4"/><circle cx="50" cy="10" r="1" fill="%23ffffff" opacity="0.2"/><circle cx="10" cy="60" r="1.5" fill="%23ffd700" opacity="0.4"/><circle cx="90" cy="40" r="1" fill="%23ffffff" opacity="0.2"/><circle cx="35" cy="80" r="1" fill="%23ffffff" opacity="0.15"/><circle cx="65" cy="15" r="1.5" fill="%23ffd700" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>')`
          }}></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="hero-content">
              <h1 className="text-5xl font-extrabold mb-4 animate-slideInUp bg-gradient-to-br from-[#ffd700] via-[#ffed4e] to-[#ffffff] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]">
                Our Menu
              </h1>
              <p className="max-w-2xl mx-auto mb-8 text-xl text-[#f5e6d3] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-fadeInUp delay-200">
                Discover our carefully crafted selection of delicious dishes,
                prepared with the finest ingredients and culinary expertise.
              </p>
              <div className="flex justify-center">
                <button
                  className="flex items-center gap-2.5 px-7 py-3.5 text-base font-bold text-[#0a0a0a] transition-all bg-gradient-to-br from-[#ffd700] to-[#ffed4e] border-none rounded-full shadow-[0_4px_20px_rgba(255,215,0,0.4)] cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(255,215,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  <span className="text-xl">🛒</span>
                  <span className="font-semibold">{getTotalItems()} items</span>
                  {cart.length > 0 && (
                    <span className="text-xl font-bold">${getTotalPrice().toFixed(2)}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="sticky top-20 z-[100] py-8 bg-[linear-gradient(135deg,#2a2214_0%,#1a1612_100%)] border-b-2 border-[#3d2e1a] shadow-[0_2px_20px_rgba(255,215,0,0.15)]">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-full border-2 transition-all duration-300 font-semibold cursor-pointer ${selectedCategory === category.id
                    ? 'bg-[linear-gradient(135deg,#ffd700_0%,#ffed4e_100%)] border-transparent text-[#0a0a0a] shadow-[0_4px_15px_rgba(255,215,0,0.6)] animate-shimmerGlow'
                    : 'bg-[linear-gradient(135deg,#2a2214_0%,#1a1612_100%)] border-[#4a3d2e] text-[#e8dcc6] hover:border-[#ffd700] hover:text-[#ffd700] hover:bg-[linear-gradient(135deg,#3d2e1a_0%,#2a2214_100%)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(255,215,0,0.3)]'
                    }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#ffd700] mb-2 drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                {selectedCategory === 'all' ? 'All Items' :
                  categories.find(cat => cat.id === selectedCategory)?.name}
              </h2>
              <p className="text-[#c0c0c0] text-lg font-medium">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
              </p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-8">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-[linear-gradient(135deg,#2a2214_0%,#1a1612_100%)] border-2 border-[#4a3d2e] rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(255,215,0,0.15)] transition-all duration-300 relative animate-fadeInUp hover:-translate-y-2.5 hover:shadow-[0_20px_50px_rgba(255,215,0,0.4),inset_0_0_100px_rgba(255,215,0,0.05)] hover:border-[#ffd700] hover:bg-[linear-gradient(135deg,#3d2e1a_0%,#2a2214_100%)]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.popular && <div className="hidden">⭐ Popular</div>} {/* Keeping specific-stub structure optional */}

                  <div className="w-full aspect-square bg-[linear-gradient(135deg,#3d2e1a_0%,#2a2214_100%)] flex items-center justify-center relative overflow-hidden border-b-2 border-[#4a3d2e] cursor-pointer group" onClick={() => openModal(item)}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 block"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="text-6xl animate-bounce" style={{ display: 'none' }}>🍽️</div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 bg-[linear-gradient(135deg,#ffd700_0%,#ffed4e_100%)] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">{item.name}</h3>
                    <p className="text-[#f5e6d3] text-sm leading-relaxed mb-6">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#ffd700]">${item.price}</span>
                      <button
                        className="bg-[linear-gradient(135deg,#ffd700_0%,#ffed4e_100%)] text-[#0a0a0a] border-none px-6 py-3 rounded-full font-bold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,215,0,0.6)] hover:bg-[linear-gradient(135deg,#ffed4e_0%,#ffd700_100%)]"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Floating Cart Summary */}
        {cart.length > 0 && !showCheckout && (
          <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 z-[1000] animate-slideUp">
            <div className="flex items-center gap-[15px] bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white px-7 py-4 rounded-full shadow-[0_8px_30px_rgba(102,126,234,0.4)] md:flex-row flex-col md:gap-4 md:p-3 p-3">
              <span className="font-semibold">{getTotalItems()} items in cart</span>
              <span className="text-xl font-bold">${getTotalPrice().toFixed(2)}</span>
              <button onClick={handleCheckout} className="bg-white text-[#667eea] border-none px-6 py-2.5 rounded-full font-bold cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_15px_rgba(255,255,255,0.3)]">
                Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Order Summary Modal */}
      {showCheckout && (
        <OrderSummary
          cart={cart}
          totalPrice={getTotalPrice()}
          onClose={handleCloseCheckout}
          onComplete={handleCompleteOrder}
          updateCart={setCart}
        />
      )}

      {/* Menu Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] animate-fadeIn p-5" onClick={closeModal}>
          <div className="bg-transparent rounded-[20px] border-2 border-[#ffd700] relative shadow-[0_20px_60px_rgba(255,215,0,0.3)] animate-modalSlideUp max-w-[90%] md:max-w-none" onClick={(e) => e.stopPropagation()}>
            <button className="hidden" onClick={closeModal}>×</button>
            <div className="w-[500px] h-[500px] aspect-square relative overflow-hidden rounded-[20px] flex items-center justify-center bg-[linear-gradient(135deg,#2a2214_0%,#1a1612_100%)] md:w-[350px] md:h-[350px] sm:w-[280px] sm:h-[280px]">
              {getItemImages(selectedItem).length > 1 && (
                <>
                  <button className="absolute top-1/2 -translate-y-1/2 left-[15px] bg-black/60 text-[#ffd700] border-2 border-[#ffd700] w-[50px] h-[50px] rounded-full text-[32px] cursor-pointer flex items-center justify-center transition-all duration-300 z-10 font-light hover:bg-[#ffd700] hover:text-[#1a1612] hover:scale-110" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                    ‹
                  </button>
                  <button className="absolute top-1/2 -translate-y-1/2 right-[15px] bg-black/60 text-[#ffd700] border-2 border-[#ffd700] w-[50px] h-[50px] rounded-full text-[32px] cursor-pointer flex items-center justify-center transition-all duration-300 z-10 font-light hover:bg-[#ffd700] hover:text-[#1a1612] hover:scale-110" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                    ›
                  </button>
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 text-[#ffd700] px-4 py-2 rounded-[20px] font-semibold text-sm z-10">
                    {currentImageIndex + 1} / {getItemImages(selectedItem).length}
                  </div>
                </>
              )}
              <img
                src={getItemImages(selectedItem)[currentImageIndex]}
                alt={selectedItem.name}
                className="w-full h-full object-cover object-center block"
              />
              {selectedItem.popular && <div className="hidden">⭐ Popular</div>}
            </div>
            {/* Modal Content - currently hidden in CSS but structure is here for completeness if needed */}
            <div className="hidden">
              <h3 className="text-4xl font-bold bg-[linear-gradient(135deg,#ffd700_0%,#ffed4e_100%)] bg-clip-text text-transparent mb-4 shadow-[0_0_20px_rgba(255,215,0,0.3)]">{selectedItem.name}</h3>
              {/* ... other modal details ... */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuWithCart;
