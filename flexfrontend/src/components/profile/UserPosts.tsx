import React, { useState, useEffect } from "react";

import { backend } from "../../App";
import PersonTextCard from "../Feed/PersonTextCard";
type userPostProps = {
  userPostData: {} | null;
};

const UserPosts = ({ userPostData }: userPostProps) => {
  return (
    <div
      id="userFeed"
      className="flex flex-col justify-start w-full h-full px-5"
    >
      <PersonTextCard></PersonTextCard>
    </div>
  );
};

export default UserPosts;
