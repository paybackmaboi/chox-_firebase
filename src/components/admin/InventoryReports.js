import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import './AdminReports.css';

const InventoryReports = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State (Client-side pagination for Firestore)
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 30;
  
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: 'pcs',
    minStockLevel: 0,
    supplier: '',
  });
  
  const supplyCategories = [
    'Appetizers',
    'Main Courses',
    'Desserts',
    'Beverages',
  ];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      // Connect to "inventory" collection in Firestore
      const querySnapshot = await getDocs(collection(db, "inventory"));
      
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setInventory(items);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch inventory from Firebase');
    } finally {
      setLoading(false);
    }
  };

  // --- Filtering & Pagination Logic ---
  const getFilteredInventory = () => {
    if (searchTerm.trim() === '') {
      return inventory;
    }
    return inventory.filter(item => {
      const name = item.name ? item.name.toLowerCase() : '';
      const category = item.category ? item.category.toLowerCase() : '';
      const term = searchTerm.toLowerCase();
      return name.includes(term) || category.includes(term);
    });
  };

  const filteredItems = getFilteredInventory();
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (page - 1) * ITEMS_PER_PAGE, 
    page * ITEMS_PER_PAGE
  );

  // --- Actions ---

  const handleAddQuantity = async (id, currentQuantity) => {
    const quantityStr = prompt('Enter quantity to add:');
    if (!quantityStr) return;
    
    const quantityToAdd = parseFloat(quantityStr);
    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      alert("Please enter a valid number");
      return;
    }

    if (!window.confirm(`Add ${quantityToAdd} to this item?`)) return;

    try {
      const itemRef = doc(db, "inventory", id);
      const newQuantity = parseFloat(currentQuantity || 0) + quantityToAdd;
      
      await updateDoc(itemRef, {
        quantity: newQuantity
      });

      // Update local state immediately for better UX
      setInventory(prev => prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
      
    } catch (err) {
      console.error(err);
      alert('Error updating inventory');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, "inventory", id));
      
      // Update local state
      setInventory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, "inventory"), {
        name: formData.name,
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        minStockLevel: parseFloat(formData.minStockLevel),
        supplier: formData.supplier,
        createdAt: new Date()
      });

      setShowModal(false);
      fetchInventory(); // Refresh list
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        quantity: 0,
        unit: 'pcs',
        minStockLevel: 0,
        supplier: '',
      });
    } catch (err) {
      console.error(err);
      alert('Error adding inventory item');
    }
  };

  const isLowStock = (item) => {
    return parseFloat(item.quantity || 0) < parseFloat(item.minStockLevel || 0);
  };

  return (
    <div className="admin-reports">
      <div className="reports-header">
        <h1>Inventory Reports</h1>
        <button onClick={() => setShowModal(true)} className="add-button">
          + Add Supply
        </button>
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading Inventory...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="table-scroll-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Min Level</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className={isLowStock(item) ? 'low-stock' : ''}
                >
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>{item.minStockLevel} {item.unit}</td>
                  <td>{item.supplier || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleAddQuantity(item.id, item.quantity)}
                        className="add-btn"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-cards">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className={`mobile-card ${isLowStock(item) ? 'low-stock' : ''}`}
              >
                <div className="mobile-card-header">
                  <h3 className="mobile-card-title">{item.name}</h3>
                  <span className={`mobile-card-status ${isLowStock(item) ? 'low' : 'normal'}`}>
                    {isLowStock(item) ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
                <div className="mobile-card-body">
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Category</span>
                    <span className="mobile-card-value">{item.category}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Quantity</span>
                    <span className="mobile-card-value">{item.quantity} {item.unit}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Min Level</span>
                    <span className="mobile-card-value">{item.minStockLevel} {item.unit}</span>
                  </div>
                  <div className="mobile-card-row">
                    <span className="mobile-card-label">Supplier</span>
                    <span className="mobile-card-value">{item.supplier || '-'}</span>
                  </div>
                </div>
                <div className="mobile-card-actions">
                  <button
                    onClick={() => handleAddQuantity(item.id, item.quantity)}
                    className="add-btn"
                  >
                    Add Quantity
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete-btn"
                  >
                    Delete
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

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Supply</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Chicken Breast"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {supplyCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    placeholder="pcs, kg, lbs, etc."
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Min Stock Level</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                    required
                  />
                  <div className="form-hint">You'll be alerted when stock drops below this.</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Supplier</label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-buttons form-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add Supply</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryReports;