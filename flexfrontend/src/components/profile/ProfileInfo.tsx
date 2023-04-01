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
    return <div>
        <img className='rounded-full border border-indigo-500' src={imageUrl} />
        <p>{profileData?.username}</p>
    </div>
}

export default ProfileInfo;