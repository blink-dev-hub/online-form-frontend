import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    { to: '/', label: t('Quotation Form') },
    { to: '/tracking', label: t('Track Your Quotations') },
    { to: '/admin-login', label: t('Admin Login') },
  ];

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ mb: 3 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          {navLinks.map((link) => (
            <Button
              key={link.to}
              component={Link}
              to={link.to}
              color={location.pathname === link.to ? 'primary' : 'inherit'}
              sx={{ fontWeight: location.pathname === link.to ? 'bold' : 'normal', mr: 2 }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
        <LanguageSelector />
      </Toolbar>
    </AppBar>
  );
};

export default Header; 