"use client"
import React, { useState, useEffect } from 'react';

const Loading: React.FC = () => {
  const [loadingText, setLoadingText] = useState('Loading');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set a delay to ensure the loader is visible initially
    const delay = setTimeout(() => setIsVisible(false), 2000);

    const interval = setInterval(() => {
      setLoadingText((prev) =>
        prev === 'Loading...' ? 'Loading' : prev + '.'
      );
    }, 500);

    return () => {
      clearInterval(interval);
      clearTimeout(delay);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl font-bold">{loadingText}</h1>
    </div>
  );
};

export default Loading;

