/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'; // Add useRef here
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  QrCodeIcon,
  PlayIcon,
  StopIcon,
  CheckCircleIcon,
  XCircleIcon,
  TicketIcon
} from '@heroicons/react/24/outline';

export default function QRScanner({ onValidated }) {
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const scannerRef = useRef(null);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // Update the startScanner function
  const startScanner = async () => {
    try {
      setIsScanning(true);

      // Wait for DOM element to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      const qrContainer = document.getElementById('qr-reader');
      if (!qrContainer) {
        throw new Error('Scanner container not found');
      }

      // Initialize scanner
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;
      setScanner(html5QrCode);

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async (decodedText) => {
          try {
            let qrData;
            try {
              qrData = JSON.parse(decodedText);
            } catch (parseError) {
              return; // Silent return for parse errors
            }

            // Validate QR data format
            if (!qrData.ticket_id || !qrData.email) {
              return; // Silent return for invalid format
            }

            // Store current scanner reference
            const currentScanner = scannerRef.current;

            // Stop scanning first
            if (currentScanner) {
              await currentScanner.stop();
              scannerRef.current = null;
              setScanner(null);
              setIsScanning(false);
            }

            // Then validate ticket
            await validateTicket({
              ticketId: qrData.ticket_id,
              email: qrData.email
            });

          } catch (error) {
            console.error('QR processing error:', error);
            toast.error('Failed to process QR code');
          }
        },
        (error) => {
          // Only log non-NotFoundException errors
          if (!error.includes("NotFoundException")) {
            console.warn('QR Scan error:', error);
          }
        }
      );
    } catch (err) {
      console.error('Scanner initialization error:', err);
      toast.error('Failed to start scanner');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setScanner(null);
      }
    } catch (error) {
      console.warn('Stop scanner warning:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const validateTicket = async (qrData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/tickets/validate',
        {
          ticketId: qrData.ticketId,
          email: qrData.email
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const result = {
        success: response.data.success,
        message: response.data.message,
        ticketId: qrData.ticketId
      };

      setValidationResult(result);

      if (result.success) {
        toast.success('Ticket validated successfully!');
        if (onValidated) {
          onValidated(qrData.ticketId);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      setValidationResult({
        success: false,
        message: error.response?.data?.message || 'Validation failed'
      });
      toast.error('Validation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setValidationResult(null);
    setScanner(null);
    setIsScanning(false);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      {/* Instructions Section */}
      {!isScanning && !validationResult && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <QrCodeIcon className="h-8 w-8 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">QR Code Scanner</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scanning Instructions */}
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Scanning Instructions
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Position QR code within the frame</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Ensure good lighting conditions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Hold the device steady</span>
                </li>
              </ul>
            </div>

            {/* Example QR Data */}
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                Example QR Code Format
              </h3>
              <div className="bg-gray-800 p-3 rounded-lg">
                <pre className="text-sm text-gray-300 font-mono">
                  {JSON.stringify({
                    ticket_id: "ticket_123456",  // Changed from ticketId to ticket_id
                    email: "user@example.com"
                  }, null, 2)}
                </pre>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Note: QR code must contain exactly these fields in JSON format
              </p>
            </div>
          </div>

          <button
            onClick={startScanner}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg 
                     hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
          >
            <PlayIcon className="h-5 w-5" />
            <span>Start Scanning</span>
          </button>
        </div>
      )}

      {/* Scanner */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <div className="max-w-lg mx-auto">
              <div 
                id="qr-reader" 
                ref={scannerRef}
                className="border-4 border-indigo-500 rounded-lg overflow-hidden" 
                style={{ width: '100%', minHeight: '300px' }}
              />
            </div>
            <button
              onClick={stopScanner}
              className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <StopIcon className="h-5 w-5" />
              <span>Stop</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation Result */}
      {validationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-4">
            {validationResult.success ? (
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            ) : (
              <XCircleIcon className="h-8 w-8 text-red-400" />
            )}
            <div>
              <h3 className={`text-lg font-semibold ${
                validationResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {validationResult.success ? 'Validation Successful' : 'Validation Failed'}
              </h3>
              <p className="text-gray-300">{validationResult.message}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {/* Add View Ticket button if ticket is used */}
            {validationResult.message?.toLowerCase().includes('used') && (
              <button
                onClick={() => onValidated(validationResult.ticketId)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <TicketIcon className="h-5 w-5" />
                <span>View Ticket</span>
              </button>
            )}
            <button
              onClick={resetScanner}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Scan Another
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent" />
            <span className="text-white">Validating ticket...</span>
          </div>
        </div>
      )}
    </div>
  );
}