import React, { useState, useEffect } from "react";

import { backend } from "../../App";

import ToggleBar from "../profile/ToggleBar";
import KeyProfileInfoDisplay from "../profile/KeyProfileInfoDisplay";
import ExerciseStatsDisplay from "../profile/ExerciseStatsDisplay";
import UserPosts from "../profile/UserPosts";
import { ProfileData, ExerciseStats } from "../../types/stateTypes";
import FriendCard from "./FriendCard";

type FriendDisplayProps = {
  friends: any[];
};

const FriendDisplay = ({ friends }: FriendDisplayProps) => {
  const [isTrend, setTrend] = useState(true);
  return (
    <div>
      {friends.length === 0 ? 
        <div className="text-center">No Friends</div>
      :
        friends.map(item => (
          <FriendCard profileId={item} key={item}/>
      ))}
    </div>
  )
};

export default FriendDisplay;
