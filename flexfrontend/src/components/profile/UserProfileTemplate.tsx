import React, { useState, useEffect } from "react";

import { backend } from "../../App";

import ToggleBar from "./ToggleBar";
import KeyProfileInfoDisplay from "./KeyProfileInfoDisplay";
import ExerciseStatsDisplay from "./ExerciseStatsDisplay";
import UserPosts from "./UserPosts";
import { ProfileData, ExerciseStats } from "../../types/stateTypes";

type UserProfileTemplateProps = {
  profileData: ProfileData;
  exerciseStats: ExerciseStats;
  userPostArray: any[];
  loadUserPostData: () => void;
};

const UserProfileTemplate = ({ profileData, exerciseStats, userPostArray, loadUserPostData }: UserProfileTemplateProps) => {
  const [isTrend, setTrend] = useState(true);
  return (
    <div>
      <KeyProfileInfoDisplay profileData={profileData} />
      <ToggleBar isTrend={isTrend} setTrend={setTrend} />
      {isTrend === true ?
        <ExerciseStatsDisplay />
        :
        <UserPosts userPostArray={userPostArray} profileData={profileData} loadUserPostData={loadUserPostData} />
      }
    </div>
  )
};

export default UserProfileTemplate;
