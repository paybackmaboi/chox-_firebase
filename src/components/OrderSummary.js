import React, { useState } from 'react';
import { db } from '../firebase'; // Removed 'storage' import
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const OrderSummary = ({ cart, totalPrice, onClose, onComplete, updateCart }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialInstructions: ''
  });

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [localCart, setLocalCart] = useState(cart);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [trackingToken, setTrackingToken] = useState(null);

  // --- Cart Management Functions ---
  const handleRemoveItem = (itemId) => {
    const updatedCart = localCart.filter(item => item.id !== itemId);
    setLocalCart(updatedCart);
    if (updateCart) updateCart(updatedCart);
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    const updatedCart = localCart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setLocalCart(updatedCart);
    if (updateCart) updateCart(updatedCart);
  };

  const getCurrentTotalPrice = () => {
    return localCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  // Helper to convert image file to Base64 string
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleReceiptChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // ⚠️ IMPORTANT: Firestore has a 1MB limit per document.
      // We restrict files to 600KB to be safe (leaving room for order data).
      if (file.size > 600 * 1024) {
        alert("File is too large! Please upload a smaller screenshot (under 600KB).");
        return;
      }
      
      setReceiptFile(file);
      
      // Create preview immediately
      const base64 = await convertToBase64(file);
      setReceiptPreview(base64);
    }
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  // --- FIREBASE SUBMISSION LOGIC (NO STORAGE BUCKET) ---
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (localCart.length === 0) throw new Error('Cart is empty');
      if (!receiptFile) throw new Error('Please upload the downpayment receipt');

      // 1. Convert Image to Base64 String
      const base64Image = await convertToBase64(receiptFile);

      // 2. Prepare Order Data
      const token = Math.random().toString(36).substring(2, 15);
      const orderData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        deliveryAddress: customerInfo.address,
        specialInstructions: customerInfo.specialInstructions || '',
        items: localCart.map(item => ({
          productId: item.id || '',
          name: item.title || item.name || 'Unknown Item',
          price: Number(item.price),
          quantity: Number(item.quantity),
          subtotal: Number(item.price) * Number(item.quantity)
        })),
        totalAmount: Number(getCurrentTotalPrice()),
        // Store the image STRING directly in the database
        receiptImage: base64Image, 
        status: 'pending',
        trackingToken: token,
        createdAt: serverTimestamp(),
        orderDate: new Date().toISOString()
      };

      // 3. Save to Firestore 'orders' collection
      await addDoc(collection(db, "orders"), orderData);

      // 4. Success State
      setTrackingToken(token);
      setOrderComplete(true);
      
      setTimeout(() => {
        onComplete();
      }, 5000);
      
    } catch (error) {
      console.error('Order Error:', error);
      // specific check for the Firestore size error
      if (error.message.includes("exceeds the maximum allowed size")) {
        alert("Upload Failed: The receipt image is too big. Please take a new screenshot or crop it.");
      } else {
        alert(`Failed to place order: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Success View ---
  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="bg-[#1a1814] border border-[#ffd700]/30 rounded-2xl p-8 max-w-md w-full mx-4 text-center text-white shadow-2xl">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-[#ffd700] mb-4">Order Placed!</h2>
          <p className="text-[#bab29c] mb-6">
            We are reviewing your payment. You can track your order below.
          </p>
          
          <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
            <p className="text-sm font-medium mb-2 text-gray-300">Tracking Link:</p>
            <a href={`/track/${trackingToken}`} target="_blank" rel="noreferrer" className="text-[#ffd700] underline text-sm break-all hover:text-white transition-colors">
              {window.location.origin}/track/{trackingToken}
            </a>
          </div>
          
          <button onClick={onComplete} className="w-full bg-[#ffd700] text-black font-bold py-3 rounded-xl hover:bg-white transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  // --- Order Form View ---
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-[#1a1814] border border-[#393528] rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col shadow-2xl text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-[#393528] flex justify-between items-center bg-[#12110e] rounded-t-2xl">
          <h2 className="text-2xl font-display font-bold text-[#ffd700]">Your Order</h2>
          <button onClick={onClose} className="text-[#bab29c] hover:text-white transition-colors text-2xl">&times;</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#ffd700]/20 scrollbar-track-transparent">
          
          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {localCart.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                <img 
                  src={item.image} 
                  alt={item.title || item.name} 
                  className="w-16 h-16 rounded-lg object-cover bg-gray-800" 
                  onError={(e) => {e.target.style.display='none'}}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-white">{item.title || item.name}</h4>
                  <p className="text-[#ffd700]">₱{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-black/40 rounded-full px-3 py-1 border border-white/10">
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="text-[#bab29c] hover:text-white w-6 h-6 flex items-center justify-center">-</button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="text-[#bab29c] hover:text-white w-6 h-6 flex items-center justify-center">+</button>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="ml-2 text-red-400 hover:text-red-300"
                  title="Remove item"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <h3 className="text-lg font-serif italic text-[#ffd700] border-b border-[#393528] pb-2 mb-4">Delivery Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" name="name" placeholder="Full Name *" required 
                value={customerInfo.name} onChange={handleInputChange}
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-[#bab29c]/50 focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]"
              />
              <input 
                type="email" name="email" placeholder="Email *" required 
                value={customerInfo.email} onChange={handleInputChange}
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-[#bab29c]/50 focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]"
              />
              <input 
                type="tel" name="phone" placeholder="Phone Number *" required 
                value={customerInfo.phone} onChange={handleInputChange}
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-[#bab29c]/50 focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]"
              />
              <input 
                type="text" name="address" placeholder="Delivery Address *" required 
                value={customerInfo.address} onChange={handleInputChange}
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-[#bab29c]/50 focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]"
              />
            </div>

            <textarea 
              name="specialInstructions" 
              placeholder="Special Instructions (Optional)" 
              rows="2"
              value={customerInfo.specialInstructions} onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-[#bab29c]/50 focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]"
            ></textarea>

            {/* Receipt Upload */}
            <div className="mt-6 p-4 border border-dashed border-[#393528] rounded-xl text-center hover:border-[#ffd700]/50 transition-colors bg-black/20 group">
              <input type="file" accept="image/*" onChange={handleReceiptChange} id="receipt" className="hidden" />
              <label htmlFor="receipt" className="cursor-pointer block">
                {receiptPreview ? (
                  <div className="relative inline-block">
                    <img src={receiptPreview} alt="Receipt" className="max-h-32 mx-auto rounded-lg border border-[#ffd700]/30" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); removeReceipt(); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs shadow-md"
                    >
                      X
                    </button>
                    <p className="text-xs text-[#ffd700] mt-2">Click to change</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-2">
                      <span className="material-symbols-outlined text-3xl text-[#bab29c] group-hover:text-[#ffd700] transition-colors">receipt_long</span>
                    </div>
                    <p className="text-sm text-[#bab29c] group-hover:text-white transition-colors">Upload GCash/Bank Receipt (50% Downpayment)</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Max file size: 600KB (Small Screenshots Only)
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-[#393528] mt-6 bg-[#12110e] -mx-6 -mb-6 p-6 rounded-b-2xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[#bab29c]">Total Amount</span>
                <span className="text-3xl font-bold text-[#ffd700]">₱{getCurrentTotalPrice().toFixed(2)}</span>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#ffd700] to-[#e9b10c] text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span>
                    Processing...
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;