import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiPhone, FiMapPin, FiUser, FiUsers, FiBriefcase, FiLink } from 'react-icons/fi';

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

const CustomerInformationPopup = ({ customer, onClose }) => {
    if (!customer) {
        return null;
    }

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

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center backdrop-blur-sm p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-11/12 md:w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-3xl font-bold font-poppins text-gray-800">{name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors duration-200">
                        <IoMdClose size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4 overflow-y-auto p-6 flex-grow">
                    <DetailItem icon={<FiPhone />} label="Phone Number" value={phone} />
                    <DetailItem icon={<FiPhone />} label="Alternative Phone" value={altPhone} />
                    <DetailItem icon={<FiUser />} label="NID/Passport/Birth Cert." value={nid} />
                    <DetailItem icon={<FiUsers />} label={`${parentType || 'Parent'}'s NID`} value={parentNid} />
                    <DetailItem icon={<FiBriefcase />} label="Husband's NID" value={husbandNid} />
                    <DetailItem icon={<FiLink />} label="Facebook Profile" value={fbId} />
                    <DetailItem icon={<FiMapPin />} label="Address" value={address} />
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

export default CustomerInformationPopup;