import React, { useState, useEffect } from "react";

import FriendRequest from "./FriendRequest";

type FriendRequestDisplayProps = {
  friend_requests: any[];
};

const FriendRequestDisplay = ({ friend_requests }: FriendRequestDisplayProps) => {
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
