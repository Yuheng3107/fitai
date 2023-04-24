import React, { useState, useEffect } from "react";
import FriendCard from "./FriendCard";

type FriendDisplayProps = {
  friends: any[];
};

const FriendDisplay = ({ friends }: FriendDisplayProps) => {
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
