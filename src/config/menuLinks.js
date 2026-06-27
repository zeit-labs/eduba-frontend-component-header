import messages from '../Header.messages';
import {getConfig} from "@edx/frontend-platform";

/**
 * Returns the main navigation links with labels translated via react-intl.
 * @param {import('@edx/frontend-platform/i18n').IntlShape} intl
 * @returns {Array<{type: string, href: string, content: string}>}
 */
export function getCustomMenuLinks(intl) {
  const config = getConfig();
  const locale = intl.locale || 'ar';
  return [
    {
      type: 'item',
      href: `${config.MARKETING_SITE_BASE_URL}/${locale}`,
      content: intl.formatMessage(messages.home),
    },
    {
      type: 'item',
      href: `${config.MARKETING_SITE_BASE_URL}/${locale}/courses`,
      content: intl.formatMessage(messages.courses),
    },
    {
      type: 'item',
      href: `${config.MARKETING_SITE_BASE_URL}/${locale}/contact-us`,
      content: intl.formatMessage(messages.contact),
    },
  ];
}
