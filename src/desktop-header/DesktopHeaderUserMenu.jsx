import React from 'react';
import PropTypes from 'prop-types';

export const logOutSvg = (
  <svg stroke="#a4a7ae" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
    <path d="M15 12h-12l3 -3" />
    <path d="M6 15l-3 -3" />
  </svg>
);
export const coursesSvg = (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z" />
    <path d="M19 16h-12a2 2 0 0 0 -2 2" />
    <path d="M9 8h6" />
  </svg>
);

const DesktopHeaderUserMenu = () => {
  const newMenu = [
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
  const lastGroupIndex = newMenu.length - 1;
  const lastGroup = newMenu[lastGroupIndex];
  const lastItemIndex = lastGroup?.items?.length ? lastGroup.items.length - 1 : -1;
  return newMenu.map((group, groupIndex) => (
    // eslint-disable-next-line react/jsx-no-comment-textnodes,react/no-array-index-key
    <React.Fragment key={groupIndex}>
      {group.heading && <div className="dropdown-header" role="heading" aria-level="1">{group.heading}</div>}
      {group.items.map(({
        type, content, href, disabled, isActive, onClick, icon,
      }, itemIndex) => {
        const isLastItem = groupIndex === lastGroupIndex && itemIndex === lastItemIndex;
        return (
          <a
            className={`dropdown-${type}${isActive ? ' active' : ''}${disabled ? ' disabled' : ''} ${isLastItem ? 'btn-secondary' : ' '}`}
            key={`${type}-${content}`}
            href={href}
            onClick={onClick || null}
          >
            {icon && icon}{content}
          </a>
        );
      })}
      {groupIndex < lastGroupIndex && <div className="dropdown-divider" role="separator" />}
    </React.Fragment>
  ));
};

export const desktopUserMenuDataShape = PropTypes.arrayOf(PropTypes.shape({
  heading: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
    icon: PropTypes.node,
  })),
}));

DesktopHeaderUserMenu.propTypes = {
  menu: desktopUserMenuDataShape,
};

export default DesktopHeaderUserMenu;
