import React from 'react';

import { getConfig } from '@edx/frontend-platform';

import ExploreMenuItem from '../explore/ExploreMenuItem';
import messages from '../Header.messages';

/**
 * Main navigation of the LMS header, matching the marketing site: the Explore menu, Courses and
 * Contact. Home lives on the logo, exactly as it does on the marketing site.
 *
 * @param {import('@edx/frontend-platform/i18n').IntlShape} intl
 * @returns {Array<{type: string, key?: string, href?: string, content: React.ReactNode}>}
 */
export function getCustomMenuLinks(intl, variant = 'desktop') {
  const config = getConfig();
  const locale = (intl.locale || config.LANGUAGE_CODE || 'ar').split('-')[0];
  const baseUrl = (config.MARKETING_SITE_BASE_URL || '').replace(/\/+$/, '');

  return [
    {
      type: 'custom',
      key: 'explore',
      content: <ExploreMenuItem variant={variant} />,
    },
    {
      type: 'item',
      href: `${baseUrl}/${locale}/courses`,
      content: intl.formatMessage(messages.courses),
    },
    {
      type: 'item',
      href: `${baseUrl}/${locale}/contact-us`,
      content: intl.formatMessage(messages.contact),
    },
  ];
}
