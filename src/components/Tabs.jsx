import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { FaWallet } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';

const tabs = [
  { path: '/dashboard', label: 'Home', icon: <AiFillHome size={24} /> },
  { path: '/budget', label: 'Budget', icon: <FaWallet size={24} /> },
  { path: '/settings', label: 'Settings', icon: <FiSettings size={24} /> },
];

const Tabs = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-300 shadow-md">
      <ul className="flex justify-around items-center py-2">
        {tabs.map((tab) => (
          <li key={tab.path} className="flex-1">
            <NavLink
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center text-sm ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`
              }
            >
              {tab.icon}
              <span>{tab.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
