import React from 'react';
import Alert from '@mui/material/Alert';

const InfoAlert = ({ message }) => (
  <Alert severity="info" sx={{ mb: 2 }}>
    {message}
  </Alert>
);

export default InfoAlert; 