import messages from '../Header.messages';
import {getConfig} from "@edx/frontend-platform";

/**
 * Returns the main navigation links with labels translated via react-intl.
 * @param {import('@edx/frontend-platform/i18n').IntlShape} intl
 * @returns {Array<{type: string, href: string, content: string}>}
 */
export function getCustomMenuLinks(intl) {
  const config = getConfig();
  return [
    {
      type: 'item',
      href: `${config.MARKETING_SITE_BASE_URL}/ar`,
      content: intl.formatMessage(messages.home),
    },
    {
      type: 'item',
      href: `${config.MARKETING_SITE_BASE_URL}/all-courses`,
      content: intl.formatMessage(messages.programs),
    },
    {
      type: 'item',
      href: `${config.MARKETING_SITE_BASE_URL}/contact-us`,
      content: intl.formatMessage(messages.contact),
    },
  ];
}
