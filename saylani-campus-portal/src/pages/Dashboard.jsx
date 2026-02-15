import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Users,
  Package,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import ActivityItem from '../components/ActivityItem';
import NotificationPanel from '../components/NotificationPanel';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    lostReports: 0,
    activeComplaints: 0,
    itemsMatched: 0,
    eventsRegistered: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // Listen to lost and found items
    const lostFoundQuery = query(
      collection(db, 'lost_found_items'),
      where('userId', '==', currentUser.uid)
    );
    
    const unsubscribeLostFound = onSnapshot(lostFoundQuery, (snapshot) => {
      setStats(prev => ({ ...prev, lostReports: snapshot.size }));
    });

    // Listen to complaints
    const complaintsQuery = query(
      collection(db, 'complaints'),
      where('userId', '==', currentUser.uid),
      where('status', '!=', 'resolved')
    );
    
    const unsubscribeComplaints = onSnapshot(complaintsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, activeComplaints: snapshot.size }));
    });

    // Listen to volunteers
    const volunteersQuery = query(
      collection(db, 'volunteers'),
      where('userId', '==', currentUser.uid)
    );
    
    const unsubscribeVolunteers = onSnapshot(volunteersQuery, (snapshot) => {
      setStats(prev => ({ ...prev, eventsRegistered: snapshot.size }));
    });

    // Get recent activity
    const activityQuery = query(
      collection(db, 'lost_found_items'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    
    const unsubscribeActivity = onSnapshot(activityQuery, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentActivity(activities);
    });

    return () => {
      unsubscribeLostFound();
      unsubscribeComplaints();
      unsubscribeVolunteers();
      unsubscribeActivity();
    };
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-800 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-content">
                Welcome back, {currentUser?.email?.split('@')[0]}!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-smooth"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-smooth"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-smooth text-red-500"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Search}
              title="Lost Reports"
              value={stats.lostReports}
              color="blue"
              trend="+12%"
            />
            <StatCard
              icon={AlertCircle}
              title="Active Complaints"
              value={stats.activeComplaints}
              color="red"
              trend="-5%"
            />
            <StatCard
              icon={CheckCircle}
              title="Items Matched"
              value={stats.itemsMatched}
              color="green"
              trend="+8%"
            />
            <StatCard
              icon={Users}
              title="Events Registered"
              value={stats.eventsRegistered}
              color="yellow"
              trend="+15%"
            />
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-heading font-semibold text-gray-800 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/lost-and-found')}
                className="p-4 bg-gradient-to-br from-saylani-green to-saylani-green-light text-white rounded-xl hover:shadow-lg transition-smooth text-left"
              >
                <Package className="w-6 h-6 mb-2" />
                <div className="font-heading font-semibold">Report Lost Item</div>
                <div className="text-sm opacity-90">Post a lost or found item</div>
              </button>

              <button
                onClick={() => navigate('/complaints')}
                className="p-4 bg-gradient-to-br from-saylani-blue to-saylani-blue-light text-white rounded-xl hover:shadow-lg transition-smooth text-left"
              >
                <AlertCircle className="w-6 h-6 mb-2" />
                <div className="font-heading font-semibold">Submit Complaint</div>
                <div className="text-sm opacity-90">Report an issue</div>
              </button>

              <button
                onClick={() => navigate('/volunteers')}
                className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-smooth text-left"
              >
                <Users className="w-6 h-6 mb-2" />
                <div className="font-heading font-semibold">Register for Event</div>
                <div className="text-sm opacity-90">Volunteer opportunities</div>
              </button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-heading font-semibold text-gray-800 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent activity
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default Dashboard;