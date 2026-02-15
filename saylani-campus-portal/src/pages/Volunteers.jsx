import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const Volunteers = () => {
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    eventName: '',
    availability: '',
    skills: '',
    contactNumber: ''
  });

  useEffect(() => {
    if (!currentUser) return;

    const volunteersQuery = query(
      collection(db, 'volunteers'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(volunteersQuery, (snapshot) => {
      const volunteersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegistrations(volunteersData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'volunteers'), {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: 'registered',
        createdAt: new Date().toISOString()
      });

      toast.success('Registration submitted successfully! 🎉');
      setShowForm(false);
      setFormData({
        name: '',
        eventName: '',
        availability: '',
        skills: '',
        contactNumber: ''
      });
    } catch (error) {
      toast.error('Failed to register');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <TopBar title="Volunteer" subtitle="Register for campus events and activities" />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-800 dark:text-white">
                My Registrations
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Total: {registrations.length} events</p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saylani-green to-saylani-blue text-white font-heading font-semibold rounded-xl hover:shadow-lg transition-smooth"
            >
              <Plus className="w-5 h-5" />
              Register for Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((registration) => (
              <motion.div
                key={registration.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-smooth"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                    <Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Registered
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-gray-800 dark:text-white mb-2">
                  {registration.eventName}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{registration.availability}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span>{registration.skills}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Contact: {registration.contactNumber}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Registered: {new Date(registration.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {registrations.length === 0 && (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-gray-800 dark:text-white mb-2">
                No registrations yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Be part of something great! Register for an event
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-saylani-blue text-white font-semibold rounded-xl hover:shadow-lg transition-smooth"
              >
                Register Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Registration Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-heading font-bold text-gray-800 dark:text-white mb-6">
              Volunteer Registration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="Full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="e.g., Community Cleanup, Tech Workshop"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Availability
                </label>
                <input
                  type="text"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="e.g., Weekends, Evenings"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills/Interests
                </label>
                <textarea
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="What skills can you contribute?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="+92 XXX XXXXXXX"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-saylani-green to-saylani-blue text-white font-semibold rounded-xl hover:shadow-lg transition-smooth disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Volunteers;