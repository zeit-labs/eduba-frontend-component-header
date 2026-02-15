import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({
  src,
  alt,
  ...attributes
}) => {
  const { href, ...restAttributes } = attributes;
  return (
    <a href="https://www.eduba.mohesr.gov.iq/ar" className="logo _---_" {...restAttributes}>
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
