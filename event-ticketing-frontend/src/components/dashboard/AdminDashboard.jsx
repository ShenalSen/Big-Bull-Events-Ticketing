import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LogoBigBull from '../../assets/Logo-Big-Bull.png';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import TicketManagement from './TicketManagement';
import { 
  UserGroupIcon, 
  TicketIcon, 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';


export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const navigationItems = [
    {
      name: 'User Management',
      icon: UserGroupIcon,
      key: 'users',
    },
    {
      name: 'Ticket Management',
      icon: TicketIcon,
      key: 'tickets',
    }
  ];

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-4">
              <img 
                src={LogoBigBull} 
                alt="Big Bull Events Logo" 
                className="h-10 w-auto" 
              />
              <h1 className="text-2xl font-bold text-white font-[Poppins]">
                BigBull Events
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors duration-200
                      ${activeTab === item.key 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>

              {/* User Profile & Logout */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-700/50 
                            hover:bg-gray-700 transition-colors duration-200"
                >
                  <UserIcon className="h-6 w-6 text-gray-300" />
                  <span className="text-gray-300 font-medium">Admin</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl 
                              border border-gray-700 opacity-0 invisible group-hover:opacity-100 
                              group-hover:visible transition-all duration-200">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 
                              hover:text-white transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={toggleNav}
                  className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                >
                  {isNavOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-700"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setIsNavOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-md flex items-center space-x-2 transition-colors duration-200
                      ${activeTab === item.key 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'users' ? (
              <UserManagement />
            ) : (
              <TicketManagement />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Big Bull Events. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Designed & Developed by <span className="text-indigo-400">CODACIT TECHNOLOGIES</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// User Management Component
function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    name: '',
    isActive: true
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setSelectedUser(response.data.user);
        setUpdateForm({
          name: response.data.user.name,
          isActive: response.data.user.isActive
        });
        toast.success('User found!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to find user');
      setSelectedUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/${selectedUser._id}`,
        updateForm,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('User updated successfully!');
        setSelectedUser(response.data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Terms and Guidelines Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 font-[Poppins]">
          Administrator Guidelines & Terms of Use
        </h2>
        
        <div className="prose prose-invert max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Guidelines */}
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Search User Guidelines
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Enter the user's exact ID for precise results</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Ensure proper authorization before accessing user data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Maintain user privacy and data confidentiality</span>
                </li>
              </ul>
            </div>

            {/* Update Guidelines */}
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Update User Guidelines
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Verify information accuracy before updating</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Document all significant account changes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Follow company policies for account status changes</span>
                </li>
              </ul>
            </div>

            {/* Delete Guidelines */}
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Delete User Guidelines
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Deletion is permanent and cannot be undone</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Verify user has no active tickets or pending transactions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Obtain necessary approvals before deletion</span>
                </li>
              </ul>
            </div>

            {/* Legal Notice */}
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Legal Notice
              </h3>
              <div className="text-gray-300 text-sm space-y-2">
                <p>All actions performed by administrators are logged and monitored. Unauthorized access or modifications may result in disciplinary action.</p>
                <p className="mt-2 text-yellow-400 font-medium">
                  Please ensure compliance with data protection regulations and company policies.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mt-6 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-lg">
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="font-semibold text-indigo-400">Note:</span> These guidelines are designed to maintain data integrity and user privacy. Any violations should be reported to the system administrator immediately. Regular audits will be conducted to ensure compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Find User</h2>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter user ID"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* User Details & Update Form */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Update User</h2>
          
          {/* User Info Card */}
          <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-200">Username: {selectedUser.username}</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-200">Email: {selectedUser.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-200">
                  Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Update Form */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={updateForm.name}
                onChange={(e) => setUpdateForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={updateForm.isActive}
                    onChange={() => setUpdateForm(prev => ({ ...prev, isActive: true }))}
                    className="form-radio text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-gray-700 border-gray-600"
                  />
                  <span className="text-gray-300">Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={!updateForm.isActive}
                    onChange={() => setUpdateForm(prev => ({ ...prev, isActive: false }))}
                    className="form-radio text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-gray-700 border-gray-600"
                  />
                  <span className="text-gray-300">Inactive</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Update User
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}