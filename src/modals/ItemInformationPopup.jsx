import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiTag, FiGrid, FiMaximize2, FiDroplet, FiCalendar, FiMapPin, 
         FiDollarSign, FiInfo, FiCheckCircle, FiXCircle, FiTrendingUp, 
         FiFileText, FiImage, FiEdit2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const DetailItem = ({ icon, label, value, className = '' }) => {
    if (!value) return null;
    return (
        <div className={`flex items-start text-gray-700 py-2 ${className}`}>
            <div className="flex-shrink-0 w-6 text-gray-500 mt-0.5">{icon}</div>
            <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-gray-800 font-medium mt-0.5">{value}</p>
            </div>
        </div>
    );
};

const ItemInformationPopup = ({ item, onClose, onEdit }) => {
    const currency = useSelector((state) => state.currency.value);
    if (!item) {
        return null;
    }

    const {
        name,
        category,
        size,
        long,
        colors,
        purchaseDate,
        purchaseFrom,
        itemCountry,
        purchasePrice,
        availability,
        itemCondition,
        rentPrice,
        target,
        description,
        imageUrl,
    } = item;

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
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start p-6 pb-4 border-b sticky top-0 bg-white z-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{name}</h2>
                            {category && (
                                <div className="flex items-center mt-1">
                                    <FiGrid className="text-gray-400 mr-1" size={14} />
                                    <span className="text-sm text-gray-500">{category}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Edit"
                            >
                                <FiEdit2 className="text-indigo-600" size={18} />
                            </button>
                            <button 
                                onClick={onClose} 
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Close"
                            >
                                <IoMdClose className="text-gray-500" size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto flex-grow p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {/* Left Column */}
                            <div>
                                <DetailItem 
                                    icon={<FiMaximize2 />} 
                                    label="Size" 
                                    value={size} 
                                />
                                {long && (
                                    <DetailItem 
                                        icon={<FiMaximize2 />} 
                                        label="Length" 
                                        value={long} 
                                    />
                                )}
                                {colors && (
                                    <DetailItem 
                                        icon={<FiDroplet />} 
                                        label="Color" 
                                        value={
                                            <div className="flex items-center">
                                                <div 
                                                    className="w-4 h-4 rounded-full mr-2 border border-gray-200" 
                                                    style={{ backgroundColor: colors }}
                                                />
                                                <span>{colors}</span>
                                            </div>
                                        } 
                                    />
                                )}
                                <DetailItem 
                                    icon={<FiDollarSign />} 
                                    label="Purchase Price" 
                                    value={`${currency.symbol}${purchasePrice}`} 
                                />
                                <DetailItem 
                                    icon={<FiDollarSign />} 
                                    label="Rent Price" 
                                    value={`${currency.symbol}${rentPrice}`} 
                                />
                            </div>

                            {/* Right Column */}
                            <div>
                                <DetailItem 
                                    icon={<FiCalendar />} 
                                    label="Purchase Date" 
                                    value={purchaseDate} 
                                />
                                <DetailItem 
                                    icon={<FiMapPin />} 
                                    label="Purchased From" 
                                    value={purchaseFrom} 
                                />
                                {itemCountry && (
                                    <DetailItem 
                                        icon={<FiMapPin />} 
                                        label="Item's Country" 
                                        value={itemCountry} 
                                    />
                                )}
                                <DetailItem 
                                    icon={availability === 'Available' ? 
                                        <FiCheckCircle className="text-green-500" /> : 
                                        <FiXCircle className="text-red-500" />} 
                                    label="Availability" 
                                    value={availability} 
                                />
                                <DetailItem 
                                    icon={<FiInfo />} 
                                    label="Condition" 
                                    value={itemCondition} 
                                />
                                {target && (
                                    <DetailItem 
                                        icon={<FiTrendingUp />} 
                                        label="Rental Target" 
                                        value={target} 
                                    />
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {description && (
                            <div className="mt-6 pt-4 border-t">
                                <DetailItem 
                                    icon={<FiFileText />} 
                                    label="Description" 
                                    value={<p className="text-gray-700 whitespace-pre-line">{description}</p>} 
                                    className="w-full"
                                />
                            </div>
                        )}
                        
                        {/* Image */}
                        {imageUrl && (
                            <div className="mt-6 pt-4 border-t">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                    <FiImage className="mr-2 text-gray-500"/> Item Photo
                                </h4>
                                <div className="rounded-lg overflow-hidden bg-gray-100">
                                    <img 
                                        src={imageUrl} 
                                        alt={name} 
                                        className="w-full h-auto max-h-64 object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end p-4 border-t border-gray-200 sticky bottom-0 bg-white">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose} 
                            className="bg-gray-100 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Close
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ItemInformationPopup;
