// Footer.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-100 p-4 bottom-0 w-full z-10 flex items-center justify-center">
      <p className="text-gray-800 mr-2 font-bold">&copy; 2023 Movie Notes</p>
    </footer>
  );
};

export default Footer;
