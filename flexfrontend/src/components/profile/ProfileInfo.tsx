import React, { useState, useEffect } from 'react';

import { backend } from '../../App';

type ProfileInfoProps = {
    profileData: {
        achivements: any[];
        username: string;
        email: string;
        profile_photo: string;
    } | null
}

const ProfileInfo = ({ profileData }: ProfileInfoProps) => {
    const [imageUrl, setImageUrl] = useState("");
    console.log("I'm rerendering");
    useEffect(() => {
        if (profileData?.profile_photo) {
            setImageUrl(backend.concat(profileData.profile_photo));
        }
    }, [profileData?.profile_photo])

    console.log(profileData?.username);
    return <div id="userInfo" className="flex flex-col items-center justify-evenly">
        <img className='rounded-full border border-indigo-500 w-2/5' src={imageUrl} />
        <span id="username" className="text-3xl">{profileData?.username}</span>
        <span id="achievements">HAHA ACHIEVEMENTS EXIST</span>
        <div id="user-stats" className="flex flex-row items-center justify-evenly w-full">
            <div id="reps" className="flex flex-col items-center justify-evenly">
                <span className="text-xl font-semibold">12.4k</span>
                <span className="text-l">Repitions</span>
            </div>
            <div id="perfect" className="flex flex-col items-center justify-evenly">
                <span className="text-xl font-semibold">94%</span>
                <span className="text-l">Perfect</span>
            </div>
            <div id="followers" className="flex flex-col items-center justify-evenly">
                <span className="text-xl font-semibold">69</span>
                <span className="text-l">Followers</span>
            </div>
        </div>
        <div id="toggle-bar" className="p-5 border border-zinc-500 p-2 rounded-lg w-10/12">

        </div>
        <div id="exercise-stats" className="flex flex-col justify-start w-full mt-2 h-screen">
            <div className="flex flex-row justify-evenly w-full px-10">
                <div className="flex flex-col border border-zinc-500 p-2 rounded-lg h-full">
                    <span className="text-xs">Favourite Exercise</span>
                    <span className="text-3xl">Squats</span>
                    <div>
                        <span className="text-xs font-semibold">9320</span>
                        <span className="text-xs"> Reps</span>
                    </div>
                    <div>
                        <span className="text-xs font-semibold">89%</span>
                        <span className="text-xs"> Perfect</span>
                    </div>
                </div>
                <div className="flex flex-col justify-evenly">
                    <div className="flex flex-col border border-zinc-500 p-2 rounded-lg">
                        <span className="text-xs">Longest Streak</span>
                        <span className="text-xl">324 days</span>
                    </div>
                    <div className="flex flex-col border border-zinc-500 p-2 rounded-lg mt-2">
                        <span className="text-xs">Calories Burnt</span>
                        <span className="text-xl">46000 kcal</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default ProfileInfo;