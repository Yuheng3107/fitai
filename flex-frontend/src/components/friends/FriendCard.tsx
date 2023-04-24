import React, { useState, useEffect } from "react";

import { IonButton, IonRouterLink } from '@ionic/react';
import { ProfileData, emptyProfileData } from "../../types/stateTypes";

import { deleteFriend } from "../../utils/data/friends";
import { getOtherProfileDataAsync } from "../../utils/data/profile";

import { backend } from "../../App";

type FriendCardProps = {
  profileId: number;
};

function FriendCard({ profileId }:FriendCardProps) {
    const [imageUrl, setImageUrl] = useState("");
    const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData);
    const [isFriend, setIsFriend] = useState(true);
  
    const removeFriend = async () => {
      let response = await deleteFriend(profileId);
      if (response?.status === 200) setIsFriend(false);
    }
    const getProfileData = async () => {
      setProfileData(await(getOtherProfileDataAsync(profileId)))
    }
    useEffect(() => {
      getProfileData();
      if (profileData?.profile_photo) {
        setImageUrl(backend.concat(profileData.profile_photo))
      }
    }, [profileData?.profile_photo, isFriend, setIsFriend])
  
    return (
      <div className="border border-zinc-500 mt-4 p-2 flex flex-row justify-evenly items-center">
        <IonRouterLink routerLink={`/home/profile/${profileData.id}`} routerDirection="forward">
          <img
            alt="profile-picture"
            src={imageUrl}
            className="h-12 w-12 rounded-full object-cover"
          />
        </IonRouterLink>
        <div className="ml-3 flex flex-row items-center">
          <IonRouterLink routerLink={`/home/profile/${profileData.id}`} routerDirection="forward" id="username" className="font-semibold text-black">
            {profileData?.username}
          </IonRouterLink>
        </div>
        <IonButton onClick={removeFriend}>{ isFriend ? "Remove Friend" : "Friend Removed"}</IonButton>
      </div>
    );
}

export default FriendCard;