import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingSpinner = ({ size = 40 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 80 }}>
    <CircularProgress size={size} />
  </div>
);

export default LoadingSpinner; 