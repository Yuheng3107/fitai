import React, { useState, useEffect } from "react";

import { backend } from "../../App";
import PersonTextCard from "./PersonTextCard";

import {
  IonButton,
} from '@ionic/react';

type PostProps = {
  posts: {
    postArray: any[],
    profileArray: any[],
    communityArray: any[],
  };
  loadData: () => void;
};

let hasLoaded = false;
const Posts = ({ posts, loadData }: PostProps) => {
  return (
    <div
      id="userFeed"
      className="flex flex-col justify-start w-full h-full px-5"
    >
      {posts.postArray.length === 0 ? 
        <div className="text-center">No More Posts</div>
      :
        posts.postArray.map((item, i) => (
          <PersonTextCard 
            userPostData={item} 
            profileData={posts.profileArray.length === 1 ? posts.profileArray[0]:posts.profileArray[i]} 
            communityData={posts.communityArray.length === 1 ? posts.communityArray[0]:posts.communityArray[i] } 
            key={item.id}
          />
      ))}
      <IonButton onClick={loadData}>Load More</IonButton>
    </div>
  );
};

export default Posts;
