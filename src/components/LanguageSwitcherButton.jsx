import React from 'react';
import useLanguageSwitcher from '../hooks/useLanguageSwitcher';

const LanguageSwitcherButton = () => {
  const { isArabic, toggleLanguage } = useLanguageSwitcher();

  return (
    <button
      type="button"
      className="language-switcher-btn"
      onClick={toggleLanguage}
      style={{
        borderColor: '#6b7280',
        borderRadius: '8px',
        borderStyle: 'solid',
        borderWidth: '1px',
      }}
    >
      {!isArabic ? 'العربية' : 'En'}
    </button>
  );
};

export default LanguageSwitcherButton;
