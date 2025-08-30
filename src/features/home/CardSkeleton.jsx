import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center w-3/4">
              <Skeleton circle height={24} width={24} className="mr-2" />
              <Skeleton width={`80%`} />
            </div>
            <Skeleton width={50} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <Skeleton width={`60%`} />
            <Skeleton width={`40%`} />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton width={80} />
            <Skeleton width={60} />
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3">
            <Skeleton width={40} className="mb-2" />
            <div className="space-y-2">
              <div className="flex items-center">
                <Skeleton width={32} height={32} className="mr-2" />
                <Skeleton width={`70%`} />
              </div>
              <div className="flex items-center">
                <Skeleton width={32} height={32} className="mr-2" />
                <Skeleton width={`60%`} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
