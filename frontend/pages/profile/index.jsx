import React from 'react';

import Navbar from '../../components/navbar/Navbar';

function Profile() {
    return <>
        <div className="flex flex-col items-center justify-center space-y-4">
            <img
                src="https://via.placeholder.com/150"
                alt="Profile picture"
                className="w-32 h-32 rounded-full"
            />
            <h1 className="text-3xl font-bold">John Doe</h1>
            <p className="text-lg">Software Developer</p>
            <div className="flex space-x-4">
                <a href="#" className="text-blue-500">
                    Twitter
                </a>
                <a href="#" className="text-blue-500">
                    LinkedIn
                </a>
                <a href="#" className="text-blue-500">
                    GitHub
                </a>
            </div>
        </div>
    </>
}

export default Profile