import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import LogoBigBull from '../../assets/Logo-Big-Bull.png';
import { UserIcon } from '@heroicons/react/24/outline';

// Dummy event data
const events = [
  {
    id: 1,
    name: "Summer Music Festival 2025",
    description: "Experience the ultimate music festival featuring top artists from around the world.",
    date: "2025-06-15",
    thumbnail: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    venue: "Central Park Arena",
    price: "$99"
  },
  {
    id: 2,
    name: "Tech Conference 2025",
    description: "Join industry leaders for the biggest tech conference of the year.",
    date: "2025-07-20",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    venue: "Innovation Center",
    price: "$149"
  },
  {
    id: 3,
    name: "Food & Wine Festival",
    description: "Taste exquisite cuisines and fine wines from renowned chefs.",
    date: "2025-08-05",
    thumbnail: "https://images.unsplash.com/photo-1555244162-803834f70033",
    venue: "Riverside Gardens",
    price: "$75"
  },
  {
    id: 4,
    name: "Comedy Night Special",
    description: "An evening of laughter with top stand-up comedians.",
    date: "2025-08-15",
    thumbnail: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca",
    venue: "Laugh Factory",
    price: "$45"
  },
  {
    id: 5,
    name: "Sports Championship Finals",
    description: "Witness the ultimate showdown in this year's championship finale.",
    date: "2025-09-01",
    thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
    venue: "Sports Complex",
    price: "$120"
  }
];

// Add this new event data after the existing events array
const availableEvent = {
  id: 6,
  name: "Annual Rock Festival 2025",
  description: "Get ready for the biggest rock festival of the year featuring legendary bands and emerging artists. Experience an unforgettable night of music, energy, and pure rock!",
  date: "2025-05-15",
  thumbnail: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
  venue: "MetroRock Arena",
  price: "LKR 4500",
  availableSeats: 250,
  category: "Music"
};

// Add this constant at the top of the file with other data
const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    title: "Orchestra Performance"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    title: "Rock Concert"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
    title: "Dance Festival"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1531058020387-3be344556be6",
    title: "Jazz Night"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1549451371-64aa98a6f660",
    title: "Theater Show"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f",
    title: "Food Festival"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
    title: "Art Exhibition"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    title: "Fashion Show"
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
    title: "Film Festival"
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc",
    title: "Sports Event"
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1472653431158-6364773b2a56",
    title: "Poetry Night"
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    title: "Music Festival"
  },
  {
    id: 13,
    url: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d",
    title: "Cultural Festival"
  },
  {
    id: 14,
    url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
    title: "Comedy Show"
  },
  {
    id: 15,
    url: "https://images.unsplash.com/photo-1741851374674-e4b7e573a9e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Street Festival"
  },
  {
    id: 16,
    url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14",
    title: "Opera Night"
  },
  {
    id: 17,
    url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    title: "Summer Festival"
  },
  {
    id: 18,
    url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec",
    title: "DJ Party"
  }
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out'
    });

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 2000); // Change story every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={LogoBigBull} 
                alt="Big Bull Events Logo" 
                className="h-14 w-auto" 
                data-aos="fade-right"
              />
              <h1 className="text-3xl font-bold text-white font-[Poppins]" data-aos="fade-down">
                BigBull Events
              </h1>
            </div>

            {/* User Profile & Logout */}
            <div className="relative group">
              <button
                className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-700/50 
                          hover:bg-gray-700 transition-colors duration-200"
              >
                <UserIcon className="h-6 w-6 text-gray-300" />
                <span className="text-gray-300 font-medium">
                  {JSON.parse(localStorage.getItem('userData'))?.username || 'User'}
                </span>
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
          </div>
        </div>
      </header>

      {/* Main Title*/}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-white font-[Poppins]" data-aos="fade-right">
          Our Upcoming Events
        </h2>
      </div>    

      {/* Event Stories Section */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" data-aos="fade-up">
        <div className="bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-xl rounded-lg border border-gray-700">
          <div className="relative h-[400px]">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentIndex}
                initial={{ x: 1000, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -1000, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0"
              >
                <div className="relative h-full">
                  <img
                    src={events[currentIndex].thumbnail}
                    alt={events[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-10 right-0 p-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">{events[currentIndex].name}</h2>
                    <p className="mb-2">{events[currentIndex].description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-75">📍 {events[currentIndex].venue}</p>
                        <p className="text-sm opacity-75">📅 {events[currentIndex].date}</p>
                      </div>
                      <p className="text-xl font-bold">{events[currentIndex].price}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Story Progress Indicators */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-2 px-4">
              {events.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === currentIndex ? 'bg-white w-16' : 'bg-white/50 w-8'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Available Event Section */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8" data-aos="fade-up">
        <h2 className="text-2xl font-semibold text-white font-[Poppins] mb-8">
          Available Events
        </h2>
        
        <div className="bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-xl rounded-lg border border-gray-700">
          <div className="relative h-[410px]">
            <div className="relative h-full">
              <img
                src={availableEvent.thumbnail}
                alt={availableEvent.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="max-w-3xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-3 py-1 bg-red-500 rounded-full text-sm font-semibold">
                      {availableEvent.category}
                    </span>
                    <span className="px-3 py-1 bg-green-500 rounded-full text-sm font-semibold">
                      {availableEvent.availableSeats} seats left
                    </span>
                  </div>
                  
                  <h2 className="text-4xl font-bold mb-4">{availableEvent.name}</h2>
                  <p className="text-lg mb-6 opacity-90">{availableEvent.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                      <p className="flex items-center text-lg">
                        <span className="mr-2">📍</span> {availableEvent.venue}
                      </p>
                      <p className="flex items-center text-lg">
                        <span className="mr-2">📅</span> {availableEvent.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm uppercase opacity-75">Starting from</p>
                      <p className="text-3xl font-bold">{availableEvent.price}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/buytickets`)}
                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 
                             text-white font-semibold rounded-lg text-lg transition-colors 
                             duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Buy Tickets</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Gallery Section */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-white font-[Poppins] mb-8" data-aos="fade-right">
          Event Highlights
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id} 
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-800 cursor-pointer border border-gray-700"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img
                src={image.url}
                alt={image.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-semibold truncate font-[Poppins]">
                    {image.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-[Poppins]">Event Ticketing</h3>
              <p className="text-gray-400 text-sm">
                Your one-stop destination for all event tickets. Experience the best events with us.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-[Poppins]">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-[Poppins]">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/refund" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-[Poppins]">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.819-.26.819-.578 0-.284-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.333-1.755-1.333-1.755-1.09-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">📧 support@info.bigbullticketing.com</p>
                <p className="text-gray-400 text-sm">📞 +94 11 234 5678</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
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