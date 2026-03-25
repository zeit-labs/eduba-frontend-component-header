import React from 'react';
import useLanguageSwitcher from '../hooks/useLanguageSwitcher';

const LanguageSwitcherButton = () => {
  const { isArabic, toggleLanguage } = useLanguageSwitcher();

  return (
    <button
      type="button"
      className="language-switcher-btn"
      onClick={toggleLanguage}
    >
      {!isArabic ? 'العربية' : 'En'}
    </button>
  );
};

export default LanguageSwitcherButton;
