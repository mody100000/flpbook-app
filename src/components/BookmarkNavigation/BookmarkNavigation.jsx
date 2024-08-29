import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BookmarkNavigation = ({ navItems }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-l-lg shadow-lg p-4">
                <ul className="space-y-4">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => handleNavigation(item.path)}
                                className={`
                  w-full text-left px-4 py-2 rounded-md transition-colors duration-200
                  ${location.pathname === item.path
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BookmarkNavigation;