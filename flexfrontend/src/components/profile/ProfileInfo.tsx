import React, { useState, useEffect } from "react";

import { backend } from "../../App";

import ToggleBar from "./ToggleBar";
import Achievements from "./Achievements";
import KeyStats from "./KeyStats";
import ProfilePic from "./ProfilePic";

type ProfileInfoProps = {
  profileData: {
    achievements: any[];
    username: string;
    email: string;
    profile_photo: string;
    bio: string;
    followers: any[];
    reps: number;
    perfect_reps: number;
  } | null;
  isTrend: boolean;
};

const ProfileInfo = ({ profileData, isTrend }: ProfileInfoProps) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (profileData?.profile_photo) {
      setImageUrl(backend.concat(profileData.profile_photo));
    }
  }, [profileData?.profile_photo]);

  return isTrend ? (
    <div id="userInfo" className="flex flex-col items-center justify-evenly">
      <ProfilePic imageUrl={imageUrl} />
      <span id="username" className="text-3xl">
        {profileData?.username}
      </span>

      <Achievements achievements={profileData?.achievements} />
      <KeyStats
        followers={profileData?.followers?.length}
        reps={profileData?.reps}
        perfect_reps={profileData?.perfect_reps}
      />
    </div>
  ) : (
    <div className="flex flex-col justify-evenly m-4">
      <span id="username" className="text-3xl">
        {profileData?.username}
      </span>
      <div className="flex flex-row items-center justify-between">
        <ProfilePic imageUrl={imageUrl} />
        <div className="flex flex-col items-center justify-between w-11/12">
          <KeyStats
            followers={profileData?.followers?.length}
            reps={profileData?.reps}
            perfect_reps={profileData?.perfect_reps}
          />
          <Achievements achievements={profileData?.achievements} />
        </div>
      </div>
      <div id="bio" className="text-l mt-4">
        {profileData?.bio}
      </div>
    </div>
  );
};

export default ProfileInfo;
