import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, color, trend }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-orange-500'
  };

  const iconBgClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-smooth"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${
            trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend}
          </span>
        )}
      </div>
      
      <h3 className="text-3xl font-heading font-bold text-gray-800 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-content">
        {title}
      </p>
    </motion.div>
  );
};

export default StatCard;