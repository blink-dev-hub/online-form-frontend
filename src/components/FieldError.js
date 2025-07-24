import React from 'react';
import Typography from '@mui/material/Typography';

const FieldError = ({ error }) => (
  error ? <Typography color="error" variant="caption">{error}</Typography> : null
);

export default FieldError; 