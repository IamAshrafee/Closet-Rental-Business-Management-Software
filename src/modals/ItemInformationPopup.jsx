import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiTag, FiGrid, FiMaximize2, FiDroplet, FiCalendar, FiMapPin, 
         FiDollarSign, FiInfo, FiCheckCircle, FiXCircle, FiTrendingUp, 
         FiFileText, FiImage, FiEdit2 } from 'react-icons/fi';
import { FaUserTie } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { ref, onValue } from 'firebase/database';
import { db } from '../authentication/firebaseConfig';

const DetailItem = ({ icon, label, value, className = '', highlight }) => {
    if (!value && value !== 0) return null;
    return (
        <div className={`flex items-start py-2 ${className} ${highlight ? 'bg-indigo-50 rounded-md px-3 -mx-1' : ''}`}>
            <div className={`flex-shrink-0 mt-0.5 ${highlight ? 'text-indigo-600' : 'text-gray-500'}`}>
                {React.cloneElement(icon, { size: 14 })}
            </div>
            <div className="ml-2.5 flex-1 min-w-0">
                <p className={`text-xs ${highlight ? 'text-indigo-700 font-medium' : 'text-gray-500'}`}>{label}</p>
                <div className={`text-sm ${highlight ? 'font-semibold text-indigo-900' : 'text-gray-800'} truncate`}>
                    {value}
                </div>
            </div>
        </div>
    );
};

import { useFormatDate } from '../hooks/useFormatDate';

const ItemInformationPopup = ({ item, onClose, onEdit }) => {
    const currency = useSelector((state) => state.currency.value);
    const colorsList = useSelector((state) => state.color.value);
    const userInfo = useSelector((state) => state.userLogInfo.value);
    const { formatDate } = useFormatDate();

    const [partners, setPartners] = useState([]);

    useEffect(() => {
        if (userInfo) {
            const partnersRef = ref(db, `users/${userInfo.uid}/partners`);
            onValue(partnersRef, (snapshot) => {
                const data = snapshot.val();
                setPartners(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
            });
        }
    }, [userInfo]);

    if (!item) return null;

    const {
        name,
        category,
        sizeOption,
        sizeValue,
        sizeFrom,
        sizeTo,
        long,
        colors,
        purchaseDate,
        purchaseFrom,
        itemCountry,
        purchasePrice,
        availability,
        itemCondition,
        rentOption,
        rentValue,
        rentPerDay,
        rentFrom,
        rentTo,
        target,
        description,
        photo: imageUrl,
        isCollaborated,
        ownerId
    } = item;

    const owner = partners.find(p => p.id === ownerId);

    

    const getRentPrice = () => {
        switch (rentOption) {
            case 'fixed':
                return `${currency.symbol}${rentValue}`;
            case 'per-day':
                return `${currency.symbol}${rentPerDay}/day`;
            case 'range':
                return `${currency.symbol}${rentFrom}-${currency.symbol}${rentTo}`;
            default:
                return 'N/A';
        }
    };

    const getAvailabilityBadge = () => {
        const isAvailable = availability === 'available';
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                {isAvailable ? (
                    <FiCheckCircle className="mr-1" size={10} />
                ) : (
                    <FiXCircle className="mr-1" size={10} />
                )}
                {availability}
            </span>
        );
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex justify-center items-center p-4 z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start p-4 border-b sticky top-0 bg-white z-10">
                        <div className="min-w-0 pr-2">
                            <h2 className="text-lg font-bold text-gray-900 truncate">{name}</h2>
                            <div className="flex items-center mt-1 space-x-2">
                                {category && (
                                    <span className="inline-flex items-center text-xs text-gray-600">
                                        <FiGrid className="mr-1" size={12} />
                                        {category}
                                    </span>
                                )}
                                {availability && getAvailabilityBadge()}
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                                className="p-1.5 rounded-md hover:bg-indigo-50 transition-colors text-indigo-600"
                                aria-label="Edit"
                            >
                                <FiEdit2 size={16} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
                                aria-label="Close"
                            >
                                <IoMdClose size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto flex-grow">
                        {/* Image Section */}
                        {imageUrl && (
                            <div className="bg-gray-50 border-b p-3">
                                <div className="relative aspect-square bg-white rounded-md overflow-hidden">
                                    <img
                                        src={imageUrl}
                                        alt={name}
                                        className="absolute inset-0 w-full h-full object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="p-4 space-y-4">
                            {isCollaborated && (
                                <div>
                                    <DetailItem
                                        icon={<FaUserTie />}
                                        label="COLLABORATION PARTNER"
                                        value={owner?.name || 'Unknown'}
                                        highlight
                                    />
                                </div>
                            )}

                            {/* Pricing Section (Most Important) */}
                            <div>
                                <DetailItem
                                    icon={<FiDollarSign />}
                                    label="RENTAL PRICE"
                                    value={getRentPrice()}
                                    highlight
                                />
                                <DetailItem
                                    icon={<FiDollarSign />}
                                    label="Purchase Price"
                                    value={`${currency.symbol}${purchasePrice}`}
                                />
                            </div>

                            {/* Item Details */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <DetailItem
                                    icon={<FiMaximize2 />}
                                    label="Size"
                                    value={sizeOption === 'fixed' ? `${sizeValue}"` : sizeOption === 'range' ? `${sizeFrom}" - ${sizeTo}"` : 'Free size'}
                                />
                                {long && (
                                    <DetailItem
                                        icon={<FiMaximize2 />}
                                        label="Length"
                                        value={
                                            category === 'Top-Skirt Set Dress' && long.includes(',')
                                                ? `Top: ${long.split(',')[0].trim()}", Skirt: ${long.split(',')[1].trim()}"`
                                                : `${long}"`
                                        }
                                    />
                                )}
                                {colors && Array.isArray(colors) && colors.length > 0 && (
                                    <DetailItem
                                        icon={<FiDroplet />}
                                        label="Colors"
                                        value={
                                            <div className="flex flex-wrap gap-2">
                                                {colors.map((colorName, index) => {
                                                    const color = colorsList.find(c => c.name === colorName);
                                                    return (
                                                        <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                                                            <div
                                                                className="w-3 h-3 rounded-full mr-1.5 border border-gray-300"
                                                                style={{ backgroundColor: color ? color.hex : '#ffffff' }}
                                                            />
                                                            <span className="text-xs text-gray-700">{colorName}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        }
                                    />
                                )}
                                <DetailItem
                                    icon={<FiInfo />}
                                    label="Condition"
                                    value={itemCondition}
                                />
                                {target && (
                                    <DetailItem
                                        icon={<FiTrendingUp />}
                                        label="Target"
                                        value={target}
                                    />
                                )}
                            </div>

                            {/* Purchase Info */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <DetailItem
                                    icon={<FiCalendar />}
                                    label="Purchase Date"
                                    value={formatDate(purchaseDate)}
                                />
                                <DetailItem
                                    icon={<FiMapPin />}
                                    label="Purchased From"
                                    value={purchaseFrom}
                                />
                                {itemCountry && (
                                    <DetailItem
                                        icon={<FiMapPin />}
                                        label="Origin"
                                        value={itemCountry}
                                    />
                                )}
                            </div>

                            {/* Description (Least Important) */}
                            {description && (
                                <div className="pt-2">
                                    <DetailItem
                                        icon={<FiFileText />}
                                        label="Notes"
                                        value={<p className="text-gray-700 text-sm whitespace-pre-line">{description}</p>}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end p-3 border-t bg-white sticky bottom-0">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm"
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