import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Navigation from './components/Navigation';
import '../css/styles.css';



const reactRoot = document.getElementById('homepage-root');

const Homepage = () => {
    const [data, setData] = useState({ username: '', skinUrl: '' });
    useEffect(() => {
        fetch('/api/dashboard/data')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    return;
                }
                if (data.skinUrl && !data.skinUrl.startsWith('http')) {
                    data.skinUrl = `data:image/png;base64,${data.skinUrl}`;
                }
                setData(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error.message);
            });
    }, []);

    return (
        <div className='bg-gray-100 dark:bg-gray-800 dark:text-slate-50 h-screen'>
            <Navigation isLoggedIn={data.loggedIn} />
            <div className='container mx-auto h-screen'>


            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(reactRoot);
root.render(<Homepage />);
