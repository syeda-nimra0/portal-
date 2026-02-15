import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertTriangle, Wifi, Zap, Droplet, Wrench } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const Complaints = () => {
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Internet',
    description: '',
    location: '',
    urgency: 'medium'
  });

  const categories = [
    { value: 'Internet', icon: Wifi, label: 'Internet' },
    { value: 'Electricity', icon: Zap, label: 'Electricity' },
    { value: 'Water', icon: Droplet, label: 'Water' },
    { value: 'Maintenance', icon: Wrench, label: 'Maintenance' }
  ];

  useEffect(() => {
    if (!currentUser) return;

    const complaintsQuery = query(
      collection(db, 'complaints'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(complaintsQuery, (snapshot) => {
      const complaintsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComplaints(complaintsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'complaints'), {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: 'submitted',
        createdAt: new Date().toISOString()
      });

      toast.success('Complaint submitted successfully! 🎉');
      setShowForm(false);
      setFormData({
        title: '',
        category: 'Internet',
        description: '',
        location: '',
        urgency: 'medium'
      });
    } catch (error) {
      toast.error('Failed to submit complaint');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : AlertTriangle;
  };

  const statusColors = {
    submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  };

  const urgencyColors = {
    low: 'border-green-500',
    medium: 'border-yellow-500',
    high: 'border-red-500'
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <TopBar title="Complaints" subtitle="Submit and track your complaints" />

        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 md:mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-heading font-bold text-gray-800 dark:text-white">
                My Complaints
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Total: {complaints.length} complaints</p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-saylani-green to-saylani-blue text-white font-heading font-semibold rounded-lg md:rounded-xl hover:shadow-lg transition-smooth text-sm md:text-base w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Submit Complaint
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {complaints.map((complaint) => {
              const Icon = getCategoryIcon(complaint.category);
              
              return (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-smooth border-l-4 ${urgencyColors[complaint.urgency]}`}
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      <div className="p-2 md:p-3 bg-saylani-blue/10 rounded-lg md:rounded-xl flex-shrink-0">
                        <Icon className="w-4 h-4 md:w-6 md:h-6 text-saylani-blue" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading font-bold text-base md:text-lg text-gray-800 dark:text-white truncate">
                          {complaint.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          {complaint.category}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[complaint.status]}`}>
                      {complaint.status}
                    </span>
                  </div>

                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 md:mb-4 break-words">
                    {complaint.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs md:text-sm">
                    <span className="text-gray-600 dark:text-gray-400 break-words">
                      📍 {complaint.location}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      complaint.urgency === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      complaint.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {complaint.urgency} urgency
                    </span>
                  </div>

                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                    Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {complaints.length === 0 && (
            <div className="text-center py-12 md:py-20">
              <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-heading font-bold text-gray-800 dark:text-white mb-2">
                No complaints submitted yet
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
                Have an issue? Let us know!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 md:px-6 py-2.5 md:py-3 bg-saylani-blue text-white font-semibold rounded-lg md:rounded-xl hover:shadow-lg transition-smooth text-sm md:text-base"
              >
                Submit Complaint
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl md:text-2xl font-heading font-bold text-gray-800 dark:text-white mb-4 md:mb-6">
              Submit Complaint
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                  Complaint Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm md:text-base"
                  placeholder="Brief title of the issue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-smooth ${
                        formData.category === cat.value
                          ? 'border-saylani-blue bg-saylani-blue/10'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <cat.icon className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-1.5 md:mb-2 ${
                        formData.category === cat.value ? 'text-saylani-blue' : 'text-gray-500'
                      }`} />
                      <div className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                        {cat.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm md:text-base"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm md:text-base"
                  placeholder="e.g., Room 305, Lab 2"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
                  Urgency
                </label>
                <div className="flex gap-2 md:gap-3">
                  {['low', 'medium', 'high'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: level })}
                      className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl font-medium capitalize transition-smooth text-sm md:text-base ${
                        formData.urgency === level
                          ? level === 'high' ? 'bg-red-500 text-white' :
                            level === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 md:py-3 px-3 md:px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg md:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 md:py-3 px-3 md:px-4 bg-gradient-to-r from-saylani-green to-saylani-blue text-white font-semibold rounded-lg md:rounded-xl hover:shadow-lg transition-smooth disabled:opacity-50 text-sm md:text-base"
                >
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Complaints;