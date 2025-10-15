import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PixTimer({ expiresAt, onExpired, showProgressBar = true, className = "" }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;
      
      if (difference > 0) {
        return Math.floor(difference / 1000);
      } else {
        onExpired && onExpired();
        return 0;
      }
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = timeLeft > 0 ? (timeLeft / (6.5 * 60)) * 100 : 0; // 6.5 minutos total

  if (timeLeft <= 0) {
    return <span className={`text-red-500 font-semibold ${className}`}>Expirado</span>;
  }

  return (
    <div className={className}>
      <span className="font-bold text-gray-800">{formatTime(timeLeft)}</span>
      {showProgressBar && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <motion.div 
            className="bg-[#7C9885] h-2 rounded-full"
            initial={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </div>
      )}
    </div>
  );
}