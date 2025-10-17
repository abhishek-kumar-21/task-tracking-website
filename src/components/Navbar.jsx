import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-center bg-indigo-700 text-white py-3 shadow-md">
      <ul className="flex gap-10 text-lg font-medium">
        <li className="cursor-pointer hover:text-indigo-200 transition-all">Home</li>
        <li className="cursor-pointer hover:text-indigo-200 transition-all">Tasks</li>
      </ul>
    </nav>
  );
};

export default Navbar;
