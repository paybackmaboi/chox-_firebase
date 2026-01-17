import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Fix for Missing Leaflet Icons ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const defaultCenter = [10.3157, 123.8854];

const OrderTracking = () => {
  const { token } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for particles
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles
    const particleCount = 35;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // 0-100% width
      size: Math.random() * 5 + 3,
      duration: Math.random() * 30 + 25,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.6 + 0.4
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (!token) {
      setError('Invalid tracking link.');
      setLoading(false);
      return;
    }

    const q = query(collection(db, "orders"), where("trackingToken", "==", token));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        setError('Order not found.');
      } else {
        const orderDoc = querySnapshot.docs[0];
        setOrder({ id: orderDoc.id, ...orderDoc.data() });
      }
      setLoading(false);
    }, (err) => {
      console.error("Tracking Error:", err);
      setError('Failed to load order details.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [token]);

  const getStepStatus = (stepName) => {
    if (!order) return 'pending';
    const statusOrder = ['pending', 'preparing', 'on_the_way', 'delivered', 'completed'];
    const currentIdx = statusOrder.indexOf(order.status);
    const stepIdx = statusOrder.indexOf(stepName);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'active';
    return 'pending';
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'preparing': return 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/20';
      case 'on_the_way': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'delivered':
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1612] text-[#e8dcc6] text-center p-8 font-sans">
      <div className="w-12 h-12 border-4 border-[#393528] border-t-[#ffd700] rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-bold tracking-wide">Locating your order...</h2>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1612] text-[#e8dcc6] text-center p-8 font-sans">
      <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl text-red-500">error_outline</span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Tracking Failed</h2>
      <p className="text-[#8b7a63] mb-8 max-w-md">{error}</p>
      <Link to="/" className="px-6 py-3 bg-[#ffd700] text-[#1a1612] font-bold rounded-xl hover:bg-[#ffed4e] transition-colors no-underline shadow-lg shadow-yellow-500/20">
        Return Home
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1612] font-sans text-[#e8dcc6] flex flex-col relative overflow-x-hidden selection:bg-[#ffd700] selection:text-[#1a1612]">

      {/* --- LIVE BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[radial-gradient(circle_at_top,#2a2216_0%,#1a1612_100%)]">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute -bottom-[50px] bg-[#ffd700] rounded-full opacity-0 animate-floatUp shadow-[0_0_15px_2px_rgba(255,215,0,0.4)]"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#1a1612]/80 backdrop-blur-md border-b border-[#393528]/50 h-20 flex items-center justify-between px-6 lg:px-12 transition-all duration-300">
        <Link to="/" className="flex items-center gap-4 no-underline group">
          <div className="relative">
            <div className="absolute inset-0 bg-[#ffd700] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img src="/logo.jpg" alt="CHOX" className="relative w-10 h-10 rounded-full object-cover border-2 border-[#393528] group-hover:border-[#ffd700] transition-colors" />
          </div>
          <div>
            <span className="block text-lg font-bold text-white tracking-widest leading-none">CHOX</span>
            <span className="block text-[10px] text-[#ffd700] tracking-[0.2em] font-medium leading-none mt-1">KITCHEN</span>
          </div>
        </Link>
        <Link to="/" className="text-[#8b7a63] text-sm font-medium no-underline hover:text-[#ffd700] transition-colors flex items-center gap-2">
          <span>Back to Menu</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </nav>

      <main className="w-full max-w-6xl mx-auto p-4 lg:p-8 flex-1 relative z-10 flex flex-col lg:flex-row gap-8">

        {/* --- LEFT COLUMN: Status & Timeline --- */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Main Status Card */}
          <div className="bg-[#1a1612] border border-[#393528] rounded-3xl p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd700] opacity-[0.03] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-[0.05] transition-opacity"></div>

            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white m-0 tracking-tight">Order #{order.id.slice(0, 6).toUpperCase()}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadgeStyle(order.status)}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-[#8b7a63] text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 relative">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#8b7a63] mb-3">
                <span>Estimated Arrival</span>
                <span className="text-[#ffd700]">
                  {order.status === 'delivered' || order.status === 'completed' ? 'Arrived' :
                    order.status === 'on_the_way' ? '15-20 min' : 'Pending'}
                </span>
              </div>
              <div className="bg-[#2a2214] h-2 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#b8860b] to-[#ffd700] relative"
                  style={{
                    width: order.status === 'pending' ? '10%' :
                      order.status === 'preparing' ? '40%' :
                        order.status === 'on_the_way' ? '75%' : '100%',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              <TimelineItem
                status={order.status === 'completed' ? 'completed' : 'completed'}
                title="Order Confirmed"
                desc="We have received your order."
                icon="receipt_long"
                isLast={false}
              />
              <TimelineItem
                status={getStepStatus('preparing')}
                title="Preparing"
                desc="Kitchen is preparing your food."
                icon="skillet"
                isLast={false}
              />
              <TimelineItem
                status={getStepStatus('on_the_way')}
                title="Out for Delivery"
                desc="Rider is on the way."
                icon="two_wheeler"
                isLast={false}
              />
              <TimelineItem
                status={getStepStatus('delivered')}
                title="Delivered"
                desc="Enjoy your meal!"
                icon="home_pin"
                isLast={true}
              />
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-[#1a1612] border border-[#393528] rounded-3xl overflow-hidden h-[300px] relative shadow-lg group">
            <MapContainer
              center={defaultCenter}
              zoom={13}
              style={{ width: '100%', height: '100%', zIndex: 1, filter: 'grayscale(100%) invert(100%) contrast(1.2)' }}
              className="opacity-70 group-hover:opacity-100 transition-opacity duration-500"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={defaultCenter}>
                <Popup>
                  Delivery Location <br /> {order.deliveryAddress}
                </Popup>
              </Marker>
            </MapContainer>

            <div className="absolute bottom-4 left-4 right-4 bg-[#1a1612]/90 backdrop-blur-md border border-[#393528] p-4 rounded-2xl z-[1000] flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#ffd700]">location_on</span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[#8b7a63] uppercase tracking-widest mb-1">Delivering To</p>
                <p className="text-white text-sm font-medium truncate">{order.deliveryAddress || 'No address provided'}</p>
              </div>
            </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN: Order Summary --- */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6">

          <div className="bg-[#1a1612] border border-[#393528] rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-[#393528]">
              <h3 className="text-xl font-bold text-[#e8dcc6]">Order Summary</h3>
              <span className="bg-[#2a2214] text-[#ffd700] text-xs font-bold px-3 py-1 rounded-full">{order.items?.length || 0} Items</span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-4 mb-6 custom-scrollbar">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="w-16 h-16 bg-[#2a2214] rounded-xl flex items-center justify-center shrink-0 border border-[#393528] group-hover:border-[#ffd700]/50 transition-colors">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-2xl">🍽️</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-white font-semibold text-sm leading-tight line-clamp-2">{item.name || item.productName}</h4>
                      <span className="text-[#ffd700] font-bold text-sm shrink-0">₱{item.price * (item.quantity || 1)}</span>
                    </div>
                    <p className="text-[#8b7a63] text-xs mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-[#393528]">
              <div className="flex justify-between text-sm">
                <span className="text-[#8b7a63]">Subtotal</span>
                <span className="text-[#e8dcc6]">₱{order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8b7a63]">Delivery Fee</span>
                <span className="text-[#e8dcc6]">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t border-[#393528]">
                <span className="text-white">Total</span>
                <span className="text-[#ffd700]">₱{order.totalAmount}</span>
              </div>
            </div>

            {/* Receipt Proof */}
            {order.receiptImage && (
              <div className="mt-6 pt-6 border-t border-[#393528]">
                <p className="text-xs font-bold text-[#8b7a63] uppercase tracking-widest mb-3">Payment Proof</p>
                <a href={order.receiptImage} target="_blank" rel="noreferrer" className="block w-full h-32 rounded-xl overflow-hidden border border-[#393528] hover:border-[#ffd700] transition-colors relative group">
                  <img src={order.receiptImage} alt="Receipt" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white">visibility</span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

const TimelineItem = ({ status, title, desc, icon, isLast }) => {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  let circleClass = "border-[#393528] bg-[#1a1612] text-[#8b7a63]";
  let lineClass = "bg-[#393528]";

  if (isCompleted) {
    circleClass = "border-[#ffd700] bg-[#ffd700] text-[#1a1612] shadow-[0_0_15px_rgba(255,215,0,0.5)]";
    lineClass = "bg-[#ffd700]";
  } else if (isActive) {
    circleClass = "border-[#ffd700] bg-[#1a1612] text-[#ffd700] animate-pulse";
    lineClass = "bg-[#393528]";
  }

  return (
    <div className={`flex gap-6 relative ${isLast ? '' : 'pb-10'}`}>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${circleClass}`}>
          <span className="material-symbols-outlined text-xl font-bold">{icon}</span>
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-2 mb-2 transition-colors duration-500 ${lineClass}`}></div>
        )}
      </div>
      <div className={`pt-1 transition-opacity duration-500 ${isActive || isCompleted ? 'opacity-100' : 'opacity-40'}`}>
        <h4 className="m-0 text-lg font-bold text-white">{title}</h4>
        <p className="text-sm text-[#8b7a63] mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

export default OrderTracking;