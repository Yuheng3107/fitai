import React, { useState, useEffect } from "react";

import { backend } from "../../App";

import ToggleBar from "./ToggleBar";
import KeyProfileInfoDisplay from "./KeyProfileInfoDisplay";
import ExerciseStatsDisplay from "./ExerciseStatsDisplay";
import UserPosts from "./UserPosts";
import { ProfileData, ExerciseStats } from "../../types/stateTypes";

type UserProfileProps = {
  profileData: ProfileData;
  exerciseStats: ExerciseStats;
  userPostData: null;
};

const UserProfileTemplate = ({ profileData, exerciseStats, userPostData }: UserProfileProps) => {
  const [isTrend, setTrend] = useState(true);

  return (
    <div>
      <KeyProfileInfoDisplay profileData={profileData} />
      <ToggleBar isTrend={isTrend} setTrend={setTrend} />
      {isTrend === true ?
        <ExerciseStatsDisplay trendData={exerciseStats} />
        :
        <UserPosts userPostData={userPostData} />
      }
    </div>
  )
};

export default UserProfileTemplate;
