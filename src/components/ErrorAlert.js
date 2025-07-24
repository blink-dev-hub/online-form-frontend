import React from 'react';
import Alert from '@mui/material/Alert';

const ErrorAlert = ({ message }) => (
  <Alert severity="error" sx={{ mb: 2 }}>
    {message}
  </Alert>
);

export default ErrorAlert; 