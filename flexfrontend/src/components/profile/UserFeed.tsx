import React, { useState, useEffect } from "react";

import { backend } from "../../App";
import PersonTextCard from "../Feed/PersonTextCard";
type UserFeedProps = {
  userFeedData: {} | null;
};

const UserFeed = ({ userFeedData }: UserFeedProps) => {
  return (
    <div
      id="userFeed"
      className="flex flex-col justify-start w-full h-full px-5"
    >
      <PersonTextCard></PersonTextCard>
    </div>
  );
};

export default UserFeed;
