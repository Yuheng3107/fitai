import React, { useEffect } from "react";

import PersonTextCard from "../Feed/PersonTextCard";
import { ProfileData } from "../../types/stateTypes";

import {
  IonButton,
} from '@ionic/react';

type userPostProps = {
  profileData: ProfileData;
  userPostArray: any[];
  loadUserPostData: () => void;
};

const UserPosts = ({ profileData, userPostArray, loadUserPostData }: userPostProps) => {
  useEffect(() => {
    loadUserPostData();
  }, [])
  return (
    <div
      id="userFeed"
      className="flex flex-col justify-start w-full h-full px-5"
    >
      {userPostArray.length === 0 ? 
        <div className="text-center">No More Posts</div>
      :
        userPostArray.map(item => (
          <PersonTextCard userPostData={item} profileData={profileData} key={item.id}/>
      ))}
      <IonButton onClick={loadUserPostData}>Load More</IonButton>
    </div>
  );
};

export default UserPosts;
