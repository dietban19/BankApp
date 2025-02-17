import React from 'react';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

function Settings() {
  const { logout } = useAuth();
  return (
    <div className="flex flex-col h-screen bg-green-600 p-4">
      {/* Sidebar */}
      <div className="bg-white p-4 shadow-lg rounded-lg mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
        <nav className="flex flex-col space-y-2 mt-2">
          <button className="flex items-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <FiSettings className="mr-2" /> General Settings
          </button>
          <button
            onClick={logout}
            className="flex items-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-gray-800">Settings Page</h1>
        <p className="text-gray-600 mt-2">Manage your account settings here.</p>
      </div>
    </div>
  );
}

export default Settings;
