import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiTag, FiGrid, FiMaximize2, FiDroplet, FiCalendar, FiMapPin, FiDollarSign, FiInfo, FiCheckCircle, FiXCircle, FiTrendingUp, FiFileText, FiImage } from 'react-icons/fi';

const DetailItem = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-start text-gray-700 py-2">
            <div className="flex-shrink-0 w-6 text-gray-500">{icon}</div>
            <div className="ml-4">
                <p className="font-semibold">{label}</p>
                <p className="text-gray-600">{value}</p>
            </div>
        </div>
    );
};

const ItemInformationPopup = ({ item, onClose }) => {
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
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center backdrop-blur-sm p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-11/12 md:w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b pb-4">
                    <h2 className="text-3xl font-bold font-poppins text-gray-800">{name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors duration-200">
                        <IoMdClose size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <DetailItem icon={<FiGrid />} label="Category" value={category} />
                        <DetailItem icon={<FiMaximize2 />} label="Size" value={size} />
                        <DetailItem icon={<FiMaximize2 />} label="Long" value={long} />
                        <DetailItem icon={<FiDroplet />} label="Colors" value={colors} />
                        <DetailItem icon={<FiCalendar />} label="Purchase Date" value={purchaseDate} />
                        <DetailItem icon={<FiMapPin />} label="Purchased From" value={purchaseFrom} />
                        <DetailItem icon={<FiMapPin />} label="Item's Country" value={itemCountry} />
                        <DetailItem icon={<FiDollarSign />} label="Purchase Price" value={purchasePrice} />
                        <DetailItem icon={availability === 'Available' ? <FiCheckCircle className="text-green-500" /> : <FiXCircle className="text-red-500" />} label="Availability" value={availability} />
                        <DetailItem icon={<FiInfo />} label="Condition" value={itemCondition} />
                        <DetailItem icon={<FiDollarSign />} label="Rent Price" value={rentPrice} />
                        <DetailItem icon={<FiTrendingUp />} label="Target" value={target} />
                    </div>

                    <div className="mt-6 pt-4 border-t">
                        <DetailItem icon={<FiFileText />} label="Description" value={description} />
                    </div>
                    
                    {imageUrl && (
                        <div className="mt-6">
                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FiImage className="mr-2"/> Item Photo</h4>
                            <img src={imageUrl} alt={name} className="rounded-lg w-full object-cover" />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemInformationPopup;