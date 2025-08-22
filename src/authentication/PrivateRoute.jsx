import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { setCategories } from '../store/slices/categorySlice';
import { setColors } from '../store/slices/colorSlice';
import { setCurrency } from '../store/slices/currencySlice';
import { setCompanyName } from '../store/slices/companySlice';
import { setDateTimeFormat } from '../store/slices/dateTimeSlice';

const PrivateRoute = () => {
  const userInfo = useSelector((state) => state.userLogInfo.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      const settingsRef = ref(db, `users/${userInfo.uid}/settings`);
      onValue(settingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          if (data.categories) {
            dispatch(setCategories(data.categories));
          }
          if (data.colors) {
            dispatch(setColors(data.colors));
          }
          if (data.currency) {
            dispatch(setCurrency(data.currency));
          }
          if (data.companyName) {
            dispatch(setCompanyName(data.companyName));
          }
          if (data.dateTimeFormat) {
            dispatch(setDateTimeFormat(data.dateTimeFormat));
          }
        }
      });
    }
  }, [userInfo, dispatch]);

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
