"use client";

import { ReactNode, useState, useEffect} from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const[loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer); 
    }
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl font-bold text-gray-700"
        >
          &times;
        </button>
        {loading?<p className='text-black text-center'>Loading...</p>:children} {/* Modal content */}
      </div>
    </div>
  );
};

export default Modal;
