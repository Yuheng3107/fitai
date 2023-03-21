import React, { ProfilerOnRenderCallback } from 'react';

interface ProfileDataType {
    achivements:[];
    username:"";
    email:"zhangjem2002@gmail.com";
    profile_photo: null | string;
}

const ProfileInfo: React.FC<{ profileData: object }> = (props) => {
    const placeholder = ""
    console.log(props.profileData.username);
    return <div>
        <img src="placeholder" />
        <p>{props.profileData["username"]}</p>
    </div>
}

export default ProfileInfo;