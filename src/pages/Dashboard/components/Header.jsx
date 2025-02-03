import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

const Header = () => {
  const { currentUser } = useAuth();
  console.log('currn', currentUser);
  return (
    <header className="flex items-center p-4  w-full max-w-4xl mx-auto  font-sans">
      <div className="flex items-center space-x-4">
        <FaUserCircle className="w-[2rem] h-[2rem] text-neutral-300" />
        <span className="text-sm font-semibold text-neutral-100 tracking-wide">
          Hi, {currentUser.displayName}
        </span>
      </div>
    </header>
  );
};

export default Header;
