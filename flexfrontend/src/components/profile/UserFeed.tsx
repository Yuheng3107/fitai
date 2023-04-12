import React, { useState, useEffect } from "react";

import { backend } from "../../App";

type UserFeedProps = {
  userFeedData: {

  } | null;
};

const UserFeed = ({ userFeedData }: UserFeedProps) => {
  return (
    <div
      id="userFeed"
      className="flex flex-col justify-start w-full mt-2 h-full px-5"
    >
      <div>
        PLACEHOLDERS
      </div>
    </div>
  )
};

export default UserFeed;
