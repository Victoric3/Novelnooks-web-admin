import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const CircularLoadingSpinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <CircularProgress color='inherit'/>
    </div>
  );
};

export default CircularLoadingSpinner;
