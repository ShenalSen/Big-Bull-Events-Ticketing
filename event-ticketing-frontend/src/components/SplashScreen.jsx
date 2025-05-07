/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingVideo from '../assets/Lading-video.mp4';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after 7 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 7000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          className="absolute w-full h-full object-cover opacity-50"
        >
          <source src={LandingVideo} type="video/mp4" />
        </video>

        {/* Content Overlay */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: '-100%' }}
          transition={{ 
            duration: 1,
            delay: 6, // Start rolling up animation after 6 seconds
            ease: "easeInOut" 
          }}
          className="relative z-10 h-full flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}