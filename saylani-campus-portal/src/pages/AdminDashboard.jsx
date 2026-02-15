import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertCircle, Package, Shield } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [activeTab, setActiveTab] = useState('complaints');

  useEffect(() => {
    // Listen to all users
    const usersQuery = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    // Listen to all complaints
    const complaintsQuery = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
    const unsubComplaints = onSnapshot(complaintsQuery, (snapshot) => {
      const complaintsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(complaintsData);
    });

    // Listen to all lost items
    const lostItemsQuery = query(collection(db, 'lost_found_items'), orderBy('createdAt', 'desc'));
    const unsubLostItems = onSnapshot(lostItemsQuery, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLostItems(itemsData);
    });

    // Listen to all volunteers
    const volunteersQuery = query(collection(db, 'volunteers'), orderBy('createdAt', 'desc'));
    const unsubVolunteers = onSnapshot(volunteersQuery, (snapshot) => {
      const volunteersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVolunteers(volunteersData);
    });

    return () => {
      unsubUsers();
      unsubComplaints();
      unsubLostItems();
      unsubVolunteers();
    };
  }, []);

  const updateComplaintStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'complaints', id), { status });
      toast.success('Status updated successfully!');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const updateItemStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'lost_found_items', id), { status });
      toast.success('Status updated successfully!');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const stats = [
    { title: 'Total Users', value: users.length, icon: Users, color: 'blue' },
    { title: 'Open Complaints', value: complaints.filter(c => c.status !== 'resolved').length, icon: AlertCircle, color: 'red' },
    { title: 'Lost Items Pending', value: lostItems.filter(i => i.status === 'pending').length, icon: Package, color: 'yellow' },
    { title: 'Active Volunteers', value: volunteers.length, icon: Users, color: 'green' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <TopBar title="Admin Dashboard" subtitle="Manage all campus portal activities" />

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl ${
                    stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                    stat.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      stat.color === 'red' ? 'text-red-600 dark:text-red-400' :
                      stat.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                </div>
                <h3 className="text-3xl font-heading font-bold text-gray-800 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                {['complaints', 'lostItems', 'volunteers'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-4 font-heading font-semibold transition-smooth ${
                      activeTab === tab
                        ? 'text-saylani-blue border-b-2 border-saylani-blue bg-saylani-blue/5'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    {tab === 'complaints' && 'Complaints Management'}
                    {tab === 'lostItems' && 'Lost & Found Items'}
                    {tab === 'volunteers' && 'Volunteer List'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Complaints Tab */}
              {activeTab === 'complaints' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-bold text-gray-800 dark:text-white mb-4">
                    All Complaints
                  </h3>
                  {complaints.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">ID</th>
                            <th className="text-left py-3 px-4 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Title</th>
                            <th className="text-left py-3 px-4 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Category</th>
                            <th className="text-left py-3 px-4 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Location</th>
                            <th className="text-left py-3 px-4 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {complaints.map((complaint) => (
                            <tr key={complaint.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {complaint.id.slice(0, 8)}...
                              </td>
                              <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-white">
                                {complaint.title}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {complaint.category}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {complaint.location}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  complaint.status === 'resolved' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : complaint.status === 'in-progress'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                  {complaint.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={complaint.status}
                                  onChange={(e) => updateComplaintStatus(complaint.id, e.target.value)}
                                  className="px-2 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                >
                                  <option value="submitted">Submitted</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="resolved">Resolved</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">No complaints found</p>
                  )}
                </div>
              )}

              {/* Lost Items Tab */}
              {activeTab === 'lostItems' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-bold text-gray-800 dark:text-white mb-4">
                    All Lost & Found Items
                  </h3>
                  {lostItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {lostItems.map((item) => (
                        <div key={item.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          {item.image && (
                            <img src={item.image} alt={item.itemName} className="w-full h-32 object-cover rounded-lg mb-3" />
                          )}
                          <h4 className="font-heading font-bold text-gray-800 dark:text-white mb-2">
                            {item.itemName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {item.location}
                          </p>
                          <select
                            value={item.status}
                            onChange={(e) => updateItemStatus(item.id, e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                          >
                            <option value="pending">Pending</option>
                            <option value="found">Found</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">No items found</p>
                  )}
                </div>
              )}

              {/* Volunteers Tab */}
              {activeTab === 'volunteers' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-bold text-gray-800 dark:text-white mb-4">
                    Registered Volunteers
                  </h3>
                  {volunteers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Event</th>
                            <th className="text-left py-3 px-4 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Availability</th>
                            <th className="text-left py-3 px-4 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Contact</th>
                            <th className="text-left py-3 px-4 text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Skills</th>
                          </tr>
                        </thead>
                        <tbody>
                          {volunteers.map((volunteer) => (
                            <tr key={volunteer.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                              <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-white">
                                {volunteer.name}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {volunteer.eventName}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {volunteer.availability}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {volunteer.contactNumber}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {volunteer.skills}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">No volunteers registered</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;