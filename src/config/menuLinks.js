import messages from '../Header.messages';

/**
 * Returns the main navigation links with labels translated via react-intl.
 * @param {import('@edx/frontend-platform/i18n').IntlShape} intl
 * @returns {Array<{type: string, href: string, content: string}>}
 */
export function getCustomMenuLinks(intl) {
  return [
    {
      type: 'item',
      href: 'https://www.eduba.mohesr.gov.iq/ar',
      content: intl.formatMessage(messages.home),
    },
    {
      type: 'item',
      href: 'https://www.eduba.mohesr.gov.iq/all-courses',
      content: intl.formatMessage(messages.programs),
    },
    {
      type: 'item',
      href: 'https://www.eduba.mohesr.gov.iq/contact-us',
      content: intl.formatMessage(messages.contact),
    },
  ];
}
