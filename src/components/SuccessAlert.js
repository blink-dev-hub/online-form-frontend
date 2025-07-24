import React from 'react';
import Alert from '@mui/material/Alert';

const SuccessAlert = ({ message }) => (
  <Alert severity="success" sx={{ mb: 2 }}>
    {message}
  </Alert>
);

export default SuccessAlert; 