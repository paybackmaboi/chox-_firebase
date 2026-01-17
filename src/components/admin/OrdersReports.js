import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

const OrdersReports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // toggling view
  const [selectedOrder, setSelectedOrder] = useState(null);

  // filtering state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    startDate: '',
    endDate: ''
  });

  // pagination
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewReceipt, setViewReceipt] = useState(null);

  // notifications
  const [notification, setNotification] = useState(null);

  // form state
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: [{ productId: '', quantity: 1 }],
    specialInstructions: ''
  });

  useEffect(() => {
    // Real-time Orders Listener
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Handle dates safely
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
        // Ensure items array exists
        items: doc.data().items || []
      }));
      setOrders(ordersList);
      setLoading(false);

      // If an order is selected, update it with real-time data
      if (selectedOrder) {
        const updatedSelected = ordersList.find(o => o.id === selectedOrder.id);
        if (updatedSelected) setSelectedOrder(updatedSelected);
      }
    }, (error) => {
      console.error("Error fetching orders:", error);
      showNotification('error', 'Failed to load orders.');
      setLoading(false);
    });

    // Fetch Products for Dropdown (One-time)
    const fetchProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubscribe();
      fetchProducts();
    };
  }, [selectedOrder?.id]); // Depend on ID to keep listener fresh but mostly for logic correctness

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- Actions ---

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      showNotification('success', `Order status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteDoc(doc(db, "orders", orderId));
      showNotification('success', 'Order deleted');
      setSelectedOrder(null); // Go back to list if viewing details
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to delete order');
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (newOrder.items.some(i => !i.productId)) {
      showNotification('error', 'Please select products');
      return;
    }

    try {
      // Calculate total
      let totalAmount = 0;
      const validItems = newOrder.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        const price = product ? parseFloat(product.price) : 0;
        const subtotal = price * item.quantity;
        totalAmount += subtotal;
        return {
          productId: item.productId,
          productName: product ? product.name : 'Unknown',
          productImage: product ? product.image : null, // Store image if available
          price,
          quantity: item.quantity,
          subtotal
        };
      });

      await addDoc(collection(db, "orders"), {
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail || '',
        customerPhone: newOrder.customerPhone || '',
        specialInstructions: newOrder.specialInstructions || '',
        items: validItems,
        totalAmount,
        status: 'pending',
        createdAt: serverTimestamp(),
        trackingToken: Math.random().toString(36).substring(2, 15) // Simple token generation
      });

      setIsAddModalOpen(false);
      setNewOrder({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        items: [{ productId: '', quantity: 1 }],
        specialInstructions: ''
      });
      showNotification('success', 'Order created successfully');
    } catch (err) {
      console.error(err);
      showNotification('error', err.message);
    }
  };

  // --- Filtering & Pagination ---

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === 'all' || order.status === filters.status;

    let matchesDate = true;
    if (filters.startDate && order.createdAt) {
      matchesDate = order.createdAt >= new Date(filters.startDate);
    }
    if (filters.endDate && order.createdAt) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59);
      matchesDate = matchesDate && order.createdAt <= end;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const paginatedOrders = filteredOrders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  // --- Helpers ---

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_the_way': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // --- Render Details View ---
  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <div className="animate-in fade-in slide-in-from-right-10 duration-500">
        <button
          onClick={() => setSelectedOrder(null)}
          className="flex items-center gap-2 text-[#ffd700] hover:text-[#ffed4e] mb-6 font-bold transition-transform hover:-translate-x-1"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Orders
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Info */}
          <div className="grid-cols-1 lg:col-span-1 space-y-6">
            <div className="bg-[#1a1612] p-6 rounded-xl border border-[#393528]">
              <h3 className="text-[#ffd700] font-bold text-xl mb-4 flex justify-between items-center">
                Order Info
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status.replace('_', ' ')}
                </span>
              </h3>
              <div className="space-y-4 text-[#e8dcc6]">
                <div className="flex justify-between border-b border-[#393528] pb-2">
                  <span className="text-[#8b7a63] font-bold uppercase text-xs">Order ID</span>
                  <span className="font-mono">#{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-[#393528] pb-2">
                  <span className="text-[#8b7a63] font-bold uppercase text-xs">Date</span>
                  <span>{selectedOrder.createdAt?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-[#393528] pb-2">
                  <span className="text-[#8b7a63] font-bold uppercase text-xs">Tracking Token</span>
                  <span className="font-mono text-xs">{selectedOrder.trackingToken || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1612] p-6 rounded-xl border border-[#393528]">
              <h3 className="text-[#ffd700] font-bold text-xl mb-4">Customer Details</h3>
              <div className="space-y-4 text-[#e8dcc6]">
                <div>
                  <span className="text-[#8b7a63] font-bold uppercase text-xs block mb-1">Name</span>
                  <div className="font-semibold text-lg">{selectedOrder.customerName}</div>
                </div>
                <div>
                  <span className="text-[#8b7a63] font-bold uppercase text-xs block mb-1">Contact</span>
                  <div>{selectedOrder.customerPhone || <span className="italic text-[#8b7a63]">No phone provided</span>}</div>
                  <div>{selectedOrder.customerEmail || <span className="italic text-[#8b7a63]">No email provided</span>}</div>
                </div>
                <div>
                  <span className="text-[#8b7a63] font-bold uppercase text-xs block mb-1">Delivery Address</span>
                  <div className="bg-[#2a2214] p-3 rounded border border-[#393528]">
                    {selectedOrder.deliveryAddress || <span className="italic text-[#8b7a63]">No address provided (Takeout/Pickup?)</span>}
                  </div>
                </div>
                {selectedOrder.specialInstructions && (
                  <div>
                    <span className="text-[#8b7a63] font-bold uppercase text-xs block mb-1">Special Instructions</span>
                    <div className="bg-[#2a2214] p-3 rounded border border-[#393528] text-orange-200 italic">
                      "{selectedOrder.specialInstructions}"
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-[#1a1612] p-6 rounded-xl border border-[#393528]">
              <h3 className="text-[#ffd700] font-bold text-xl mb-4">Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedOrder.status === 'pending' && (
                  <button onClick={() => handleUpdateStatus(selectedOrder.id, 'preparing')} className="col-span-2 p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">skillet</span> Start Preparing
                  </button>
                )}
                {selectedOrder.status === 'preparing' && (
                  <button onClick={() => handleUpdateStatus(selectedOrder.id, 'on_the_way')} className="col-span-2 p-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">delivery_dining</span> Mark On way
                  </button>
                )}
                {selectedOrder.status === 'on_the_way' && (
                  <button onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')} className="col-span-2 p-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">local_shipping</span> Mark Delivered
                  </button>
                )}
                {selectedOrder.status === 'delivered' && (
                  <button onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')} className="col-span-2 p-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span> Complete Order
                  </button>
                )}

                {selectedOrder.receiptImage ? (
                  <button onClick={() => setViewReceipt(selectedOrder.receiptImage)} className="p-3 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-[#ffed4e] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">receipt</span> Receipt
                  </button>
                ) : (
                  <button disabled className="p-3 bg-[#2a2214] text-[#8b7a63] font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">receipt</span> Receipt
                  </button>
                )}

                {selectedOrder.trackingToken ? (
                  <a href={`/track/${selectedOrder.trackingToken}`} target="_blank" rel="noreferrer" className="p-3 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-[#ffed4e] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">location_on</span> Track
                  </a>
                ) : (
                  <button disabled className="p-3 bg-[#2a2214] text-[#8b7a63] font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">location_off</span> Track
                  </button>
                )}

                <button onClick={() => handleDeleteOrder(selectedOrder.id)} className="col-span-2 p-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg mt-2 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">delete</span> Delete Order
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Items */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1612] rounded-xl border border-[#393528] overflow-hidden">
              <div className="p-6 border-b border-[#393528] flex justify-between items-center bg-[linear-gradient(135deg,#2a2214_0%,#1a1612_100%)]">
                <h3 className="text-[#ffd700] font-bold text-xl">Order Items</h3>
                <div className="text-right">
                  <div className="text-sm text-[#8b7a63] uppercase font-bold">Total Amount</div>
                  <div className="text-3xl font-bold text-[#ffd700]">₱{selectedOrder.totalAmount.toLocaleString()}</div>
                </div>
              </div>
              <div className="p-6">
                <table className="w-full text-left border-collapse">
                  <thead className="text-[#8b7a63] uppercase text-xs font-bold border-b border-[#393528]">
                    <tr>
                      <th className="py-3 px-2">Product</th>
                      <th className="py-3 px-2 text-right">Price</th>
                      <th className="py-3 px-2 text-center">Qty</th>
                      <th className="py-3 px-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#393528]">
                    {selectedOrder.items.map((item, idx) => {
                      const product = products.find(p => p.id === item.productId);
                      const name = item.productName || product?.name || 'Unknown Product';
                      const image = item.productImage || product?.image;

                      return (
                        <tr key={idx} className="hover:bg-[#2a2214] transition-colors">
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-4">
                              {image ? (
                                <img src={image} alt={name} className="w-16 h-16 rounded-lg object-cover border border-[#393528]" />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-[#2a2214] border border-[#393528] flex items-center justify-center text-2xl">🍔</div>
                              )}
                              <span className="font-bold text-[#e8dcc6] text-lg">{name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-right text-[#e8dcc6]">₱{item.price?.toLocaleString() || 0}</td>
                          <td className="py-4 px-2 text-center font-bold text-[#ffd700] text-lg">x{item.quantity}</td>
                          <td className="py-4 px-2 text-right font-bold text-[#e8dcc6]">₱{item.subtotal?.toLocaleString() || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full max-w-[1600px] mx-auto text-[#e8dcc6]">

      {/* Conditionally Render Details View or List View */}
      {selectedOrder ? (
        renderOrderDetails()
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#ffd700] pb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#ffd700] tracking-tight">Order Management</h1>
              <p className="text-[#8b7a63]">Track and manage customer orders in real-time.</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-[#ffd700] hover:bg-[#ffed4e] text-black px-4 py-2.5 rounded-lg font-bold shadow-[0_4px_15px_rgba(255,215,0,0.3)] transition-transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined">add_shopping_cart</span>
              New Order
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#1a1612] p-4 rounded-xl border border-[#393528]">
            <div className="relative col-span-1 md:col-span-2">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8b7a63]">search</span>
              <input
                type="text"
                placeholder="Search Order ID or Customer..."
                className="w-full pl-10 pr-4 py-2 bg-[#2a2214] border border-[#393528] rounded-lg text-[#e8dcc6] focus:border-[#ffd700] outline-none"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <select
              className="px-4 py-2 bg-[#2a2214] border border-[#393528] rounded-lg text-[#e8dcc6] focus:border-[#ffd700] outline-none"
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="on_the_way">On the Way</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="date"
              className="px-4 py-2 bg-[#2a2214] border border-[#393528] rounded-lg text-[#e8dcc6] focus:border-[#ffd700] outline-none"
              value={filters.startDate}
              onChange={e => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>

          {/* Orders Table */}
          <div className="bg-[#1a1612] rounded-xl border border-[#393528] overflow-hidden shadow-lg flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-[linear-gradient(135deg,#ffd700_0%,#ffed4e_100%)] text-black font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Delivery Address</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#393528]">
                  {loading ? (
                    <tr><td colSpan="8" className="p-8 text-center text-[#8b7a63]">Loading real-time orders...</td></tr>
                  ) : paginatedOrders.length === 0 ? (
                    <tr><td colSpan="8" className="p-8 text-center text-[#8b7a63]">No orders found matching filters.</td></tr>
                  ) : (
                    paginatedOrders.map(order => (
                      <tr key={order.id} className="hover:bg-[#2a2214] transition-colors">
                        <td className="px-6 py-4 text-sm font-mono text-[#ffd700]">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="hover:underline hover:text-[#ffed4e] font-bold text-left"
                            title="Click to view details"
                          >
                            #{order.id.slice(0, 6)}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#e8dcc6]">{order.createdAt?.toLocaleDateString()} <span className="text-xs text-[#8b7a63] block">{order.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#e8dcc6]">{order.customerName}</div>
                          <div className="text-xs text-[#8b7a63]">{order.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#e8dcc6] max-w-[200px] truncate" title={order.deliveryAddress || 'Not provided'}>
                          {order.deliveryAddress || <span className="text-[#8b7a63] italic">Not provided</span>}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#e8dcc6]">
                          {order.items.slice(0, 2).map((i, idx) => {
                            const product = products.find(p => p.id === i.productId);
                            const name = i.productName || product?.name || 'Unknown Product';
                            return <div key={idx}>{i.quantity}x {name}</div>
                          })}
                          {order.items.length > 2 && <span className="text-xs text-[#8b7a63]">+{order.items.length - 2} more...</span>}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#ffd700]">₱{order.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* 1. Workflow Button / Status Indicator */}
                            {order.status === 'pending' && (
                              <button onClick={() => handleUpdateStatus(order.id, 'preparing')} className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors w-[36px] h-[36px] flex items-center justify-center" title="Start Preparing">
                                <span className="material-symbols-outlined text-[20px]">skillet</span>
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button onClick={() => handleUpdateStatus(order.id, 'on_the_way')} className="p-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded-lg transition-colors w-[36px] h-[36px] flex items-center justify-center" title="Mark On The Way">
                                <span className="material-symbols-outlined text-[20px]">delivery_dining</span>
                              </button>
                            )}
                            {order.status === 'on_the_way' && (
                              <button onClick={() => handleUpdateStatus(order.id, 'delivered')} className="p-2 bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white rounded-lg transition-colors w-[36px] h-[36px] flex items-center justify-center" title="Mark Delivered">
                                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                              </button>
                            )}
                            {order.status === 'delivered' && (
                              <button onClick={() => handleUpdateStatus(order.id, 'completed')} className="p-2 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-lg transition-colors w-[36px] h-[36px] flex items-center justify-center" title="Complete Order">
                                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                              </button>
                            )}
                            {(order.status === 'completed' || order.status === 'cancelled') && (
                              <div className={`p-2 rounded-lg w-[36px] h-[36px] flex items-center justify-center cursor-default ${order.status === 'completed' ? 'bg-green-600/10 text-green-500' : 'bg-red-600/10 text-red-500'}`}>
                                <span className="material-symbols-outlined text-[20px]">{order.status === 'completed' ? 'done_all' : 'cancel'}</span>
                              </div>
                            )}

                            {/* 2. Tracking Button */}
                            {order.trackingToken ? (
                              <a
                                href={`/track/${order.trackingToken}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-[#ffd700]/20 text-[#ffd700] hover:bg-[#ffd700] hover:text-black rounded-lg transition-colors w-[36px] h-[36px] flex items-center justify-center"
                                title="View Tracking"
                              >
                                <span className="material-symbols-outlined text-[20px]">location_on</span>
                              </a>
                            ) : (
                              <div className="p-2 rounded-lg w-[36px] h-[36px] flex items-center justify-center opacity-20 cursor-not-allowed">
                                <span className="material-symbols-outlined text-[20px]">location_off</span>
                              </div>
                            )}

                            {/* 3. Receipt Button (With Placeholder) */}
                            {order.receiptImage ? (
                              <button onClick={() => setViewReceipt(order.receiptImage)} className="p-2 bg-[#ffd700]/20 text-[#ffd700] hover:bg-[#ffd700] hover:text-black rounded-lg transition-colors w-[36px] h-[36px] flex items-center justify-center" title="View Receipt">
                                <span className="material-symbols-outlined text-[20px]">receipt</span>
                              </button>
                            ) : (
                              <div className="p-2 rounded-lg w-[36px] h-[36px] flex items-center justify-center opacity-20 cursor-not-allowed">
                                <span className="material-symbols-outlined text-[20px]">receipt</span>
                              </div>
                            )}

                            {/* 4. Delete Button */}
                            <button onClick={() => handleDeleteOrder(order.id)} className="p-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors w-[36px] h-[36px] flex items-center justify-center" title="Delete Order">
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#393528] flex justify-between items-center text-sm text-[#8b7a63]">
              <span>Showing {paginatedOrders.length} of {filteredOrders.length} orders</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 border border-[#393528] rounded hover:bg-[#2a2214] disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 border border-[#393528] rounded hover:bg-[#2a2214] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- ADD MODAL (Only list view) --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1612] border border-[#ffd700] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#393528] flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#ffd700]">Create New Order</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#8b7a63] hover:text-[#e8dcc6] text-2xl">×</button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#ffd700] uppercase mb-1">Customer Name</label>
                  <input required type="text" className="w-full p-2 bg-[#2a2214] border border-[#393528] rounded text-[#e8dcc6] focus:border-[#ffd700]"
                    value={newOrder.customerName} onChange={e => setNewOrder({ ...newOrder, customerName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#ffd700] uppercase mb-1">Phone</label>
                  <input type="tel" className="w-full p-2 bg-[#2a2214] border border-[#393528] rounded text-[#e8dcc6] focus:border-[#ffd700]"
                    value={newOrder.customerPhone} onChange={e => setNewOrder({ ...newOrder, customerPhone: e.target.value })} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-[#ffd700] uppercase">Items</label>
                  <button type="button" onClick={() => setNewOrder({ ...newOrder, items: [...newOrder.items, { productId: '', quantity: 1 }] })} className="text-xs text-[#ffd700] hover:underline">+ Add Item</button>
                </div>
                {newOrder.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <select required className="flex-1 p-2 bg-[#2a2214] border border-[#393528] rounded text-[#e8dcc6]"
                      value={item.productId} onChange={e => {
                        const items = [...newOrder.items];
                        items[idx].productId = e.target.value;
                        setNewOrder({ ...newOrder, items });
                      }}>
                      <option value="">Select Product...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>)}
                    </select>
                    <input type="number" min="1" className="w-20 p-2 bg-[#2a2214] border border-[#393528] rounded text-[#e8dcc6]"
                      value={item.quantity} onChange={e => {
                        const items = [...newOrder.items];
                        items[idx].quantity = parseInt(e.target.value);
                        setNewOrder({ ...newOrder, items });
                      }} />
                    {newOrder.items.length > 1 && (
                      <button type="button" onClick={() => {
                        const items = newOrder.items.filter((_, i) => i !== idx);
                        setNewOrder({ ...newOrder, items });
                      }} className="text-red-500 px-2">×</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-[#8b7a63] hover:text-[#e8dcc6]">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#ffd700] hover:bg-[#ffed4e] text-black font-bold rounded shadow-[0_4px_15px_rgba(255,215,0,0.3)]">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RECEIPT MODAL --- */}
      {viewReceipt && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setViewReceipt(null)}>
          <img src={viewReceipt} alt="Receipt" className="max-w-full max-h-screen rounded shadow-2xl border-4 border-[#ffd700]" />
        </div>
      )}

      {/* Toast */}
      {notification && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl text-white font-bold animate-slideUp z-50 ${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {notification.message}
        </div>
      )}

    </div>
  );
};

export default OrdersReports;