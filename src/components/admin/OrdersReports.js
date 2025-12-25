import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import './AdminReports.css';

const OrdersReports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    orderId: '',
    customerName: '',
    startDate: '',
    endDate: '',
  });
  
  // Pagination State
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 30;
  
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Add Order Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: [{ productId: '', quantity: 1 }],
  });
  
  const [products, setProducts] = useState([]);
  
  // Modals State
  const [receiptModal, setReceiptModal] = useState({ open: false, imageUrl: null, loading: false, error: null });
  const [confirmModal, setConfirmModal] = useState({ open: false, orderId: null, orderNumber: null });
  const [startPreparingModal, setStartPreparingModal] = useState({ open: false, orderId: null, orderNumber: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, orderId: null, orderNumber: null });
  
  const [confirmedOrders, setConfirmedOrders] = useState(() => {
    const saved = localStorage.getItem('confirmedOrders');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  const [notification, setNotification] = useState({ open: false, type: 'success', message: '' });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []); // Fetch once on mount, then we filter client-side

  // Persist confirmed orders
  useEffect(() => {
    localStorage.setItem('confirmedOrders', JSON.stringify(Array.from(confirmedOrders)));
  }, [confirmedOrders]);

  const fetchProducts = async () => {
    try {
      // Adjusted to fetch from 'products' collection in Firestore
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch from Firestore 'orders' collection
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const ordersList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Handle different date formats (Timestamp vs String)
            orderDate: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
            // Normalize Items array
            Items: data.items || [] 
        };
      });

      setOrders(ordersList);
      
      // Clean up confirmed orders that are no longer pending
      setConfirmedOrders(prev => {
        const newSet = new Set(prev);
        ordersList.forEach(order => {
          if (order.status !== 'pending' && newSet.has(order.id)) {
            newSet.delete(order.id);
          }
        });
        return newSet;
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders from database');
    } finally {
      setLoading(false);
    }
  };

  // --- Filtering Logic (Client Side) ---
  const getFilteredOrders = () => {
    return orders.filter(order => {
        const matchId = filters.orderId ? order.id.toLowerCase().includes(filters.orderId.toLowerCase()) : true;
        const matchName = filters.customerName ? (order.customerName || '').toLowerCase().includes(filters.customerName.toLowerCase()) : true;
        
        let matchDate = true;
        if (filters.startDate || filters.endDate) {
            const orderDate = new Date(order.orderDate).setHours(0,0,0,0);
            if (filters.startDate) {
                const start = new Date(filters.startDate).setHours(0,0,0,0);
                if (orderDate < start) matchDate = false;
            }
            if (filters.endDate) {
                const end = new Date(filters.endDate).setHours(0,0,0,0);
                if (orderDate > end) matchDate = false;
            }
        }
        return matchId && matchName && matchDate;
    });
  };

  const filteredOrders = getFilteredOrders();
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentOrders = filteredOrders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPage(1);
  };

  const applyFilters = () => {
    setPage(1); // Filtering happens automatically via filteredOrders
  };

  // --- Order Actions ---

  const handleConfirmOrder = (orderId, orderNumber) => {
    setConfirmModal({ open: true, orderId, orderNumber });
  };

  const handleConfirmAndProceed = async () => {
    if (!confirmModal.orderId) return;
    try {
      setConfirmedOrders(prev => new Set([...prev, confirmModal.orderId]));
      setConfirmModal({ open: false, orderId: null, orderNumber: null });
      showNotification('success', `Order confirmed locally. Click "Start Preparing" to update status.`);
    } catch (err) {
      showNotification('error', 'Error confirming order');
    }
  };

  const handleStartPreparing = (orderId, orderNumber) => {
    setStartPreparingModal({ open: true, orderId, orderNumber });
  };

  const handleStartPreparingConfirm = async () => {
    if (!startPreparingModal.orderId) return;
    
    try {
      const orderRef = doc(db, "orders", startPreparingModal.orderId);
      await updateDoc(orderRef, { status: 'preparing' });

      setConfirmedOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(startPreparingModal.orderId);
        return newSet;
      });
      setStartPreparingModal({ open: false, orderId: null, orderNumber: null });
      showNotification('success', `Order is now being prepared.`);
      fetchOrders(); // Refresh list
    } catch (err) {
      console.error(err);
      showNotification('error', 'Error updating order status');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, orderNumber = null) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      const statusLabels = {
        'on_the_way': 'out for delivery',
        'delivered': 'delivered',
        'completed': 'completed'
      };
      const label = statusLabels[newStatus] || newStatus;
      showNotification('success', `Order marked as ${label}.`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      showNotification('error', 'Error updating order status');
    }
  };

  const handleDeleteClick = (orderId, orderNumber) => {
    setDeleteModal({ open: true, orderId, orderNumber });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.orderId) return;

    try {
      await deleteDoc(doc(db, "orders", deleteModal.orderId));
      
      setDeleteModal({ open: false, orderId: null, orderNumber: null });
      showNotification('success', `Order deleted successfully.`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      showNotification('error', 'Error deleting order');
    }
  };

  // --- Add Order Form Logic ---

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1 }],
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.items.some(item => !item.productId || item.quantity <= 0)) {
      showNotification('error', 'Please fill in all product selections and valid quantities');
      return;
    }

    try {
      // Calculate totals
      let totalAmount = 0;
      const orderItems = formData.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        const price = product ? parseFloat(product.price) : 0;
        const subtotal = price * item.quantity;
        totalAmount += subtotal;
        
        return {
            id: item.productId,
            productId: item.productId,
            productName: product ? product.name : 'Unknown Product',
            price: price,
            quantity: item.quantity,
            subtotal: subtotal
        };
      });

      // Add to Firestore
      await addDoc(collection(db, "orders"), {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        items: orderItems,
        totalAmount: totalAmount,
        status: 'pending',
        createdAt: serverTimestamp(),
        orderDate: new Date().toISOString(), // Fallback for simple sorting
        trackingToken: Math.random().toString(36).substring(2, 15) // Simple token generation
      });

      setShowModal(false);
      showNotification('success', 'Order created successfully!');
      fetchOrders();
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        items: [{ productId: '', quantity: 1 }],
      });
    } catch (err) {
      console.error(err);
      showNotification('error', 'Error creating order: ' + err.message);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ open: true, type, message });
    setTimeout(() => {
      setNotification({ open: false, type: 'success', message: '' });
    }, 5000);
  };

  return (
    <div className="admin-reports">
      <div className="reports-header">
        <h1>Orders Reports</h1>
        <button onClick={() => setShowModal(true)} className="add-button">
          + Add Order
        </button>
      </div>

      <div className="orders-filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="order-id-filter" style={{ display: 'none' }}>Order ID Filter</label>
            <input
              id="order-id-filter"
              name="orderId"
              type="text"
              placeholder="Order ID"
              value={filters.orderId}
              onChange={(e) => handleFilterChange('orderId', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="customer-name-filter" style={{ display: 'none' }}>Customer Name Filter</label>
            <input
              id="customer-name-filter"
              name="customerName"
              type="text"
              placeholder="Customer Name"
              value={filters.customerName}
              onChange={(e) => handleFilterChange('customerName', e.target.value)}
            />
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-date-group">
            <label htmlFor="start-date-filter">START DATE</label>
            <input
              id="start-date-filter"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          <div className="filter-date-group">
            <label htmlFor="end-date-filter">END DATE</label>
            <input
              id="end-date-filter"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          <button onClick={applyFilters} className="apply-filters-btn">Apply Filters</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading Orders from Firebase...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="table-scroll-container orders-table-container">
            <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer Info</th>
                <th>Delivery Address</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>{order.orderDate.toLocaleDateString()}</td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>{order.customerName}</strong>
                      {order.customerEmail && (
                        <div style={{ color: '#aaa' }}>📧 {order.customerEmail}</div>
                      )}
                      {order.customerPhone && (
                        <div style={{ color: '#aaa' }}>📞 {order.customerPhone}</div>
                      )}
                      {order.specialInstructions && (
                        <div style={{ color: '#d97706', fontSize: '0.85rem', marginTop: '4px' }}>
                          💬 Note: {order.specialInstructions}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    {order.deliveryAddress ? (
                      <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                        📍 {order.deliveryAddress}
                      </div>
                    ) : (
                      <div style={{ color: '#666', fontSize: '0.85rem' }}>Not provided</div>
                    )}
                  </td>
                  <td>
                    {order.Items?.map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.9rem' }}>
                        {idx + 1}. {item.productName || item.name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#10b981' }}>
                    ₱{parseFloat(order.totalAmount).toLocaleString()}
                  </td>
                  <td>
                    <span className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}>
                      {order.status ? order.status.replace('_', ' ') : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                      {/* Workflow Buttons */}
                      {order.status === 'pending' && !confirmedOrders.has(order.id) && (
                        <button 
                          onClick={() => handleConfirmOrder(order.id, order.id.slice(0,6))}
                          className="edit-btn"
                        >
                          ✓ Confirm Order
                        </button>
                      )}
                      {order.status === 'pending' && confirmedOrders.has(order.id) && (
                        <button 
                          onClick={() => handleStartPreparing(order.id, order.id.slice(0,6))}
                          className="edit-btn order-action-btn-start-preparing"
                        >
                          👨‍🍳 Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, 'on_the_way', order.id.slice(0,6))}
                          className="edit-btn"
                        >
                          🚗 Mark On the Way
                        </button>
                      )}
                      {order.status === 'on_the_way' && (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, 'delivered', order.id.slice(0,6))}
                          className="add-btn"
                        >
                          📦 Mark Delivered
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, 'completed', order.id.slice(0,6))}
                          className="add-btn"
                        >
                          ✅ Complete Order
                        </button>
                      )}
                      
                      {/* Helper Buttons */}
                      {order.receiptImage && (
                        <button
                          onClick={() => {
                            // Use URL directly if from Firebase Storage
                            setReceiptModal({ open: true, imageUrl: order.receiptImage, loading: true, error: null });
                          }}
                          className="edit-btn"
                        >
                          🧾 View Receipt
                        </button>
                      )}
                      {order.trackingToken && (
                        <a
                          href={`/track/${order.trackingToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="edit-btn"
                        >
                          🔍 View Tracking
                        </a>
                      )}
                      <button 
                        onClick={() => handleDeleteClick(order.id, order.id.slice(0,6))} 
                        className="delete-btn"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Mobile Card View (Updated for Firebase Data) */}
          <div className="mobile-cards">
            {currentOrders.map((order) => (
              <div key={order.id} className="mobile-card">
                <div className="mobile-card-header">
                  <h3 className="mobile-card-title">Order #{order.id.slice(0, 6)}</h3>
                  <span className={`mobile-card-status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mobile-card-body">
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Date</span>
                    <span className="mobile-card-value">{order.orderDate.toLocaleDateString()}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Customer</span>
                    <span className="mobile-card-value">{order.customerName}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Total</span>
                    <span className="mobile-card-value" style={{ color: '#059669', fontWeight: '800' }}>
                      ₱{parseFloat(order.totalAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mobile-card-actions">
                  {/* Same logic as desktop for buttons */}
                   {order.status === 'pending' && !confirmedOrders.has(order.id) ? (
                    <button
                      onClick={() => handleConfirmOrder(order.id, order.id.slice(0,6))}
                      className="edit-btn"
                    >
                      ✓ Confirm
                    </button>
                  ) : order.status === 'pending' ? (
                     <button
                      onClick={() => handleStartPreparing(order.id, order.id.slice(0,6))}
                      className="edit-btn order-action-btn-start-preparing"
                    >
                      👨‍🍳 Cook
                    </button>
                  ) : null}
                  
                  <button
                    onClick={() => handleDeleteClick(order.id, order.id.slice(0,6))}
                    className="delete-btn"
                  >
                    🗑️ Del
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page} of {Math.max(1, totalPages)}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Add Order Modal */}
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Order</h2>
            <form onSubmit={handleSubmit}>
              <label>Customer Name</label>
              <input
                type="text"
                placeholder="Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
              <label>Phone</label>
              <input
                type="tel"
                placeholder="Phone"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              />
              
              <button type="button" onClick={handleAddItem} className="edit-btn" style={{marginBottom: '15px'}}>+ Add Product Item</button>
              
              {formData.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(i, 'productId', e.target.value)}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    style={{width: '80px'}}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(i, 'quantity', parseInt(e.target.value))}
                    required
                  />
                </div>
              ))}
              
              <div className="modal-buttons">
                <button type="submit">Create Order</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt View Modal */}
      {receiptModal.open && receiptModal.imageUrl && (
        <div className="modal receipt-modal-overlay" onClick={() => setReceiptModal({ open: false, imageUrl: null, loading: false, error: null })}>
          <div className="receipt-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-modal-header">
              <div className="receipt-modal-title-section">
                <div className="receipt-icon">🧾</div>
                <div>
                  <h2 className="receipt-modal-title">Receipt</h2>
                </div>
              </div>
              <button className="receipt-modal-close" onClick={() => setReceiptModal({ open: false, imageUrl: null, loading: false, error: null })}>X</button>
            </div>
            <div className="receipt-modal-body">
               <div className="receipt-image-container">
                  <img
                    src={receiptModal.imageUrl}
                    alt="Receipt"
                    className="receipt-image"
                    onLoad={() => setReceiptModal(prev => ({ ...prev, loading: false }))}
                  />
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="modal confirm-modal-overlay" onClick={() => setConfirmModal({ open: false, orderId: null, orderNumber: null })}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-header">
               <h2 className="confirm-modal-title">Confirm Order #{confirmModal.orderNumber}</h2>
            </div>
            <div className="confirm-modal-body">
              <p className="confirm-modal-message">Confirm this order to move to preparation?</p>
            </div>
            <div className="confirm-modal-footer">
              <button className="confirm-btn confirm-btn-primary" onClick={handleConfirmAndProceed}>Confirm</button>
              <button className="confirm-btn confirm-btn-secondary" onClick={() => setConfirmModal({ open: false, orderId: null, orderNumber: null })}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Start Preparing Modal */}
      {startPreparingModal.open && (
        <div className="modal confirm-modal-overlay" onClick={() => setStartPreparingModal({ open: false, orderId: null, orderNumber: null })}>
           <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-header">
               <h2 className="confirm-modal-title">Start Cooking?</h2>
            </div>
            <div className="confirm-modal-body">
              <p className="confirm-modal-message">Start preparing Order #{startPreparingModal.orderNumber}?</p>
            </div>
            <div className="confirm-modal-footer">
              <button className="confirm-btn confirm-btn-primary" onClick={handleStartPreparingConfirm}>Yes, Start</button>
              <button className="confirm-btn confirm-btn-secondary" onClick={() => setStartPreparingModal({ open: false, orderId: null, orderNumber: null })}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="modal confirm-modal-overlay" onClick={() => setDeleteModal({ open: false, orderId: null, orderNumber: null })}>
           <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-header">
               <h2 className="confirm-modal-title">Delete Order?</h2>
            </div>
            <div className="confirm-modal-body">
              <p className="confirm-modal-message">Permanently delete Order #{deleteModal.orderNumber}?</p>
            </div>
            <div className="confirm-modal-footer">
              <button className="confirm-btn" style={{backgroundColor: '#ef4444', color: 'white'}} onClick={handleDeleteConfirm}>Delete</button>
              <button className="confirm-btn confirm-btn-secondary" onClick={() => setDeleteModal({ open: false, orderId: null, orderNumber: null })}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.open && (
        <div className={`notification-toast notification-${notification.type}`}>
          <div className="notification-message">{notification.message}</div>
        </div>
      )}
    </div>
  );
};

export default OrdersReports;