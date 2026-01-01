import React from 'react';
import PropTypes from 'prop-types';
// import { CaretIcon } from '../Icons';
import Avatar from '../Avatar';

const DesktopUserMenuToggle = ({ avatar, label }) => (
  <>
    <Avatar size="40px" src={avatar} alt="" className="" />
    <div className="container-user-info">
      <span>{label}</span>
    </div>
  </>
);

export const DesktopUserMenuTogglePropTypes = {
  avatar: PropTypes.string,
  label: PropTypes.string,
};

DesktopUserMenuToggle.propTypes = DesktopUserMenuTogglePropTypes;

export default DesktopUserMenuToggle;
