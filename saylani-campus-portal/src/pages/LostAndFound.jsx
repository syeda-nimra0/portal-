import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, MapPin, Calendar, Image as ImageIcon, Edit, Trash2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const LostAndFound = () => {
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Electronics',
    description: '',
    location: '',
    type: 'lost',
    image: null
  });

  const categories = ['Electronics', 'Wallets', 'Keys', 'Books', 'Clothing', 'Other'];

  useEffect(() => {
    if (!currentUser) return;

    const itemsQuery = query(
      collection(db, 'lost_found_items'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      category: 'Electronics',
      description: '',
      location: '',
      type: 'lost',
      image: null
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      category: item.category,
      description: item.description,
      location: item.location,
      type: item.type,
      image: null
    });
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      if (item.image) {
        try {
          const imageRef = ref(storage, item.image);
          await deleteObject(imageRef);
        } catch (error) {
          console.log('Image already deleted or not found');
        }
      }

      await deleteDoc(doc(db, 'lost_found_items', item.id));
      toast.success('Item deleted successfully! 🗑️');
    } catch (error) {
      toast.error('Failed to delete item');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingItem?.image || '';
      
      if (formData.image) {
        const imageRef = ref(storage, `lost_found/${Date.now()}_${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (editingItem) {
        await updateDoc(doc(db, 'lost_found_items', editingItem.id), {
          itemName: formData.itemName,
          category: formData.category,
          description: formData.description,
          location: formData.location,
          type: formData.type,
          image: imageUrl,
          updatedAt: new Date().toISOString()
        });
        toast.success('Item updated successfully! ✏️');
      } else {
        await addDoc(collection(db, 'lost_found_items'), {
          ...formData,
          image: imageUrl,
          userId: currentUser.uid,
          userEmail: currentUser.email,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        toast.success('Item reported successfully! 🎉');
      }

      resetForm();
    } catch (error) {
      toast.error(editingItem ? 'Failed to update item' : 'Failed to report item');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (itemId, newStatus) => {
    try {
      await updateDoc(doc(db, 'lost_found_items', itemId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success('Status updated!');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <TopBar title="Lost & Found" subtitle="Report and track lost or found items" />

        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 md:mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-gray-800 dark:text-white">
                My Reports
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Total: {items.length} items</p>
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-saylani-green to-saylani-blue text-white font-heading font-semibold rounded-lg md:rounded-xl hover:shadow-lg transition-smooth text-sm md:text-base w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Report Lost Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg hover:shadow-xl transition-smooth"
                >
                  {item.image && (
                    <div className="mb-3 md:mb-4 rounded-lg md:rounded-xl overflow-hidden h-36 md:h-48">
                      <img 
                        src={item.image} 
                        alt={item.itemName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
                    <h3 className="font-heading font-bold text-base md:text-lg text-gray-800 dark:text-white break-words flex-1">
                      {item.itemName}
                    </h3>
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      item.type === 'lost' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {item.type}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 line-clamp-2 break-words">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm mb-3 md:mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                      <span className="break-words">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                      <span className="break-words">{item.location}</span>
                    </div>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className="w-full px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs md:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="found">Found</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-smooth text-xs md:text-sm"
                    >
                      <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-smooth text-xs md:text-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {items.length === 0 && (
            <div className="text-center py-12 md:py-20">
              <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-heading font-bold text-gray-800 dark:text-white mb-2">
                No items reported yet
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
                Start by reporting a lost or found item
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 md:px-6 py-2.5 md:py-3 bg-saylani-blue text-white font-semibold rounded-lg md:rounded-xl hover:shadow-lg transition-smooth text-sm md:text-base"
              >
                Report Item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-heading font-bold text-gray-800 dark:text-white">
                  {editingItem ? 'Edit Item' : 'Report Lost Item'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm md:text-base"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm md:text-base"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm md:text-base"
                    >
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm md:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm md:text-base"
                    placeholder="e.g., Library, Cafeteria"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Upload Image {editingItem && '(Leave empty to keep current image)'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg md:rounded-xl p-4 md:p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <ImageIcon className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        {formData.image ? formData.image.name : 'Click to upload image'}
                      </p>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2.5 md:py-3 px-3 md:px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg md:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 md:py-3 px-3 md:px-4 bg-gradient-to-r from-saylani-green to-saylani-blue text-white font-semibold rounded-lg md:rounded-xl hover:shadow-lg transition-smooth disabled:opacity-50 text-sm md:text-base"
                  >
                    {loading ? (editingItem ? 'Updating...' : 'Submitting...') : (editingItem ? 'Update Item' : 'Submit Report')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LostAndFound;