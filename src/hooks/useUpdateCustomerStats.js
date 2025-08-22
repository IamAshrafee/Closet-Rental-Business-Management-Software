import { ref, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { useSelector } from 'react-redux';

export const useUpdateCustomerStats = () => {
  const userInfo = useSelector((state) => state.userLogInfo.value);

  const updateStats = async (customerId, allBookings) => {
    if (!userInfo || !customerId) return;

    const customerBookings = Object.values(allBookings).filter(b => b.customerId === customerId);

    const totalSpent = customerBookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
    const totalBookings = customerBookings.length;
    const totalOutstanding = customerBookings.reduce((acc, b) => acc + (b.dueAmount > 0 ? b.dueAmount : 0), 0);
    const activeBookings = customerBookings.filter(b => b.status !== 'Completed').length;

    const customerRef = ref(db, `users/${userInfo.uid}/customers/${customerId}`);
    await update(customerRef, {
      totalSpent,
      totalBookings,
      totalOutstanding,
      activeBookings
    });
  };

  return updateStats;
};
