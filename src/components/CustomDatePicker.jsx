import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const CustomDatePicker = ({ label, selected, onChange, error, required, ...props }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={selected ? new Date(selected) : null}
        onChange={onChange}
        renderInput={(params) => (
          <input
            {...params.inputProps}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            required={required}
          />
        )}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
