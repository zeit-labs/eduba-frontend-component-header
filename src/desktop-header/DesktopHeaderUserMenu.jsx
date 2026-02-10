import React from 'react';
import PropTypes from 'prop-types';

const logOutSvg = (
  <svg stroke="#a4a7ae" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
    <path d="M15 12h-12l3 -3" />
    <path d="M6 15l-3 -3" />
  </svg>
);

const DesktopHeaderUserMenu = ({ menu }) => {
  const lastGroupIndex = menu.length - 1;
  const lastGroup = menu[lastGroupIndex];
  const lastItemIndex = lastGroup?.items?.length ? lastGroup.items.length - 1 : -1;
  return menu.map((group, groupIndex) => (
    // eslint-disable-next-line react/jsx-no-comment-textnodes,react/no-array-index-key
    <React.Fragment key={groupIndex}>
      {group.heading && <div className="dropdown-header" role="heading" aria-level="1">{group.heading}</div>}
      {group.items.map(({
        type, content, href, disabled, isActive, onClick,
      }, itemIndex) => {
        const isLastItem = groupIndex === lastGroupIndex && itemIndex === lastItemIndex;
        return (
          <a
            className={`dropdown-${type}${isActive ? ' active' : ''}${disabled ? ' disabled' : ''} ${isLastItem ? 'btn-secondary' : ' '}`}
            key={`${type}-${content}`}
            href={href}
            onClick={onClick || null}
          >
            {isLastItem && logOutSvg}{isLastItem && ' '}{content}
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
  })),
}));

DesktopHeaderUserMenu.propTypes = {
  menu: desktopUserMenuDataShape,
};

export default DesktopHeaderUserMenu;
