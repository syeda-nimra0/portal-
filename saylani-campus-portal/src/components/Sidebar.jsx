import { NavLink } from 'react-router-dom';
import { Home, Search, AlertCircle, Users, Bell, Shield, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/saylani-logo.png';
const Sidebar = () => {
  const { userRole } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/lost-and-found', icon: Search, label: 'Lost & Found' },
    { path: '/complaints', icon: AlertCircle, label: 'Complaints' },
    { path: '/volunteers', icon: Users, label: 'Volunteers' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  if (userRole === 'admin') {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin Panel' });
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12  flex items-center justify-center">
                   <img 
  src= {logo}
  alt="Saylani Logo" 
  className="w-32 h-32 object-contain"
/>
          </div>
          <div>
            <h2 className="font-heading font-bold text-gray-800 dark:text-white">
              Saylani
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">Mass IT Hub</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth ${
                  isActive
                    ? 'bg-gradient-to-r from-saylani-green to-saylani-blue text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;