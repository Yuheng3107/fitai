import React, { useState, useEffect } from "react";

import { IonButton } from '@ionic/react';
import { ProfileData, emptyProfileData } from "../../types/stateTypes";

import { acceptFriendRequest, declineFriendRequest } from "../../utils/friends";
import { getOtherProfileDataAsync } from "../../utils/getData/getProfileData";

import { backend } from "../../App";

type FriendRequestProps = {
  profileId: number;
};

const FriendRequest = ({ profileId }: FriendRequestProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData);

  const acceptRequest = async () => {
    await acceptFriendRequest(profileId);
  }
  const declineRequest = async () => {
    await declineFriendRequest(profileId);
  }
  const getProfileData = async () => {
    setProfileData(await(getOtherProfileDataAsync(profileId)))
  }
  useEffect(() => {
    getProfileData();
    if (profileData?.profile_photo) {
      setImageUrl(backend.concat(profileData.profile_photo))
    }
  }, [profileData?.profile_photo])

  return (
    <div className="border border-zinc-500 mt-4 p-2 flex flex-row justify-evenly items-center">
      <a href={`/profile/${profileData.id}`}>
        <img
          alt="profile-picture"
          src={imageUrl}
          className="h-12 w-12 rounded-full object-cover"
        />
      </a>
      <div className="ml-3 flex flex-row items-center">
        <a id="username" className="font-semibold text-black" href={`/profile/${profileData.id}`}>
          {profileData?.username}
        </a>
      </div>
      <IonButton onClick={acceptRequest}>Accept</IonButton>
      <IonButton onClick={declineRequest}>Decline</IonButton>
    </div>
  );
};

export default FriendRequest;
