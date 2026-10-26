import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';

import { getLanguageFromCookie } from './hooks/useLanguageSwitcher';

/**
 * The site logo, linking to the marketing home in the learner's language (as the marketing header
 * does). The logo is the home link, so the header no longer renders a separate Home item.
 */
const Logo = ({
  src,
  alt,
  ...attributes
}) => {
  const { href, ...restAttributes } = attributes;
  const config = getConfig();
  const locale = (getLanguageFromCookie() || config.LANGUAGE_CODE || 'ar').split('-')[0];
  const marketingBase = (config.MARKETING_SITE_BASE_URL || '').replace(/\/+$/, '');

  return (
    <a href={`${marketingBase}/${locale}`} className="logo" {...restAttributes}>
      <img className="d-block" src={src} alt={alt} />
    </a>
  );
};

export const logoDataShape = {
  href: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

Logo.propTypes = logoDataShape;

export default Logo;
