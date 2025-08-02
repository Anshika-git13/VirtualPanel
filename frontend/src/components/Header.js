import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-gray-900 gradient-text">
            Virtual Panel
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/resume-score" 
              className={`transition-colors duration-200 ${
                isActive('/resume-score') 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resume Score
            </Link>
            <Link 
              to="/interview" 
              className={`transition-colors duration-200 ${
                isActive('/interview') 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mock Interview
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;