import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

const CustomDatePicker = ({ label, selected, onChange, error, required, ...props }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={selected ? new Date(selected) : null}
        onChange={onChange}
        renderInput={(params) => (
          <TextField 
            {...params} 
            variant="standard"
            fullWidth
            required={required}
            error={!!error}
            helperText={error}
          />
        )}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;