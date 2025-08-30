import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import Sidebar from './Sidebar';
import PrivateRoute from '../authentication/PrivateRoute';

// Import actions from slices
import { bookingsLoading, bookingsReceived, bookingsError } from '../store/slices/bookingsSlice';
import { customersLoading, customersReceived, customersError } from '../store/slices/customersSlice';
import { stockLoading, stockReceived, stockError } from '../store/slices/stockSlice';

const AppLayout = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userLogInfo.value);
  
  // Select status from each slice to prevent multiple listeners
  const bookingsStatus = useSelector((state) => state.bookings.status);
  const customersStatus = useSelector((state) => state.customers.status);
  const stockStatus = useSelector((state) => state.stock.status);

  useEffect(() => {
    if (userInfo) {
      // Setup listener for bookings
      if (bookingsStatus === 'idle') {
        dispatch(bookingsLoading());
        const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
        const bookingsListener = onValue(bookingsRef, (snapshot) => {
          const data = snapshot.val() || {};
          const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          dispatch(bookingsReceived(list));
        }, (error) => {
          dispatch(bookingsError(error.message));
        });
        // Note: Firebase onValue returns an unsubscribe function for cleanup,
        // but we want the listener to be active for the entire session.
        // It will be implicitly cleaned up on user logout/app close.
      }

      // Setup listener for customers
      if (customersStatus === 'idle') {
        dispatch(customersLoading());
        const customersRef = ref(db, `users/${userInfo.uid}/customers`);
        const customersListener = onValue(customersRef, (snapshot) => {
          const data = snapshot.val() || {};
          const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          dispatch(customersReceived(list));
        }, (error) => {
          dispatch(customersError(error.message));
        });
      }

      // Setup listener for stock items
      if (stockStatus === 'idle') {
        dispatch(stockLoading());
        const itemsRef = ref(db, `users/${userInfo.uid}/items`);
        const itemsListener = onValue(itemsRef, (snapshot) => {
          const data = snapshot.val() || {};
          const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          dispatch(stockReceived(list));
        }, (error) => {
          dispatch(stockError(error.message));
        });
      }
    }
    // We only want this to run when userInfo is available.
    // Status dependencies prevent re-running if listeners are already active.
  }, [userInfo, bookingsStatus, customersStatus, stockStatus, dispatch]);

  return (
    <PrivateRoute>
      <Sidebar>
        <Outlet /> {/* This will render the nested page component */}
      </Sidebar>
    </PrivateRoute>
  );
};

export default AppLayout;
