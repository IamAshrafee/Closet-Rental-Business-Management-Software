import React from 'react';
import { motion } from 'framer-motion';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ title, description, buttonText, onButtonClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg bg-gray-50"
    >
      <div className="bg-indigo-100 p-4 rounded-full mb-4">
        <FiInbox className="text-indigo-600" size={32} />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-xs mx-auto mb-6">{description}</p>
      {buttonText && onButtonClick && (
        <motion.button
          key="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onButtonClick}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 font-semibold shadow-sm transition-colors"
        >
          {buttonText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;