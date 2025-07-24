import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const handleChange = (event, newLang) => {
    if (newLang) setLanguage(newLang);
  };

  return (
    <div style={{ margin: '1rem' }}>
      <ToggleButtonGroup
        value={language}
        exclusive
        onChange={handleChange}
        aria-label="language selector"
        size="small"
      >
        <ToggleButton value="en" aria-label="English">EN</ToggleButton>
        <ToggleButton value="fr" aria-label="Français">FR</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default LanguageSelector;