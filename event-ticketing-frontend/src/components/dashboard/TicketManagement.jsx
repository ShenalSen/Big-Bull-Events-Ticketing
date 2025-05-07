/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  TicketIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FunnelIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';
import QRScanner from '../tickets/QRScanner';
import ErrorBoundary from '../ErrorBoundary';

export default function TicketManagement() {
  // Add state for ticket management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    email: '',
    eventName: '',
    price: '',
    status: 'active'
  });
  const [allTickets, setAllTickets] = useState([]);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'purchaseDate',
    direction: 'desc'
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [showScanner, setShowScanner] = useState(false);

  // Add handlers
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/tickets/${searchQuery}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setSelectedTicket(response.data.ticket);
        toast.success('Ticket found!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to find ticket');
      setSelectedTicket(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClick = () => {
    setUpdateForm({
      email: selectedTicket.email,
      eventName: selectedTicket.eventName,
      price: selectedTicket.price,
      status: selectedTicket.status
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/tickets/${selectedTicket.id}`,
        updateForm,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setSelectedTicket(response.data.ticket);
        setIsUpdateModalOpen(false);
        toast.success('Ticket updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update ticket');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/tickets/${selectedTicket.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setSelectedTicket(null);
        toast.success('Ticket deleted successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete ticket');
    }
  };

  const handleShowAll = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:3000/api/tickets/list',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setAllTickets(response.data.tickets);
        setShowAllTickets(true);
        setSelectedTicket(null);
      }
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  const getSortedAndFilteredTickets = () => {
    let filtered = [...allTickets];
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }

    return filtered.sort((a, b) => {
      if (sortConfig.key === 'price') {
        return sortConfig.direction === 'asc' 
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    });
  };

  const handleTicketValidated = async (ticketId) => {
    setSearchQuery(ticketId);
    await handleSearch({ preventDefault: () => {} });
    setShowScanner(false);
  };

  return (
    <div className="space-y-6">
      {/* Terms and Guidelines Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 font-[Poppins]">
          Ticket Management Guidelines
        </h2>
        
        <div className="prose prose-invert max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Tickets Guidelines */}
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Search Tickets Guidelines
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Use ticket ID or email for precise search results</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Verify ticket authenticity before any actions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Check ticket status (active/used/cancelled)</span>
                </li>
              </ul>
            </div>

            {/* Validation Guidelines */}
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Ticket Validation Guidelines
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Scan QR code for quick validation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Check ticket expiry and event date</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Validate user identity if required</span>
                </li>
              </ul>
            </div>

            {/* Modification Guidelines */}
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Ticket Modification Guidelines
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Document reason for any ticket modifications</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Follow refund policy guidelines</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Notify users of any changes made</span>
                </li>
              </ul>
            </div>

            {/* Security Guidelines */}
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Security Guidelines
              </h3>
              <div className="text-gray-300 text-sm space-y-2">
                <p>All ticket operations are logged and monitored. Ensure compliance with security protocols and data protection regulations.</p>
                <p className="mt-2 text-yellow-400 font-medium">
                  Unauthorized ticket modifications are strictly prohibited and will result in immediate action.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mt-6 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-lg">
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="font-semibold text-indigo-400">Important:</span> These guidelines ensure fair and secure ticket management. Report any suspicious activities or system irregularities immediately. Regular system audits will be conducted to maintain integrity.
            </p>
          </div>
        </div>
      </div>

      {/* QR Scanner Section */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowScanner(!showScanner)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                   transition-colors flex items-center space-x-2"
        >
          <QrCodeIcon className="h-5 w-5" />
          <span>{showScanner ? 'Hide Scanner' : 'Scan QR Code'}</span>
        </button>
      </div>

      {/* Show Scanner or Search */}
      {showScanner ? (
        <ErrorBoundary>
          <QRScanner onValidated={handleTicketValidated} />
        </ErrorBoundary>
      ) : (
        /* Existing Search Section */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Find Ticket</h2>
          <div className="flex gap-4">
            <form onSubmit={handleSearch} className="flex gap-4 flex-1">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter ticket ID"
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
            <button
              onClick={handleShowAll}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>Show All</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* All Tickets Table */}
      {showAllTickets && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">All Tickets</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => handleFilter(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-1"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="used">Used</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-[480px] rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  {[
                    { key: 'id', label: 'Ticket ID' },
                    { key: 'email', label: 'Email' },
                    { key: 'eventName', label: 'Event' },
                    { key: 'price', label: 'Price' },
                    { key: 'status', label: 'Status' },
                    { key: 'purchaseDate', label: 'Purchase Date' }
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{label}</span>
                        {sortConfig.key === key && (
                          sortConfig.direction === 'asc' ? 
                            <ArrowUpIcon className="h-4 w-4" /> : 
                            <ArrowDownIcon className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {getSortedAndFilteredTickets().map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.eventName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">LKR {ticket.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${ticket.status === 'active' ? 'bg-green-100 text-green-800' : 
                          ticket.status === 'used' ? 'bg-gray-100 text-gray-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(ticket.purchaseDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowAllTickets(false);
                        }}
                        className="text-indigo-400 hover:text-indigo-300 mr-4"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Ticket Details */}
      {selectedTicket && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Ticket Details</h2>
            <div className="flex space-x-3">
              <button
                onClick={handleUpdateClick}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <PencilSquareIcon className="h-5 w-5" />
                <span>Update</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <TrashIcon className="h-5 w-5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <TicketIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-200">ID: {selectedTicket.id}</span>
              </div>
              <div className="flex items-center space-x-3">
                <UserGroupIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-200">Email: {selectedTicket.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-200">Price: LKR {selectedTicket.price}</span>
              </div>
              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-200">
                  Purchased: {new Date(selectedTicket.purchaseDate).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative border border-gray-700"
          >
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">Update Ticket</h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={updateForm.email}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={updateForm.eventName}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, eventName: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={updateForm.price}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="used">Used</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Update Ticket
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}