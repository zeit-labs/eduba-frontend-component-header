import React from 'react';

import { getLoginRedirectUrl } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import LearningLoggedOutItemsSlot from '../plugin-slots/LearningLoggedOutItemsSlot';

import headerMessages from '../Header.messages';

const AnonymousUserMenu = ({ intl }) => {
  const buttonsInfo = [
    {
      message: intl.formatMessage(headerMessages.login),
      href: getLoginRedirectUrl(global.location.href),
      variant: 'primary',
    },
  ];

  return <LearningLoggedOutItemsSlot buttonsInfo={buttonsInfo} />;
};

AnonymousUserMenu.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AnonymousUserMenu);
