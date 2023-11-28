// Header.tsx

import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return <h1 className="text-2xl font-semibold py-4">{children}</h1>;
};

export default Header;
