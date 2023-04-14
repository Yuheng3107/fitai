import React, { useState, useEffect } from "react";

import { backend } from "../../App";

import ToggleBar from "./ToggleBar";
import KeyProfileInfoDisplay from "./KeyProfileInfoDisplay";
import ExerciseStatsDisplay from "./ExerciseStatsDisplay";
import UserFeed from "./UserFeed";
import { ProfileData, ExerciseStats } from "../../types/stateTypes";

type UserProfileTemplateProps = {
  profileData: ProfileData;
  exerciseStats: ExerciseStats;
  userFeedData: null;
};

const UserProfileTemplate = ({ profileData, exerciseStats, userFeedData }: UserProfileTemplateProps) => {
  const [isTrend, setTrend] = useState(true);

  return (
    <div>
      <KeyProfileInfoDisplay profileData={profileData} />
      <ToggleBar isTrend={isTrend} setTrend={setTrend} />
      {isTrend === true ?
        <ExerciseStatsDisplay exerciseStats={exerciseStats} />
        :
        <UserFeed userFeedData={userFeedData} />
      }
    </div>
  )
};

export default UserProfileTemplate;
