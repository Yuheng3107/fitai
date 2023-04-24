import React, { useState, useEffect } from "react";

import { IonButton, IonRouterLink } from '@ionic/react';
import { ProfileData, emptyProfileData } from "../../types/stateTypes";

import { acceptFriendRequest, declineFriendRequest } from "../../utils/data/friends";
import { getOtherProfileDataAsync } from "../../utils/data/profile";

import { backend } from "../../App";

type FriendRequestProps = {
  profileId: number;
};

const FriendRequest = ({ profileId }: FriendRequestProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData);
  // 0 is pending, 1 is accepted, 2 is declined
  const [requestState, setRequestState] = useState(0);

  const acceptRequest = async () => {
    let response = await acceptFriendRequest(profileId);
    if (response?.status === 200) setRequestState(1);
  }
  const declineRequest = async () => {
    let response = await declineFriendRequest(profileId);
    if (response?.status === 200) setRequestState(2);
  }
  const getProfileData = async () => {
    setProfileData(await(getOtherProfileDataAsync(profileId)))
  }
  useEffect(() => {
    getProfileData();
    if (profileData?.profile_photo) {
      setImageUrl(backend.concat(profileData.profile_photo))
    }
  }, [profileData?.profile_photo, requestState, setRequestState])

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
      { requestState === 0 ?
        <div>
          <IonButton onClick={acceptRequest}>Accept</IonButton>
          <IonButton onClick={declineRequest}>Decline</IonButton>
        </div>
      : requestState === 1 ?
        <div>Request Accepted.</div>
      :
        <div>Request Declined.</div>
      }
    </div>
  );
};

export default FriendRequest;
