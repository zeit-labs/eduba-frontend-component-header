import { getConfig } from '@edx/frontend-platform';

import messages from '../Header.messages';

/**
 * Main navigation of the LMS header, matching the marketing site: Explore, Courses and Contact.
 *
 * Explore deep-links to the categories section of the marketing home; Home lives on the logo,
 * exactly as it does on the marketing site.
 *
 * @param {import('@edx/frontend-platform/i18n').IntlShape} intl
 * @returns {Array<{type: string, href: string, content: string}>}
 */
export function getCustomMenuLinks(intl) {
  const config = getConfig();
  const locale = (intl.locale || config.LANGUAGE_CODE || 'ar').split('-')[0];
  const baseUrl = (config.MARKETING_SITE_BASE_URL || '').replace(/\/+$/, '');

  return [
    {
      type: 'item',
      href: `${baseUrl}/${locale}#categories`,
      content: intl.formatMessage(messages.explore),
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
