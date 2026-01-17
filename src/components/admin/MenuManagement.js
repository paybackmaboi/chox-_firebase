import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';

import AlertModal from './AlertModal';

const MenuManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [notification, setNotification] = useState(null);

    // Alert Modal State
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const showAlert = (title, message, type = 'info') => {
        setAlertState({ isOpen: true, title, message, type });
    };

    const closeAlert = () => {
        setAlertState({ ...alertState, isOpen: false });
    };

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'mains',
        description: '',
        image: '',
        popular: false
    });

    const categories = [
        { id: 'appetizers', name: 'Appetizers' },
        { id: 'mains', name: 'Main Courses' },
        { id: 'desserts', name: 'Desserts' },
        { id: 'beverages', name: 'Beverages' }
    ];

    // Real-time listener
    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("name"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(items);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    // Image Compression Helper
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Resize to max width 800px
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Compress to JPEG at 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB Limit before compression
            showAlert("File Too Large", "Please select an image under 5MB.", "warning");
            return;
        }

        try {
            setLoading(true); // Show loading while compressing
            const compressedBase64 = await compressImage(file);

            // Check if string is too large for Firestore (approx 1MB limit ~ 1048576 bytes)
            if (compressedBase64.length > 1000000) {
                showAlert("Compression Failed", "Image is still too large after compression. Please prefer a smaller image.", "error");
                setLoading(false);
                return;
            }

            setFormData({ ...formData, image: compressedBase64 });
            setLoading(false);
        } catch (error) {
            console.error("Error compressing image:", error);
            showAlert("Error", "Failed to process image.", "error");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                updatedAt: serverTimestamp()
            };

            if (editingProduct) {
                await updateDoc(doc(db, "products", editingProduct.id), payload);
                showNotification('success', 'Product updated successfully');
            } else {
                await addDoc(collection(db, "products"), {
                    ...payload,
                    createdAt: serverTimestamp()
                });
                showNotification('success', 'Product created successfully');
            }
            closeModal();
        } catch (error) {
            console.error(error);
            showNotification('error', 'Operation failed');
        }
    };

    const handleDelete = (id) => {
        setAlertState({
            isOpen: true,
            title: "Delete Item?",
            message: "Are you sure you want to delete this menu item? This action cannot be undone.",
            type: 'confirm',
            onConfirm: () => confirmDelete(id)
        });
    };

    const confirmDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "products", id));
            showNotification('success', 'Product deleted');
        } catch (error) {
            console.error(error);
            showNotification('error', 'Delete failed');
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description || '',
            image: product.image || '',
            popular: product.popular || false
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            category: 'mains',
            description: '',
            image: '',
            popular: false
        });
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full max-w-[1600px] mx-auto text-[#e8dcc6]">

            {/* Header */}
            <div className="flex justify-between items-end border-b border-[#ffd700] pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#ffd700] tracking-tight">Menu Management</h1>
                    <p className="text-[#8b7a63]">Add, edit, and organize your menu items.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#ffd700] hover:bg-[#ffed4e] text-black px-4 py-2.5 rounded-lg font-bold shadow-[0_4px_15px_rgba(255,215,0,0.3)] transition-transform hover:-translate-y-0.5"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add Item
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center p-12 text-[#8b7a63]">Loading menu items...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-[#1a1612] border border-[#393528] rounded-xl overflow-hidden group hover:border-[#ffd700] transition-colors">
                            <div className="relative w-full aspect-square bg-[#2a2214]">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-[#393528]">🍽️</div>
                                )}
                                {product.popular && (
                                    <span className="absolute top-2 right-2 bg-[#ffd700] text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                        POPULAR
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-[#ffd700] truncate">{product.name}</h3>
                                    <span className="text-[#e8dcc6] font-mono">₱{product.price}</span>
                                </div>
                                <p className="text-xs text-[#8b7a63] uppercase font-bold mb-2">{product.category}</p>
                                <p className="text-sm text-[#e8dcc6] line-clamp-2 h-10 mb-4">{product.description}</p>

                                <div className="flex gap-2 mt-auto">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="flex-1 py-2 bg-[#2a2214] border border-[#393528] rounded hover:bg-[#393528] text-[#e8dcc6] transition-colors flex items-center justify-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex-1 py-2 bg-red-900/20 border border-red-900/40 rounded hover:bg-red-900/40 text-red-500 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1a1612] border border-[#ffd700] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeInUp">
                        <div className="p-6 border-b border-[#393528] flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[#ffd700]">{editingProduct ? 'Edit Item' : 'New Item'}</h2>
                            <button onClick={closeModal} className="text-[#8b7a63] hover:text-[#e8dcc6] text-2xl">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-[#ffd700] uppercase mb-1">Item Name</label>
                                <input required type="text" className="w-full p-2 bg-[#2a2214] border border-[#393528] rounded text-[#e8dcc6] focus:border-[#ffd700]"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#ffd700] uppercase mb-1">Price</label>
                                    <input required type="number" step="0.01" className="w-full p-2 bg-[#2a2214] border border-[#393528] rounded text-[#e8dcc6] focus:border-[#ffd700]"
                                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#ffd700] uppercase mb-1">Category</label>
                                    <select className="w-full p-2 bg-[#2a2214] border border-[#393528] rounded text-[#e8dcc6] focus:border-[#ffd700]"
                                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#ffd700] uppercase mb-1">Description</label>
                                <textarea className="w-full p-2 bg-[#2a2214] border border-[#393528] rounded text-[#e8dcc6] focus:border-[#ffd700] h-24"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#ffd700] uppercase mb-1">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full p-2 bg-[#2a2214] border border-[#393528] rounded text-[#e8dcc6] focus:border-[#ffd700]"
                                />
                                {formData.image && (
                                    <div className="mt-2 relative inline-block">
                                        <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover rounded border border-[#393528]" />
                                        <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">×</button>
                                    </div>
                                )}
                                <p className="text-[10px] text-[#8b7a63] mt-1">Images are automatically compressed to fit database limits.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="popular" className="w-4 h-4 accent-[#ffd700]"
                                    checked={formData.popular} onChange={e => setFormData({ ...formData, popular: e.target.checked })} />
                                <label htmlFor="popular" className="text-[#e8dcc6]">Mark as Popular Item</label>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-[#8b7a63] hover:text-[#e8dcc6]">Cancel</button>
                                <button type="submit" disabled={loading} className="px-6 py-2 bg-[#ffd700] hover:bg-[#ffed4e] text-black font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed">
                                    {loading ? 'Processing...' : (editingProduct ? 'Save Changes' : 'Create Item')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl text-white font-bold animate-slideUp z-50 ${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
                    {notification.message}
                </div>
            )}

            {/* Alert Modal */}
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

export default MenuManagement;
