import React, { useState, useEffect } from 'react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnline(true);
      setTimeout(() => {
        setShowBackOnline(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBackOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showBackOnline) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 p-2 text-center text-white font-semibold shadow-md transition-colors duration-300 ${
        !isOnline ? 'bg-red-600' : 'bg-green-500'
      }`}
    >
      {!isOnline
        ? 'You are offline. Please check your internet connection.'
        : 'Back online!'}
    </div>
  );
};

export default NetworkStatus;