import React, { useState, useEffect } from "react";

import { backend } from "../../App";

import ToggleBar from "../profile/ToggleBar";
import KeyProfileInfoDisplay from "../profile/KeyProfileInfoDisplay";
import ExerciseStatsDisplay from "../profile/ExerciseStatsDisplay";
import UserPosts from "../profile/UserPosts";
import { ProfileData, ExerciseStats } from "../../types/stateTypes";
import FriendRequest from "./FriendRequest";

type FriendRequestDisplayProps = {
  friend_requests: any[];
};

const FriendRequestDisplay = ({ friend_requests }: FriendRequestDisplayProps) => {
  const [isTrend, setTrend] = useState(true);
  return (
    <div>
      {friend_requests.length === 0 ? 
        <div className="text-center">No Friend Requests</div>
      :
        friend_requests.map(item => (
          <FriendRequest profileId={item} key={item}/>
      ))}
    </div>
  )
};

export default FriendRequestDisplay;
