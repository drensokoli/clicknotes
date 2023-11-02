import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white p-4 bottom-0 w-full z-10 flex flex-col items-center justify-center">
      <Link href="https://affiliate.notion.so/8ieljsf8weuq" target='_blank' aria-label='Notion'>
        <Image src="/affiliate-black.png" alt="logo" width={150} height={150} className='p-2' />
      </Link>
      <h1 className='text-gray-800'>Made with ❤️ by
        <span className="text-blue-400">
          <Link href="https://www.linkedin.com/in/dren-sokoli-0003a81a1/" target="_blank" aria-label='Dren Sokoli LinkedIn Profile'> Dren Sokoli</Link>
        </span>
      </h1>
      <p className="text-gray-800 mr-2 ">
        &copy; {new Date().getFullYear()}{' '}
        <span className="text-blue-400">
          <Link href="https://github.com/drensokoli/clicknotes" target="_blank" aria-label='ClickNotes GitHub Repo'>ClickNotes</Link>
        </span>
      </p>
    </footer>
  );
};

export default Footer;