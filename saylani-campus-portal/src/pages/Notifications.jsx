import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const deleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <TopBar title="Notifications" subtitle="View all your notifications" />

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-800 dark:text-white">
                All Notifications
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {notifications.length} total notifications
              </p>
            </div>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-spinner"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-smooth"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-heading font-bold text-gray-800 dark:text-white mb-2">
                        {notif.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{getTimeAgo(notif.createdAt)}</span>
                        {notif.category && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            {notif.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-gray-800 dark:text-white mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You'll see notifications here when there are updates
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;