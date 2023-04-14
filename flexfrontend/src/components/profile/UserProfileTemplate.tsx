import React, { useState, useEffect } from "react";

import { backend } from "../../App";

import ToggleBar from "./ToggleBar";
import KeyProfileInfoDisplay from "./KeyProfileInfoDisplay";
import Trend from "./Trend";
import UserFeed from "./UserFeed";
import { ProfileData, TrendData } from "../../types/stateTypes";

type UserProfileProps = {
  profileData: ProfileData;
  trendData: TrendData;
  userFeedData: null;
};

const UserProfileTemplate = ({ profileData, trendData, userFeedData }: UserProfileProps) => {
  const [isTrend, setTrend] = useState(true);

  return (
    <div>
      <KeyProfileInfoDisplay profileData={profileData} />
      <ToggleBar isTrend={isTrend} setTrend={setTrend} />
      {isTrend === true ?
        <Trend trendData={trendData} />
        :
        <UserFeed userFeedData={userFeedData} />
      }
    </div>
  )
};

export default UserProfileTemplate;
