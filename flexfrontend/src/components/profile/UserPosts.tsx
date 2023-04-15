import React, { useState, useEffect } from "react";

import { backend } from "../../App";
import PersonTextCard from "../Feed/PersonTextCard";
import { ProfileData, UserPostData } from "../../types/stateTypes";

import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonButtons,
  IonButton,
  IonSpinner
} from '@ionic/react';

type userPostProps = {
  profileData: ProfileData;
  userPostArray: any[];
  loadUserPostData: () => void;
};

let hasLoaded = false;
const UserPosts = ({ profileData, userPostArray, loadUserPostData }: userPostProps) => {
  useEffect(() => {
    if (hasLoaded === false) {
      loadUserPostData();
      hasLoaded = true;
    }
  })
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
