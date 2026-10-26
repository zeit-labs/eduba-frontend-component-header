import React from 'react';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import headerMessages from '../Header.messages';
import './eduba-explore';

/**
 * The marketing site's Explore menu, mounted as the shared web component.
 *
 * It reads the categories from the LMS API (the same endpoint the marketing site uses) and links
 * every item to the marketing explore pages, so nothing is reimplemented here. The mobile header
 * uses the accordion variant of the same component.
 */
const ExploreMenuItem = ({ intl, variant }) => {
  const config = getConfig();
  const locale = (intl.locale || config.LANGUAGE_CODE || 'ar').split('-')[0];
  const marketingBase = (config.MARKETING_SITE_BASE_URL || '').replace(/\/+$/, '');
  const categoriesPath = '/api/eduba/categories/v1/categories/';
  const categoriesUrl = config.LMS_BASE_URL ? `${config.LMS_BASE_URL}${categoriesPath}` : categoriesPath;
  const label = intl.formatMessage(headerMessages.explore);

  return (
    <eduba-explore
      api={categoriesUrl}
      base={`${marketingBase}/${locale}`}
      lang={locale}
      label={label}
      variant={variant === 'mobile' ? 'mobile' : undefined}
    >
      <a className="nav-link" href={`${marketingBase}/${locale}#categories`}>{label}</a>
    </eduba-explore>
  );
};

ExploreMenuItem.propTypes = {
  intl: intlShape.isRequired,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};

ExploreMenuItem.defaultProps = {
  variant: 'desktop',
};

export default injectIntl(ExploreMenuItem);
