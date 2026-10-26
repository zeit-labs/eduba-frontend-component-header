import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Dropdown } from '@openedx/paragon';

import LearningUserMenuSlot from '../plugin-slots/LearningUserMenuSlot';

import headerMessages from '../Header.messages';

const AuthenticatedUserDropdown = ({ intl, username }) => {
  const dropdownItems = [
    {
      message: intl.formatMessage(headerMessages['my-courses']),
      href: `${getConfig().LMS_BASE_URL}/dashboard`,
    },
    ...(getConfig().ORDER_HISTORY_URL ? [{
      message: intl.formatMessage(headerMessages['order-history']),
      href: getConfig().ORDER_HISTORY_URL,
    }] : []),
    {
      message: intl.formatMessage(headerMessages.logout),
      href: getConfig().LOGOUT_URL,
    },
  ];

  return (
    <Dropdown className="user-dropdown ml-3">
      <Dropdown.Toggle variant="outline-primary">
        <FontAwesomeIcon icon={faUserCircle} className="d-md-none" size="lg" />
        <span data-hj-suppress className="d-none d-md-inline">
          {username}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-right">
        <LearningUserMenuSlot items={dropdownItems} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

AuthenticatedUserDropdown.propTypes = {
  intl: intlShape.isRequired,
  username: PropTypes.string.isRequired,
};

export default injectIntl(AuthenticatedUserDropdown);
