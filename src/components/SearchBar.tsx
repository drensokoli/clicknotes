import React from 'react';

interface Props {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<Props> = ({ input, handleInputChange }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-5/6 lg:w-2/3 mx-auto drop-shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-md">
      <div className="relative">
        <svg className="w-5 h-5 text-gray-400 absolute top-3.5 left-4" fill="currentColor" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
        </svg>
        <input
          type="text"
          placeholder="Enter title"
          value={input}
          onChange={handleInputChange}
          className="bg-white h-12 w-full px-12 rounded-lg focus:outline-none hover:cursor-pointer"
        />
      </div>
    </form>
  );
};

export default SearchBar;
