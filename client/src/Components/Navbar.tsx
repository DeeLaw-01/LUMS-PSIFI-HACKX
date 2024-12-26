import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-blue-400 font-bold text-2xl">
          <a href="/">Logo</a>
        </div>

        {/* Search Bar */}
        <div className="flex-grow max-w-lg">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Navigation Links & User Profile Picture */}
        <div className="flex items-center space-x-6">
          {/* Page Links */}
          <div className="flex space-x-6 text-slate-400">
            <a href="/" className="hover:text-blue-400">Home</a>
            <a href="/contact" className="hover:text-blue-400">Contact</a>
            <a href="/about" className="hover:text-blue-400">About</a>
          </div>

          {/* User Profile Picture */}
          <div className="relative">
            <img
              src="https://via.placeholder.com/40"
              alt="User Profile"
              className="w-10 h-10 rounded-full border-2 border-blue-400"
            />
            {/* You can add a dropdown or a menu next to the user icon if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
