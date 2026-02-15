import { Package, MapPin, AlertCircle, Users } from 'lucide-react';

const ActivityItem = ({ activity }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    found: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    resolved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    registered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  };

  const getIcon = () => {
    switch (activity.type) {
      case 'complaint':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'volunteer':
        return <Users className="w-5 h-5 text-yellow-500" />;
      default:
        return <Package className="w-5 h-5 text-saylani-green" />;
    }
  };

  const getTitle = () => {
    switch (activity.type) {
      case 'complaint':
        return activity.title;
      case 'volunteer':
        return `Volunteer: ${activity.eventName}`;
      default:
        return activity.title || activity.itemName;
    }
  };

  const getLocation = () => {
    return activity.location || 'No location specified';
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-smooth">
      <div className="p-2 bg-saylani-green/10 rounded-lg">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-800 dark:text-white truncate">
          {getTitle()}
        </h4>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{getLocation()}</span>
        </div>
      </div>

      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[activity.status] || statusColors.pending}`}>
        {activity.status || 'Pending'}
      </span>
    </div>
  );
};

export default ActivityItem;  