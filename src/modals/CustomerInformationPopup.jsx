import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { 
  FiPhone, 
  FiMapPin, 
  FiUser, 
  FiUsers, 
  FiBriefcase, 
  FiLink,
  FiEdit2
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DetailItem = ({ icon, label, value, isLink = false }) => {
  if (!value) return null;

  return (
    <motion.div 
      className="flex items-start py-3"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-shrink-0 p-2 mr-3 bg-gray-100 rounded-lg text-gray-600">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        {isLink ? (
          <a 
            href={value.startsWith('http') ? value : `https://${value}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline break-all"
          >
            {value.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <p className="text-gray-800 font-medium break-all">
            {value}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const CustomerInformationPopup = ({ isOpen, customer, onClose, onEdit }) => {
  if (!isOpen || !customer) return null;

  const {
    name,
    phone,
    altPhone,
    nid,
    parentNid,
    parentType,
    husbandNid,
    fbId,
    address,
  } = customer;

  // Order fields by importance (most important first)
  const contactFields = [
    { icon: <FiPhone />, label: "Primary Phone", value: phone },
    { icon: <FiPhone />, label: "Secondary Phone", value: altPhone }
  ];

  const identityFields = [
    { icon: <FiUser />, label: "NID/Passport", value: nid },
    { icon: <FiUsers />, label: `${parentType || 'Parent'} NID`, value: parentNid },
    { icon: <FiBriefcase />, label: "Husband's NID", value: husbandNid }
  ];

  const otherFields = [
    { icon: <FiLink />, label: "Facebook Profile", value: fbId, isLink: true },
    { icon: <FiMapPin />, label: "Address", value: address }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center backdrop-blur-sm p-4 z-50"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-500 mt-1">Customer Details</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                aria-label="Edit customer"
              >
                <FiEdit2 size={18} />
              </button>
              <button 
                onClick={onClose} 
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Close"
              >
                <IoMdClose size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-grow p-5">
            {/* Contact Information Section */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Contact Information
              </h3>
              <div className="space-y-2 pl-1">
                {contactFields.map((field, index) => (
                  <DetailItem 
                    key={index}
                    icon={field.icon}
                    label={field.label}
                    value={field.value}
                  />
                ))}
              </div>
            </motion.section>

            {/* Identity Information Section */}
            {identityFields.some(f => f.value) && (
              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mb-6"
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Identity Information
                </h3>
                <div className="space-y-2 pl-1">
                  {identityFields.map((field, index) => (
                    <DetailItem 
                      key={index}
                      icon={field.icon}
                      label={field.label}
                      value={field.value}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Other Information Section */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Other Information
              </h3>
              <div className="space-y-2 pl-1">
                {otherFields.map((field, index) => (
                  <DetailItem 
                    key={index}
                    icon={field.icon}
                    label={field.label}
                    value={field.value}
                    isLink={field.isLink}
                  />
                ))}
              </div>
            </motion.section>
          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="p-4 border-t border-gray-100 bg-gray-50"
          >
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomerInformationPopup;