// loginForm.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Navigation from './components/Navigation';
import '../css/styles.css';
const reactRoot = document.getElementById('login-root');
const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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


    const handleLogin = (e) => {
        e.preventDefault();

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',

            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/dashboard'; // Or wherever you want to redirect after a successful login
                } else {
                    setErrorMessage(data.errorMessage || 'Login failed.');
                }
            })
            .catch(error => {
                setErrorMessage('An error occurred. Please try again.');
            });
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 dark:text-slate-50 h-screen">
            <Navigation isLoggedIn={data.loggedIn} />
            <div className="flex justify-center items-center h-full">
                <div className="w-1/3 bg-white p-8 rounded shadow-lg">
                    {errorMessage && <div className="bg-red-500 text-white p-3 rounded mb-4">{errorMessage}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username:</label>
                            <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password:</label>
                            <input type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <div>
                            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

const root = ReactDOM.createRoot(reactRoot);
root.render(<LoginForm />);