import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './OrderTracking.css';

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

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <h2>Locating your order...</h2>
    </div>
  );

  if (error) return (
    <div className="error-screen">
      <span className="material-symbols-outlined" style={{fontSize: '48px', color: '#ef4444', marginBottom: '1rem'}}>error</span>
      <h2>Tracking Failed</h2>
      <p style={{color: '#e2dcc8', marginBottom: '2rem'}}>{error}</p>
      <Link to="/" className="action-btn btn-secondary" style={{textDecoration: 'none'}}>Return Home</Link>
    </div>
  );

  return (
    <div className="tracking-page">
      
      {/* --- LIVE BACKGROUND OBJECTS --- */}
      <div className="live-background">
        {particles.map((p) => (
          <div 
            key={p.id} 
            className="particle"
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
      {/* ------------------------------- */}

      {/* Navbar */}
      <nav className="tracking-navbar">
        <Link to="/" className="nav-brand">
          {/* UPDATED LOGO */}
          <img src="/logo.jpg" alt="CHOX Logo" className="nav-logo" />
          <span className="brand-text">CHOX KITCHEN</span>
        </Link>
        <Link to="/" className="nav-link">Back to Menu</Link>
      </nav>

      <main className="layout-container">
        
        {/* Header */}
        <header className="page-header">
          <div className="header-top">
            <div className="order-title-group">
              <h1 className="order-title">Order #{order.id.slice(0, 6).toUpperCase()}</h1>
              <span className={`status-badge ${order.status}`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              {order.status === 'pending' && (
                <button className="action-btn btn-secondary">Cancel Order</button>
              )}
            </div>
          </div>
          <p className="order-date">
            Placed on {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : new Date().toLocaleDateString()}
          </p>
        </header>

        <div className="dashboard-grid">
          
          <div className="left-panel">
            <div className="card eta-card">
              <span className="material-symbols-outlined eta-icon-bg">schedule</span>
              <div className="eta-label">Estimated Arrival</div>
              <div className="eta-time">
                {order.status === 'delivered' ? 'Arrived' : 
                 order.status === 'on_the_way' ? '15 min' : 'Pending'}
              </div>
              <div style={{background: '#3d362b', height: '6px', borderRadius: '4px', overflow: 'hidden'}}>
                 <div style={{
                   height: '100%', 
                   background: '#ecb613', 
                   width: order.status === 'pending' ? '10%' : 
                          order.status === 'preparing' ? '40%' : 
                          order.status === 'on_the_way' ? '75%' : '100%'
                 }}></div>
              </div>
            </div>

            <div className="card">
              <h3 style={{fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid #3d362b', paddingBottom: '1rem'}}>Order Status</h3>
              <div className="timeline-container">
                <TimelineItem status="completed" title="Order Confirmed" desc="We have received your order." icon="check" isLast={false} />
                <TimelineItem status={getStepStatus('preparing')} title="Preparing" desc="Kitchen is preparing your food." icon="skillet" isLast={false} />
                <TimelineItem status={getStepStatus('on_the_way')} title="Out for Delivery" desc="Rider is on the way." icon="pedal_bike" isLast={false} />
                <TimelineItem status={getStepStatus('delivered')} title="Delivered" desc="Enjoy your meal!" icon="home" isLast={true} />
              </div>
            </div>
          </div>

          <div className="right-panel">
            
            {/* Map Section */}
            <div className="map-placeholder" style={{padding: 0, overflow: 'hidden', border: '1px solid #3d362b', height: '350px', position: 'relative'}}>
              
              <MapContainer 
                center={defaultCenter} 
                zoom={13} 
                style={{ width: '100%', height: '100%', zIndex: 1 }}
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

              {/* Address Badge */}
              <div className="address-float" style={{zIndex: 1000}}>
                <span className="material-symbols-outlined" style={{color: '#ecb613'}}>location_on</span>
                <div>
                   <div className="address-label">Delivering To</div>
                   <div className="address-value">{order.deliveryAddress}</div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid" style={{gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
              <div className="card" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #3d362b', paddingBottom: '1rem'}}>
                    <h3 style={{fontSize: '1.1rem', fontWeight: '700', margin: 0}}>Your Items</h3>
                    <span style={{fontSize: '0.8rem', background: '#3d362b', padding: '2px 8px', borderRadius: '4px'}}>{order.items?.length || 0} Items</span>
                 </div>
                 <div style={{flex: 1}}>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="item-row">
                        <div className="item-image-placeholder">
                          <span className="material-symbols-outlined">fastfood</span>
                        </div>
                        <div className="item-details">
                          <h4>{item.name || item.productName}</h4>
                          <span className="qty">Qty: {item.quantity}</span>
                          <span className="price">₱{item.price}</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="card">
                <h3 style={{fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem'}}>Payment</h3>
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">₱{order.totalAmount}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Delivery Fee</span>
                  <span className="summary-value">Free</span>
                </div>
                <div className="total-row">
                  <span>Total</span>
                  <span className="total-value">₱{order.totalAmount}</span>
                </div>
                <div className="balance-box">
                  <span className="balance-label">Paid (50%)</span>
                  <span style={{fontWeight: '700'}}>₱{(order.totalAmount / 2).toFixed(2)}</span>
                </div>
                <div className="balance-box" style={{marginTop: '0.5rem', background: 'transparent', borderColor: '#3d362b'}}>
                  <span className="balance-label" style={{color: '#e2dcc8'}}>Balance Due</span>
                  <span style={{fontWeight: '700'}}>₱{(order.totalAmount / 2).toFixed(2)}</span>
                </div>

                {/* --- RECEIPT IMAGE PREVIEW --- */}
                {order.receiptImage && (
                  <div className="receipt-preview">
                    <div className="receipt-title">
                      <span className="material-symbols-outlined" style={{fontSize: '18px'}}>receipt_long</span>
                      Payment Proof
                    </div>
                    <div className="receipt-img-container">
                      <a href={order.receiptImage} target="_blank" rel="noreferrer">
                        <img 
                          src={order.receiptImage} 
                          alt="Receipt Proof" 
                          className="receipt-img" 
                        />
                      </a>
                    </div>
                    <div style={{textAlign: 'center', marginTop: '0.5rem'}}>
                      <a href={order.receiptImage} target="_blank" rel="noreferrer" style={{fontSize: '0.8rem', color: '#ecb613', textDecoration: 'none'}}>Click to enlarge</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const TimelineItem = ({ status, title, desc, icon, isLast }) => {
  return (
    <div className={`timeline-step ${status}`}>
      <div className="step-icon">
        <span className="material-symbols-outlined" style={{fontSize: '1.2rem'}}>{icon}</span>
      </div>
      {!isLast && <div className="timeline-line"></div>}
      <div className="step-content">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
};

export default OrderTracking;