import React from 'react';

export const MenuIcon = (props) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    version="1.1"
    {...props}
  >
    <rect fill="currentColor" x="2" y="5" width="20" height="2" />
    <rect fill="currentColor" x="2" y="11" width="20" height="2" />
    <rect fill="currentColor" x="2" y="17" width="20" height="2" />
  </svg>
);

export const AvatarIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="#dddddd"
    strokeWidth="0"
    viewBox="0 0 496 512"
    height="40px"
    width="40px"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z" />
  </svg>
);

export const CaretIcon = (props) => (
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 16 16"
    version="1.1"
    {...props}
  >
    <path
      d="M7,4 L7,8 L11,8 L11,10 L5,10 L5,4 L7,4 Z"
      fill="currentColor"
      transform="translate(8.000000, 7.000000) rotate(-45.000000) translate(-8.000000, -7.000000) "
    />
  </svg>
);
