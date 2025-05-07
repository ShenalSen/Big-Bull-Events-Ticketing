import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function BuyTickets() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [ticketData, setTicketData] = useState({
    quantity: 1,
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const [authToken] = useState(localStorage.getItem('token'));

  const event = {
    name: "Annual Rock Festival 2025",
    date: "2025-05-15",
    time: "19:00",
    venue: "MetroRock Arena",
    price: 4500,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      };

      const response = await axios.post(
        'http://localhost:3000/api/tickets/generate',
        {
          email: ticketData.email,
          eventName: event.name,
          price: event.price * ticketData.quantity
        },
        config
      );

      if (response.data.success) {
        setGeneratedTicket(response.data.ticket);
        toast.success('Ticket purchased successfully!');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(`Failed to process payment: ${error.response?.data?.message || 'Unknown error occurred'}`);
        console.error('Payment processing error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {generatedTicket ? (
          <TicketDetails 
            ticket={generatedTicket} 
            onBackToDashboard={() => navigate('/dashboard')} 
          />
        ) : (
          <>
            {/* Event Header */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4 font-[Poppins]">
                Purchase Tickets
              </h2>
              <div className="h-1 w-24 bg-indigo-600 mx-auto rounded-full"></div>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-indigo-600' : 'bg-gray-700'
                } text-white font-bold`}>1</div>
                <div className={`w-24 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-700'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-indigo-600' : 'bg-gray-700'
                } text-white font-bold`}>2</div>
                <div className={`w-24 h-1 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-700'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-indigo-600' : 'bg-gray-700'
                } text-white font-bold`}>3</div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl mb-8">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src={event.image} 
                    alt={event.name}
                    className="h-48 w-full object-cover md:h-full"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="text-2xl font-bold text-white mb-2">{event.name}</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>📅 Date: {event.date}</p>
                    <p>⏰ Time: {event.time}</p>
                    <p>📍 Venue: {event.venue}</p>
                    <p className="text-xl font-bold text-white">Price: LKR {event.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Steps */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Select Tickets</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Number of Tickets
                    </label>
                    <select
                      name="quantity"
                      value={ticketData.quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white py-2 px-3"
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={ticketData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={ticketData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={ticketData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={handleBack}
                      className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Payment Information</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={ticketData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={ticketData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={ticketData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 pt-6">
                    <div className="text-white mb-4">
                      <h4 className="font-semibold mb-2">Order Summary</h4>
                      <div className="flex justify-between">
                        <span>Tickets ({ticketData.quantity})</span>
                        <span>LKR {event.price * ticketData.quantity}</span>
                      </div>
                      <div className="flex justify-between font-bold mt-2">
                        <span>Total</span>
                        <span>LKR {event.price * ticketData.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={handleBack}
                      className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Complete Purchase
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const TicketDetails = ({ ticket, onBackToDashboard }) => {
  const handleDownloadTicket = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Changed from authToken
        },
        responseType: 'blob'
      };

      const response = await axios.get(
        `http://localhost:3000/api/tickets/${ticket.id}/pdf`,
        config
      );

      // Check if the response is actually a blob
      if (response.data.type && response.data.type.includes('application/json')) {
        // If it's JSON, it's probably an error message
        const reader = new FileReader();
        reader.onload = () => {
          const error = JSON.parse(reader.result);
          toast.error(error.message || 'Failed to generate ticket');
        };
        reader.readAsText(response.data);
        return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket_${ticket.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Ticket downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.response?.data?.message || 'Failed to download ticket');
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 mt-8 border border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-6">Ticket Purchase Successful!</h3>
      <div className="space-y-4 text-gray-300">
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="font-medium">Ticket ID:</span>
          <span className="text-white">{ticket.id}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="font-medium">Event:</span>
          <span className="text-white">{ticket.eventName}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="font-medium">Email:</span>
          <span className="text-white">{ticket.email}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="font-medium">Price:</span>
          <span className="text-white">LKR {ticket.price}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="font-medium">Purchase Date:</span>
          <span className="text-white">
            {new Date(ticket.purchaseDate).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handleDownloadTicket}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Download Ticket
        </button>
        <button
          onClick={onBackToDashboard}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};