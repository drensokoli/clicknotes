import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white p-4 bottom-0 w-full z-10 flex flex-col items-center justify-center">
      <a href="https://affiliate.notion.so/8ieljsf8weuq" target='_blank'>
        <Image src="/affiliate-black.png" alt="logo" width={150} height={150} className='p-2' />
      </a>
      <h1 className='text-gray-800'>Made with ❤️ by
        <span className="text-blue-400">
          <a href="https://www.linkedin.com/in/dren-sokoli-0003a81a1/" target="_blank"> Dren Sokoli</a>
        </span>
      </h1>
      <p className="text-gray-800 mr-2 ">
        &copy; {new Date().getFullYear()}{' '}
        <span className="text-blue-400">
          <a href="https://github.com/drensokoli/clicknotes" target="_blank">ClickNotes</a>
        </span>
      </p>
    </footer>
  );
};

export default Footer;