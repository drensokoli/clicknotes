import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white p-4 bottom-0 w-full z-10 flex flex-col items-center justify-center">
      <h1 className='text-gray-800'>Made with ❤️ by Dren Sokoli</h1>
      <p className="text-gray-800 mr-2 ">
        &copy; {new Date().getFullYear()}{' '}
        <span className="text-blue-400">
          <a href="https://github.com/drensokoli/clicknotes">ClickNotes</a>
        </span>
      </p>
    </footer>
  );
};

export default Footer;