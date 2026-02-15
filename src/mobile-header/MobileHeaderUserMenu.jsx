import React from 'react';
import PropTypes from 'prop-types';

const MobileHeaderUserMenu = ({ menu }) => {
  const lastGroupIndex = menu.length - 1;
  const lastGroup = menu[lastGroupIndex];
  const lastItemIndex = lastGroup?.items?.length ? lastGroup.items.length - 1 : -1;
  return menu.map((group, groupIndex) => group.items.map(({
    type, content, href, disabled, isActive, onClick, icon,
  }, itemIndex) => {
    const isLastItem = groupIndex === lastGroupIndex && itemIndex === lastItemIndex;
    return (
      <li className="nav-item" key={`${type}-${content}`}>
        <a
          className={`nav-link${isActive ? ' active' : ''}${disabled ? ' disabled' : ''} ${isLastItem ? 'btn-secondary' : ' '}`}
          href={href}
          onClick={onClick || null}
        >
          {icon && icon}{content}
        </a>
      </li>
    );
  }));
};

export const mobileHeaderUserMenuDataShape = PropTypes.arrayOf(PropTypes.shape({
  heading: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
  })),
}));

MobileHeaderUserMenu.propTypes = {
  menu: mobileHeaderUserMenuDataShape,
};

export default MobileHeaderUserMenu;
