import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import AlertModal from './AlertModal';

// ==========================================
// --- MAIN PARENT COMPONENT ---
// ==========================================
const InventoryReports = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Alert State
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
  });

  const showAlert = (title, message, type = 'info') => {
    setAlertState({ isOpen: true, title, message, type, onConfirm: null });
  };

  const closeAlert = () => {
    setAlertState({ ...alertState, isOpen: false });
  };

  // Fetch Inventory Data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInventoryItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching inventory: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Logs Data from Firestore
  useEffect(() => {
    const q = query(collection(db, "inventory_logs"), orderBy("createdAt", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(fetchedLogs);
    }, (error) => {
      console.error("Error fetching logs: ", error);
    });

    return () => unsubscribe();
  }, []);

  // Handlers
  const handleStockIn = async (newItem) => {
    try {
      await addDoc(collection(db, "inventory"), {
        ...newItem,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Log the Stock In action
      await addDoc(collection(db, "inventory_logs"), {
        itemName: newItem.name,
        action: 'Stock In',
        change: `+ ${newItem.quantity} ${newItem.unit}`,
        reason: 'New Stock',
        notes: newItem.notes || 'Manual Entry',
        user: 'Admin',
        createdAt: serverTimestamp()
      });

      showAlert("Success", "Stock added successfully!", "success");
    } catch (error) {
      console.error("Error adding document: ", error);
      showAlert("Error", "Error adding stock: " + error.message, "error");
    }
  };

  const handleStockOut = async (itemId, quantityUsed, reason, notes) => {
    try {
      const itemRef = doc(db, "inventory", itemId);
      const item = inventoryItems.find(i => i.id === itemId);
      if (!item) return;

      const newQuantity = parseFloat(item.quantity) - parseFloat(quantityUsed);

      await updateDoc(itemRef, {
        quantity: newQuantity,
        updatedAt: serverTimestamp()
      });

      // Log the Stock Out action
      await addDoc(collection(db, "inventory_logs"), {
        itemId,
        itemName: item.name,
        action: 'Stock Out',
        change: `- ${quantityUsed} ${item.unit}`,
        reason,
        notes,
        user: 'Admin',
        createdAt: serverTimestamp()
      });

      showAlert("Success", "Stock updated successfully!", "success");

    } catch (error) {
      console.error("Error updating stock: ", error);
      showAlert("Error", "Error updating stock: " + error.message, "error");
    }
  };

  const handleDeleteItem = (itemId) => {
    setAlertState({
      isOpen: true,
      title: "Delete Inventory Item?",
      message: "Are you sure you want to delete this item? This action cannot be undone.",
      type: 'confirm',
      onConfirm: () => confirmDelete(itemId)
    });
  };

  const confirmDelete = async (itemId) => {
    try {
      await deleteDoc(doc(db, "inventory", itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      showAlert("Error", "Error deleting item: " + error.message, "error");
    }
  };

  // Top Menu Items
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'soup_kitchen' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'inventory', label: 'Inventory', icon: 'inventory_2' },
    { id: 'logs', label: 'Logs', icon: 'receipt_long' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="w-full flex flex-col font-sans text-[#e8dcc6]">

      {/* Top Navigation Bar */}
      <div className="bg-[#1a1612] border-b border-[#393528]/50 p-4 mb-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-xl font-bold text-[#ffd700] tracking-wide uppercase">Restaurant Manager</h1>
            <p className="text-xs text-[#8b7a63]">Inventory & Operations</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium border ${activeTab === item.id
                ? 'bg-[#ffd700]/10 border-[#ffd700] text-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                : 'bg-transparent border-transparent text-[#8b7a63] hover:text-[#e8dcc6] hover:bg-white/5'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 animate-in fade-in duration-500">
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && <DashboardView inventoryItems={inventoryItems} />}

        {/* VIEW 2: KITCHEN OVERVIEW */}
        {activeTab === 'overview' && <KitchenOverview inventoryItems={inventoryItems} />}

        {/* VIEW 3: INVENTORY */}
        {activeTab === 'inventory' && (
          <InventoryView
            inventoryItems={inventoryItems}
            onStockIn={handleStockIn}
            onStockOut={handleStockOut}
            onDelete={handleDeleteItem}
            loading={loading}
            showAlert={showAlert}
          />
        )}

        {/* VIEW 4: LOGS */}
        {activeTab === 'logs' && <LogsView logs={logs} />}

        {/* VIEW 5: SETTINGS */}
        {activeTab === 'settings' && <SettingsView />}
      </div>

      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onConfirm={alertState.onConfirm}
      />
    </div>
  );
};

// ==========================================
// --- VIEW: SETTINGS ---
// ==========================================
const SettingsView = () => {
  const [currentSubTab, setCurrentSubTab] = useState('users');

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-2 border-b border-[#393528] pb-4">
        <h1 className="text-3xl font-bold text-[#e8dcc6]">Settings</h1>
        <p className="text-[#8b7a63]">Configure your kitchen preferences, staff access, and data management.</p>
      </div>

      <div className="border-b border-[#393528]">
        <div className="flex gap-8 overflow-x-auto no-scrollbar">
          <SettingsTabButton
            active={currentSubTab === 'users'}
            onClick={() => setCurrentSubTab('users')}
            label="User Management"
            icon="group"
          />
          <SettingsTabButton
            active={currentSubTab === 'categories'}
            onClick={() => setCurrentSubTab('categories')}
            label="Inventory Categories"
            icon="category"
          />
          <SettingsTabButton
            active={currentSubTab === 'units'}
            onClick={() => setCurrentSubTab('units')}
            label="Measurement Units"
            icon="straighten"
          />
        </div>
      </div>

      <div className="bg-[#1a1612] rounded-2xl border border-[#393528] shadow-lg overflow-hidden">
        {currentSubTab === 'users' ? (
          <div className="flex flex-col">
            <div className="p-6 border-b border-[#393528] flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-[#ffd700]">Team Members</h3>
                <p className="text-sm text-[#8b7a63]">Manage access roles for kitchen staff and administrators.</p>
              </div>
              <button className="h-10 px-4 rounded-lg bg-gradient-to-r from-[#ffd700] to-[#b8860b] text-black font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 shadow-[0_4px_15px_rgba(255,215,0,0.3)]">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                Invite Staff
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#12110e] text-xs font-bold uppercase text-[#8b7a63] tracking-wider border-b border-[#393528]">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Last Activity</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#393528]">
                  <SettingsUserRow name="Sarah Jenkins" email="s.jenkins@foodos.com" role="Admin" status="Active" last="Just now" initials="SJ" color="gold" />
                  <SettingsUserRow name="Michael Chen" email="m.chen@foodos.com" role="Chef" status="Active" last="2 hours ago" initials="MC" color="blue" />
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-center gap-4">
            <span className="material-symbols-outlined text-6xl text-[#393528]">construction</span>
            <div className="max-w-xs">
              <h3 className="text-lg font-bold text-[#8b7a63]">Section Under Development</h3>
              <p className="text-sm text-[#8b7a63] opacity-60">We're building the interface for managing {currentSubTab}.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// --- VIEW: LOGS (AUDIT TRAIL) ---
// ==========================================
const LogsView = ({ logs = [] }) => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#393528] pb-4">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-[#e8dcc6] text-3xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-[#8b7a63] text-base">Track all inventory movements, usage, wastage, and manual adjustments.</p>
        </div>
        <button className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-[#2a2214] border border-[#393528] hover:border-[#ffd700] text-[#ffd700] text-sm font-bold shadow-sm transition-all">
          <span className="material-symbols-outlined text-[20px]">download</span>
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-[#1a1612] rounded-xl shadow-sm border border-[#393528] overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#12110e] border-b border-[#393528]">
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#ffd700] whitespace-nowrap">Time</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#ffd700] whitespace-nowrap">Item Name</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#ffd700] whitespace-nowrap">Action</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#ffd700] whitespace-nowrap text-right">Change</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#ffd700] whitespace-nowrap">User</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#ffd700] whitespace-nowrap">Reason / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#393528]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#8b7a63]">No logs found. Start adding or using stock!</td>
                </tr>
              ) : (
                logs.map(log => {
                  let type = 'stock-in';
                  if (log.action === 'Stock Out') type = 'used';
                  if (log.reason === 'waste') type = 'wastage';

                  return (
                    <LogRow
                      key={log.id}
                      time={log.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      date={log.createdAt?.toDate().toLocaleDateString()}
                      item={log.itemName}
                      action={log.action}
                      change={log.change}
                      user={log.user}
                      note={log.notes}
                      type={type}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// --- VIEW: INVENTORY ---
// ==========================================
const InventoryView = ({ inventoryItems, onStockIn, onStockOut, onDelete, loading, showAlert }) => {
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);
  const [selectedItemForOut, setSelectedItemForOut] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleStockOutClick = (item) => {
    setSelectedItemForOut(item);
    setIsStockOutOpen(true);
  };

  const categories = ['All', 'Produce', 'Dairy', 'Meat', 'Pantry', 'Beverage', 'Packing Materials'];

  const filteredItems = selectedCategory === 'All'
    ? inventoryItems
    : inventoryItems.filter(item => item.category === selectedCategory);

  return (
    <>
      <div className="max-w-[1400px] mx-auto pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-[#393528] pb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#e8dcc6]">Inventory Master List</h1>
            <p className="text-sm text-[#8b7a63] mt-1">Manage stock levels, expiry dates, and procurement.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-3 pr-8 py-2 text-sm border border-[#393528] rounded-lg bg-[#1a1612] text-[#e8dcc6] focus:ring-1 focus:ring-[#ffd700] outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button
              onClick={() => setIsStockInOpen(true)}
              className="flex items-center gap-2 bg-[#ffd700] hover:bg-[#ffed4e] text-black px-4 py-2 rounded-lg font-bold text-sm shadow-[0_4px_15px_rgba(255,215,0,0.3)] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">add</span> Add Item
            </button>
          </div>
        </div>

        <div className="bg-[#1a1612] border border-[#393528] rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-[#12110e] border-b-2 border-[#393528] sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#ffd700] border-r border-[#393528] w-32">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#ffd700] border-r border-[#393528] min-w-[240px]">Item Name</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#ffd700] border-r border-[#393528] w-48">Category</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#ffd700] border-r border-[#393528] w-48">Stock Level</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#ffd700] border-r border-[#393528] w-48">Expiry</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#ffd700] border-r border-[#393528] w-32 text-right">Unit Cost</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#ffd700] w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#393528] text-sm">
                {loading ? (
                  <tr><td colSpan="7" className="p-8 text-center text-[#8b7a63]">Loading inventory...</td></tr>
                ) : filteredItems.length === 0 ? (
                  <tr><td colSpan="7" className="p-8 text-center text-[#8b7a63]">No inventory items found.</td></tr>
                ) : (
                  filteredItems.map((item) => (
                    <InventoryItemRow
                      key={item.id}
                      item={item}
                      onStockOut={handleStockOutClick}
                      onDelete={onDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {isStockInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1612] w-full max-w-lg rounded-2xl border border-[#ffd700] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-[#393528] flex justify-between items-center bg-[#12110e]">
              <h3 className="text-xl font-bold text-[#ffd700]">Add New Inventory Item</h3>
              <button
                onClick={() => setIsStockInOpen(false)}
                className="text-[#8b7a63] hover:text-[#e8dcc6] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newItem = {
                name: formData.get('name'),
                category: formData.get('category'),
                quantity: parseFloat(formData.get('quantity')),
                unit: formData.get('unit'),
                minStockLevel: parseFloat(formData.get('minStockLevel')),
                expiry: formData.get('expiry'),
                cost: parseFloat(formData.get('cost')),
                notes: formData.get('notes')
              };
              onStockIn(newItem);
              setIsStockInOpen(false);
            }} className="p-6 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-1">Item Name</label>
                  <input name="name" required className="w-full bg-[#2a2214] border border-[#393528] rounded-lg p-3 text-[#e8dcc6] focus:border-[#ffd700] outline-none" placeholder="e.g., Angus Beef Patty" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-1">Category</label>
                  <select name="category" className="w-full bg-[#2a2214] border border-[#393528] rounded-lg p-3 text-[#e8dcc6] focus:border-[#ffd700] outline-none">
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-1">Unit</label>
                  <input name="unit" required className="w-full bg-[#2a2214] border border-[#393528] rounded-lg p-3 text-[#e8dcc6] focus:border-[#ffd700] outline-none" placeholder="e.g., kg, pcs, packs" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-1">Initial Qty</label>
                  <input name="quantity" type="number" step="0.01" required className="w-full bg-[#2a2214] border border-[#393528] rounded-lg p-3 text-[#e8dcc6] focus:border-[#ffd700] outline-none" placeholder="0.00" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-1">Unit Cost ($)</label>
                  <input name="cost" type="number" step="0.01" className="w-full bg-[#2a2214] border border-[#393528] rounded-lg p-3 text-[#e8dcc6] focus:border-[#ffd700] outline-none" placeholder="0.00" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-1">Min Stock Level</label>
                  <input name="minStockLevel" type="number" defaultValue="5" className="w-full bg-[#2a2214] border border-[#393528] rounded-lg p-3 text-[#e8dcc6] focus:border-[#ffd700] outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-1">Expiry Date</label>
                  <input name="expiry" type="date" className="w-full bg-[#2a2214] border border-[#393528] rounded-lg p-3 text-[#e8dcc6] focus:border-[#ffd700] outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-1">Notes</label>
                  <textarea name="notes" rows="2" className="w-full bg-[#2a2214] border border-[#393528] rounded-lg p-3 text-[#e8dcc6] focus:border-[#ffd700] outline-none" placeholder="Optional notes..."></textarea>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsStockInOpen(false)} className="flex-1 py-3 bg-[#2a2214] text-[#8b7a63] font-bold rounded-xl hover:bg-[#393528] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#ffd700] text-[#1a1612] font-bold rounded-xl hover:bg-[#ffed4e] shadow-lg shadow-yellow-500/20 transition-colors">Add to Inventory</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// ==========================================
// --- VIEW: DASHBOARD ---
// ==========================================
const DashboardView = ({ inventoryItems = [] }) => {
  const lowStockCount = inventoryItems.filter(i => i.quantity <= (i.minStockLevel || 5)).length;
  const totalValue = inventoryItems.reduce((acc, item) => acc + (parseFloat(item.cost || 0) * parseFloat(item.quantity || 0)), 0).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[#e8dcc6] tracking-tight text-3xl font-bold leading-tight">Dashboard</h1>
          <p className="text-[#8b7a63] text-sm font-normal">Kitchen Operations Command Center</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 px-4 rounded-lg border border-[#393528] bg-[#1a1612] text-sm font-medium text-[#ffd700] gap-2">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span><span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget title="Total Value" value={`$${totalValue}`} icon="paid" theme="gold" />
        <StatWidget title="Low Stock" value={`${lowStockCount} Items`} icon="warning" theme={lowStockCount > 0 ? 'red' : 'green'} />
      </div>
    </div>
  )
};

// ==========================================
// --- VIEW: KITCHEN OVERVIEW ---
// ==========================================
const KitchenOverview = ({ inventoryItems = [] }) => (
  <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#393528]">
      <div>
        <h2 className="text-2xl font-bold text-[#e8dcc6]">Kitchen Overview</h2>
        <p className="text-[#8b7a63] text-sm mt-1 flex items-center gap-2">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
          System Operational
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatWidget title="Total Items" value={inventoryItems.length} icon="inventory_2" theme="blue" />
    </div>
  </div>
);


// ==========================================
// --- HELPER COMPONENTS ---
// ==========================================

const StatWidget = ({ title, value, icon, theme }) => {
  const colors = {
    gold: 'text-[#ffd700] bg-[#ffd700]/10 border-[#ffd700]',
    red: 'text-red-500 bg-red-500/10 border-red-500',
    green: 'text-green-500 bg-green-500/10 border-green-500',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500',
    default: 'text-[#e8dcc6] bg-[#393528]/50 border-[#393528]'
  }
  const colorClass = colors[theme] || colors.default;

  return (
    <div className={`p-6 rounded-xl border ${colorClass.split(' ')[2]} ${colorClass.split(' ')[1]} flex items-center gap-4`}>
      <div className={`p-3 rounded-full border ${colorClass} bg-transparent`}>
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider opacity-70 mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

const SettingsTabButton = ({ active, label, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 pb-4 pt-2 border-b-2 transition-all whitespace-nowrap ${active
      ? 'border-[#ffd700] text-[#ffd700] font-bold'
      : 'border-transparent text-[#8b7a63] hover:text-[#ffd700] hover:border-[#ffd700]/30'
      }`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const SettingsUserRow = ({ name, email, role, status, last, initials, color }) => (
  <tr className="group hover:bg-[#2a2214] transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[#12110e] flex items-center justify-center text-xs font-bold border border-[#393528] text-[#ffd700]">{initials}</div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[#e8dcc6]">{name}</span>
          <span className="text-xs text-[#8b7a63]">{email}</span>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-[#ffd700]/20 text-[#ffd700]">{role}</span>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
        <span className="text-sm font-medium text-[#e8dcc6]">{status}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-[#8b7a63]">{last}</td>
    <td className="px-6 py-4 text-right">
      <span className="text-[#8b7a63] hover:text-[#ffd700] cursor-pointer material-symbols-outlined">edit</span>
    </td>
  </tr>
)

const LogRow = ({ time, date, item, action, change, user, note, type }) => {
  let colorClass = 'text-[#e8dcc6]';
  if (type === 'stock-in') colorClass = 'text-green-400';
  if (type === 'wastage') colorClass = 'text-red-400';
  if (type === 'used') colorClass = 'text-orange-400';

  return (
    <tr className="hover:bg-[#2a2214] transition-colors border-b border-[#393528]/50 last:border-0">
      <td className="py-4 px-6 text-sm text-[#8b7a63] whitespace-nowrap">{time} <span className="text-xs opacity-50 ml-1">{date}</span></td>
      <td className="py-4 px-6 text-sm font-bold text-[#e8dcc6]">{item}</td>
      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">{action}</td>
      <td className={`py-4 px-6 text-sm font-bold text-right font-mono ${colorClass}`}>{change}</td>
      <td className="py-4 px-6 text-sm text-[#e8dcc6]">{user}</td>
      <td className="py-4 px-6 text-sm text-[#8b7a63] italic">{note}</td>
    </tr>
  );
};

const InventoryItemRow = ({ item, onStockOut, onDelete }) => {
  const { name, category, quantity, unit, minStockLevel, expiry, cost } = item;

  let status = "In Stock";
  let statusColor = "bg-green-500";

  if (parseFloat(quantity) <= 0) {
    status = "Out";
    statusColor = "bg-red-500";
  } else if (parseFloat(quantity) <= (parseFloat(minStockLevel) || 5)) {
    status = "Low";
    statusColor = "bg-amber-500";
  }

  return (
    <tr className="group hover:bg-[#2a2214] border-b border-[#393528]/50 last:border-0 transition-colors">
      <td className="px-4 py-3 border-r border-[#393528]/30"><div className="flex items-center gap-2"><span className={`flex h-2 w-2 rounded-full ${statusColor}`}></span><span className="font-medium text-[#e8dcc6]">{status}</span></div></td>
      <td className="px-4 py-3 border-r border-[#393528]/30 font-bold text-[#e8dcc6]">{name}</td>
      <td className="px-4 py-3 border-r border-[#393528]/30 text-[#8b7a63]">{category}</td>
      <td className="px-4 py-3 border-r border-[#393528]/30 font-mono text-[#ffd700]">{quantity} {unit}</td>
      <td className="px-4 py-3 border-r border-[#393528]/30 text-[#8b7a63]">{expiry || "-"}</td>
      <td className="px-4 py-3 border-r border-[#393528]/30 text-right font-mono text-[#e8dcc6]">${cost || "0.00"}</td>
      <td className="px-4 py-3 text-center">
        <button onClick={() => onStockOut(item)} className="text-[#ffd700] hover:text-white material-symbols-outlined text-[18px] mr-2" title="Stock Out">remove_circle</button>
        <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-400 material-symbols-outlined text-[18px]" title="Delete">delete</button>
      </td>
    </tr>
  );
};

export default InventoryReports;