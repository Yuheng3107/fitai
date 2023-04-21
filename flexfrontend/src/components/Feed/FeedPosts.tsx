import React, { useState, useEffect } from "react";

import { backend } from "../../App";
import PersonTextCard from "./PersonTextCard";
import { ProfileData, UserPostData } from "../../types/stateTypes";

import {
  IonButton,
} from '@ionic/react';

type userPostProps = {
  feedPostArray: any[];
  loadFeedData: () => void;
};

const FeedPosts = ({ feedPostArray, loadFeedData }: userPostProps) => {
  useEffect(() => {
    loadFeedData();
  }, [])
  return (
    <div
      id="userFeed"
      className="flex flex-col justify-start w-full h-full px-5"
    >
      {feedPostArray.length === 0 ? 
        <div className="text-center">No More Posts</div>
      :
        feedPostArray.map(item => (
          <PersonTextCard userPostData={item.postData} profileData={item.profileData} key={item.postData.id}/>
      ))}
      <IonButton onClick={loadFeedData}>Load More</IonButton>
    </div>
  );
};

export default FeedPosts;
