import React, { useState, useEffect } from "react";

import { backend } from "../../App";
import PersonTextCard from "../Feed/PersonTextCard";
import { ProfileData, UserPostData } from "../../types/stateTypes";

type userPostProps = {
  profileData: ProfileData;
  userPostArray: any[];
  loadUserPostData: () => void;
};

const UserPosts = ({ profileData, userPostArray, loadUserPostData }: userPostProps) => {
  return (
    <div
      id="userFeed"
      className="flex flex-col justify-start w-full h-full px-5"
    >
      {userPostArray.map(item => (
        <PersonTextCard userPostData={item} profileData={profileData}/>
      ))}
      <button onClick={loadUserPostData}>Load More</button>
    </div>
  );
};

export default UserPosts;
