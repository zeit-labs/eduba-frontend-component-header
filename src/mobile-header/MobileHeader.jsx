import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

// Local Components
import { Menu, MenuTrigger, MenuContent } from '../Menu';
import LogoSlot from '../plugin-slots/LogoSlot';
import MobileLoggedOutItemsSlot from '../plugin-slots/MobileLoggedOutItemsSlot';
import { mobileHeaderLoggedOutItemsDataShape } from './MobileLoggedOutItems';
import MobileMainMenuSlot from '../plugin-slots/MobileMainMenuSlot';
import { mobileHeaderMainMenuDataShape } from './MobileHeaderMainMenu';
import MobileUserMenuSlot from '../plugin-slots/MobileUserMenuSlot';
import { mobileHeaderUserMenuDataShape } from './MobileHeaderUserMenu';

// i18n
import messages from '../Header.messages';

// Assets
import Avatar from '../Avatar';
import { MenuIcon } from '../Icons';
import { coursesSvg, logOutSvg } from '../desktop-header/DesktopHeaderUserMenu';
import { customMenuLinks } from '../desktop-header/DesktopHeader';

class MobileHeader extends React.Component {
  constructor(props) { // eslint-disable-line no-useless-constructor
    super(props);
  }

  renderMainMenu() {
    return <MobileMainMenuSlot menu={customMenuLinks} />;
  }

  renderUserMenuItems() {
    const customUserMenu = [
      {
        heading: '',
        items: [
          {
            type: 'item',
            href: 'https://apps.eduba.mohesr.gov.iq/learner-dashboard/',
            content: 'مقرراتي',
            icon: coursesSvg,
          },
        ],
      },
      {
        heading: '',
        items: [
          {
            type: 'item',
            href: 'https://eduba.mohesr.gov.iq/logout',
            content: 'Sign Out',
            icon: logOutSvg,
          },
        ],
      },
    ];
    return <MobileUserMenuSlot menu={customUserMenu} />;
  }

  renderLoggedOutItems() {
    const { loggedOutItems } = this.props;
    return <MobileLoggedOutItemsSlot items={loggedOutItems} />;
  }

  render() {
    const {
      logo,
      logoAltText,
      logoDestination,
      loggedIn,
      intl,
      mainMenu,
      userMenu,
      loggedOutItems,
      avatar,
      username,
      name,
      email,
    } = this.props;
    const logoProps = { src: logo, alt: logoAltText, href: logoDestination };

    return (
      <header
        aria-label={intl.formatMessage(messages['header.label.main.header'])}
        className="site-header-mobile"
      >
        <div className="w-100 d-flex justify-content-start">
          <LogoSlot {...logoProps} itemType="http://schema.org/Organization" />
        </div>
        <a className="nav-skip sr-only sr-only-focusable" href="#main">
          {intl.formatMessage(messages['header.label.skip.nav'])}
        </a>
        {mainMenu.length > 0 ? (
          <div className="w-100 d-flex justify-content-end">
            <Menu className="position-static">
              <MenuTrigger
                tag="button"
                className="icon-button"
                aria-label={intl.formatMessage(
                  messages['header.label.main.menu'],
                )}
                title={intl.formatMessage(messages['header.label.main.menu'])}
              >
                <MenuIcon
                  role="img"
                  aria-hidden
                  focusable="false"
                  style={{ width: '1.5rem', height: '1.5rem' }}
                />
              </MenuTrigger>
              <MenuContent
                tag="nav"
                aria-label={intl.formatMessage(
                  messages['header.label.main.nav'],
                )}
                className="nav flex-column pin-left pin-right border-top shadow py-2"
              >
                {this.renderMainMenu()}
                {userMenu.length > 0 || loggedOutItems.length > 0 ? (
                  <div className="custom-group">
                    {loggedIn ? (
                      <>
                        <div className="info-container">
                          <Avatar size="40px" src={avatar} alt="" />
                          <div className="custom-info">
                            <p>{name ?? username}</p>
                            <p>{email ?? ''}</p>
                          </div>
                        </div>
                        {this.renderUserMenuItems()}
                      </>
                    ) : (
                      <>
                        {this.renderLoggedOutItems()}
                      </>
                    )}
                  </div>
                ) : null}
              </MenuContent>
            </Menu>
          </div>
        ) : null}
      </header>
    );
  }
}

export const mobileHeaderDataShape = {
  mainMenu: mobileHeaderMainMenuDataShape,
  secondaryMenu: mobileHeaderMainMenuDataShape,
  userMenu: mobileHeaderUserMenuDataShape,
  loggedOutItems: mobileHeaderLoggedOutItemsDataShape,
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  loggedIn: PropTypes.bool,
  stickyOnMobile: PropTypes.bool,
};

MobileHeader.propTypes = {
  mainMenu: mobileHeaderDataShape.mainMenu,
  secondaryMenu: mobileHeaderDataShape.secondaryMenu,
  userMenu: mobileHeaderDataShape.userMenu,
  loggedOutItems: mobileHeaderDataShape.loggedOutItems,
  logo: mobileHeaderDataShape.logo,
  logoAltText: mobileHeaderDataShape.logoAltText,
  logoDestination: mobileHeaderDataShape.logoDestination,
  avatar: mobileHeaderDataShape.avatar,
  username: mobileHeaderDataShape.username,
  name: mobileHeaderDataShape.name,
  email: mobileHeaderDataShape.email,
  loggedIn: mobileHeaderDataShape.loggedIn,
  stickyOnMobile: mobileHeaderDataShape.stickyOnMobile,

  // i18n
  intl: intlShape.isRequired,
};

MobileHeader.defaultProps = {
  mainMenu: [],
  secondaryMenu: [],
  userMenu: [],
  loggedOutItems: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  username: null,
  name: null,
  email: null,
  loggedIn: false,
  stickyOnMobile: true,
};

export default injectIntl(MobileHeader);
