import React from 'react';
import PropTypes from 'prop-types';
import {getConfig} from "@edx/frontend-platform";

const Logo = ({
  src,
  alt,
  ...attributes
}) => {
  const { href, ...restAttributes } = attributes;
  const config = getConfig();
  return (
    <a href={`${config.MARKETING_SITE_BASE_URL}/ar`} className="logo" {...restAttributes}>
      <img className="d-block" src={src} alt={alt} />
    </a>
  );
};

export const logoDataShape = {
  href: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

Logo.propTypes = logoDataShape;

export default Logo;
