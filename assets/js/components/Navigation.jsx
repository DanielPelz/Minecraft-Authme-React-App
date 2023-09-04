import React, { useState, useEffect } from 'react';
import { LuLogOut, LuLayoutDashboard } from 'react-icons/lu';


function Navigation({ isLoggedIn }) {
    const isOnDashboard = location.pathname === '/dashboard';

    const storedDarkModePreference = window.localStorage.getItem('dark-mode') === 'true';
    const [darkMode, setDarkMode] = useState(storedDarkModePreference);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        // Save preference in localStorage
        window.localStorage.setItem('dark-mode', (!darkMode).toString());

        // Update state 
        setDarkMode(!darkMode);
    };

    return (
        <nav className="bg-gray-100 dark:bg-gray-800 dark:text-slate-50 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <a className="font-bold text-xl" href="/">Pentacraft</a>
                {!isOnDashboard && (
                    <div className='center-menu'>
                        <ul className='flex items-center gap-3'>
                            <li><a href='/'>Home</a></li>
                            <li><a href='/'>About</a></li>
                            <li><a href='/'>Contact</a></li>
                        </ul>
                    </div>
                )}

                <div className='flex'>
                    {isLoggedIn ? (
                        <div className='flex items-center gap-3 right-menu'>
                            {/* Dark Mode Toggle Button */}
                            <button
                                title="Toggle Theme"
                                onClick={toggleDarkMode}
                                className="
                    w-12 
                    h-6 
                    rounded-full 
                    p-1 
                    bg-gray-200 
                    dark:bg-gray-600 
                    relative 
                    transition-colors 
                    duration-500 
                    ease-in
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-700 
                    dark:focus:ring-blue-600 
                    focus:border-transparent
                "
                            >
                                <div id="toggle"
                                    className="
                        rounded-full 
                        w-4 
                        h-4 
                        bg-blue-900 
                        dark:bg-blue-500 
                        relative 
                        ml-0 
                        dark:ml-6 
                        pointer-events-none 
                        transition-all 
                        duration-300 
                        ease-out
                    "
                                >
                                </div>
                            </button>
                            {/* Only show Dashboard Icon if user is not on the dashboard */}
                            {!isOnDashboard && (
                                <a href='/dashboard' className='hover:bg-gray-300 rounded p-2 transition ease-in-out'>
                                    <LuLayoutDashboard /> {/* Replace this with your actual dashboard icon component */}
                                </a>
                            )}
                            <a href='/logout' className='hover:bg-gray-300 rounded p-2 transition ease-in-out'>
                                <LuLogOut />
                            </a>
                        </div>
                    ) : (
                        <div className='flex items-center gap-3 right-menu'>
                            <a href='/login' className='hover:bg-gray-300 rounded p-2 transition ease-in-out'>Login</a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );

}

export default Navigation;
