import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Navigation from './components/Navigation';
import '../css/styles.css';
import ReactSkinview3d from "react-skinview3d"
import { WalkingAnimation } from "../../node_modules/react-skinview3d/node_modules/skinview3d"



const reactRoot = document.getElementById('react-root');
 
const Dashboard = () => {
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

    console.log(data);

    return (
        <div className='bg-gray-100 dark:bg-gray-800 dark:text-slate-50 h-screen'>
            <Navigation isLoggedIn={data.loggedIn} />
            <div className='container mx-auto h-screen'>
                <div className='grid grid-cols-2 my-8 content-between items-center w-full'>
                    <h1 className='text-4xl antialiased font-bold '>Willkommen, {data.username}!</h1>
                    <p className='text-right'>Das ist dein Dashboard.</p>
                </div>

                <div className='grid xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-2 gap-8 my-8 content-between'>
                    <div className='rounded bg-gray-200 shadow-md overflow-hidden'>

                        <ReactSkinview3d
                            skinUrl={data.skinUrl}
                            height="300"
                            width="300"
                            className='mx-auto'
                            onReady={({ viewer }) => {
                                // Enabled auto rotate
                                viewer.animation = new WalkingAnimation();
                                viewer.loadPanorama('/assets/img/panorama.png');

                            }}
                        />

                    </div>
                    <div className='xl:col-span-4 lg:col-span-4 md:col-span-1'>
                        <h2 className='text-2xl antialiased font-bold '>Newsfeed</h2>
                        <div className='bg-gray-200 shadow-md overflow-hidden'>
                            <div className='p-4'>
                                <h3 className='text-xl antialiased font-bold '>Neue Website</h3>
                                <p className='text-gray-700'>Wir haben eine neue Website! Diese ist noch nicht ganz fertig, aber wir arbeiten daran.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(reactRoot);
root.render(<Dashboard />);
