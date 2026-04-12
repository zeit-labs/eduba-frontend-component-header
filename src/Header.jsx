import React, { useContext } from 'react';
import Responsive from 'react-responsive';
import { IntlProvider, useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import {
  APP_CONFIG_INITIALIZED,
  ensureConfig,
  mergeConfig,
  getConfig,
  subscribe,
} from '@edx/frontend-platform';
import PropTypes from 'prop-types';

import DesktopHeaderSlot from './plugin-slots/DesktopHeaderSlot';
import MobileHeaderSlot from './plugin-slots/MobileHeaderSlot';
import headerMessages from './Header.messages';
import i18nMessages from './i18n';
import { getLanguageFromCookie } from './hooks/useLanguageSwitcher';

ensureConfig([
  'LMS_BASE_URL',
  'LOGOUT_URL',
  'LOGIN_URL',
  'SITE_NAME',
  'LOGO_URL',
  'ORDER_HISTORY_URL',
], 'Header component');

subscribe(APP_CONFIG_INITIALIZED, () => {
  mergeConfig({
    AUTHN_MINIMAL_HEADER: !!process.env.AUTHN_MINIMAL_HEADER,
  }, 'Header additional config');
});

// ─── Inner component ─────────────────────────────────────────────────────────
// Rendered inside our IntlProvider so useIntl() reads our locale messages.

const HeaderContent = ({ mainMenuItems, secondaryMenuItems, userMenuItems }) => {
  const intl = useIntl();
  const { authenticatedUser, config } = useContext(AppContext);

  const defaultMainMenu = [
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/dashboard`,
      content: intl.formatMessage(headerMessages.courses),
    },
  ];

  const defaultUserMenu = authenticatedUser === null ? [] : [{
    heading: '',
    items: [
      {
        type: 'item',
        href: `${config.LMS_BASE_URL}/dashboard`,
        content: intl.formatMessage(headerMessages.dashboard),
      },
      {
        type: 'item',
        href: `${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`,
        content: intl.formatMessage(headerMessages.profile),
      },
      {
        type: 'item',
        href: config.ACCOUNT_SETTINGS_URL,
        content: intl.formatMessage(headerMessages['account-settings']),
      },
      ...(config.ORDER_HISTORY_URL ? [{
        type: 'item',
        href: config.ORDER_HISTORY_URL,
        content: intl.formatMessage(headerMessages['order-history']),
      }] : []),
      {
        type: 'item',
        href: config.LOGOUT_URL,
        content: intl.formatMessage(headerMessages.logout),
      },
    ],
  }];

  const mainMenu = mainMenuItems || defaultMainMenu;
  const secondaryMenu = secondaryMenuItems || [];
  const userMenu = authenticatedUser === null ? [] : userMenuItems || defaultUserMenu;

  const loggedOutItems = [
    {
      type: 'item',
      href: config.LOGIN_URL,
      content: intl.formatMessage(headerMessages.login),
    },
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/register`,
      content: intl.formatMessage(headerMessages['sign-up']),
    },
  ];

  const props = {
    logo: config.LOGO_URL,
    logoAltText: config.SITE_NAME,
    logoDestination: `${config.LMS_BASE_URL}/dashboard`,
    loggedIn: authenticatedUser !== null,
    username: authenticatedUser !== null ? authenticatedUser.username : null,
    name: authenticatedUser !== null ? authenticatedUser.name : null,
    email: authenticatedUser !== null ? authenticatedUser.email : null,
    avatar: authenticatedUser !== null ? authenticatedUser.avatar : null,
    mainMenu: getConfig().AUTHN_MINIMAL_HEADER ? [] : mainMenu,
    secondaryMenu: getConfig().AUTHN_MINIMAL_HEADER ? [] : secondaryMenu,
    userMenu: getConfig().AUTHN_MINIMAL_HEADER ? [] : userMenu,
    loggedOutItems: getConfig().AUTHN_MINIMAL_HEADER ? [] : loggedOutItems,
  };

  return (
    <>
      <Responsive maxWidth={769}>
        <MobileHeaderSlot props={props} />
      </Responsive>
      <Responsive minWidth={769}>
        <DesktopHeaderSlot props={props} />
      </Responsive>
    </>
  );
};

HeaderContent.defaultProps = {
  mainMenuItems: null,
  secondaryMenuItems: null,
  userMenuItems: null,
};

HeaderContent.propTypes = {
  mainMenuItems: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  secondaryMenuItems: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  userMenuItems: PropTypes.arrayOf(PropTypes.shape({
    heading: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['item', 'menu']),
      href: PropTypes.string,
      content: PropTypes.string,
      isActive: PropTypes.bool,
    })),
  })),
};

// ─── Outer wrapper ────────────────────────────────────────────────────────────
// Reads the language cookie once on mount and feeds the correct messages
// into IntlProvider so every child component sees the right locale.

const Header = (props) => {
  const locale = getLanguageFromCookie();
  const localeMessages = i18nMessages[locale] ?? i18nMessages.ar;

  return (
    <IntlProvider locale={locale} messages={localeMessages}>
      <HeaderContent {...props} />
    </IntlProvider>
  );
};

Header.defaultProps = HeaderContent.defaultProps;
Header.propTypes = HeaderContent.propTypes;

export default Header;
