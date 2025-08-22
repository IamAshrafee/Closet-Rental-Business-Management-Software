import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from './firebaseConfig';
import { setCategories } from '../slice/categorySlice';
import { setColors } from '../slice/colorSlice';
import { setCurrency } from '../slice/currencySlice';
import { setCompanyName } from '../slice/companySlice';
import { setDateTimeFormat } from '../slice/dateTimeSlice';

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
