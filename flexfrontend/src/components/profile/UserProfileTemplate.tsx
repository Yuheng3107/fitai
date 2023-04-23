import React, { useState, useEffect } from "react";

import { backend } from "../../App";

import ToggleBar from "./ToggleBar";
import KeyProfileInfoDisplay from "./KeyProfileInfoDisplay";
import ExerciseStatsDisplay from "./ExerciseStatsDisplay";
import Posts from "../Feed/Posts";
import { ProfileData, ExerciseStats } from "../../types/stateTypes";

type UserProfileTemplateProps = {
  profileData: ProfileData;
  exerciseStats: ExerciseStats;
  userPostArray: any[];
  loadUserPostData: () => void;
};

const UserProfileTemplate = ({ profileData, exerciseStats, userPostArray, loadUserPostData }: UserProfileTemplateProps) => {
  useEffect(() => {
    loadUserPostData();
  },[])
  const [isTrend, setTrend] = useState(true);
  return (
    <div>
      <KeyProfileInfoDisplay profileData={profileData} />
      <ToggleBar isTrend={isTrend} setTrend={setTrend} />
      {isTrend === true ?
        <ExerciseStatsDisplay exerciseStats={exerciseStats} />
        :
        <Posts 
          posts={{
            postArray: userPostArray,
            profileArray: [profileData],
            communityArray: [null],
          }} 
          loadData={loadUserPostData}
          />
      }
    </div>
  )
};

export default UserProfileTemplate;
