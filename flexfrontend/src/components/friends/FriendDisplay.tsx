import React, { useState, useEffect } from "react";

import { backend } from "../../App";

import ToggleBar from "../profile/ToggleBar";
import KeyProfileInfoDisplay from "../profile/KeyProfileInfoDisplay";
import ExerciseStatsDisplay from "../profile/ExerciseStatsDisplay";
import UserPosts from "../profile/UserPosts";
import { ProfileData, ExerciseStats } from "../../types/stateTypes";
import FriendCard from "./FriendCard";

type FriendDisplayProps = {
  friend_requests: any[];
};

const FriendDisplay = ({ friend_requests }: FriendDisplayProps) => {
  const [isTrend, setTrend] = useState(true);
  return (
    <div>
      {friend_requests.length === 0 ? 
        <div className="text-center">No Friend Requests</div>
      :
        friend_requests.map(item => (
          <FriendCard profileId={item} key={item}/>
      ))}
    </div>
  )
};

export default FriendDisplay;
