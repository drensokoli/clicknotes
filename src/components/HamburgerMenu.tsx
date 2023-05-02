// HamburgerMenu.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface MenuItem {
  title: string;
  path: string;
}
// HamburgerMenu.tsx

interface HamburgerMenuProps {
  menuItems: MenuItem[];
  handleProfile: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ menuItems, handleProfile }) => {

  const router = useRouter();


  return (
    <nav className="hamburger-menu">
      <ul>
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link href={item.path}>
              <a className={router.pathname === item.path ? 'active' : ''}>{item.title}</a>
            </Link>
          </li>
        ))}
        <li>
          <a onClick={handleProfile}>
            <FontAwesomeIcon icon={faUser} />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default HamburgerMenu;
