import React, { useState, useEffect } from "react";

import { backend } from "../../App";

import ToggleBar from "./ToggleBar";
import Achievements from "./Achievements";
import KeyStats from "./KeyStats";
import ProfilePic from "./ProfilePic";

type ProfileInfoProps = {
  profileData: {
    achievements: any[];
    username: string;
    email: string;
    profile_photo: string;
  } | null;
};

const ProfileInfo = ({ profileData }: ProfileInfoProps) => {
  const [imageUrl, setImageUrl] = useState("");
  console.log("I'm rerendering");
  useEffect(() => {
    if (profileData?.profile_photo) {
      setImageUrl(backend.concat(profileData.profile_photo));
    }
  }, [profileData?.profile_photo]);

  const [isTrend, setTrend] = useState(true);
  console.log(profileData?.username);
  return isTrend ? (
    <div id="userInfo" className="flex flex-col items-center justify-evenly">
      <ProfilePic imageUrl={imageUrl}></ProfilePic>
      <span id="username" className="text-3xl">
        {profileData?.username}
      </span>

      <Achievements achievements={profileData?.achievements}></Achievements>
      <KeyStats></KeyStats>
      <ToggleBar isTrend={isTrend} setTrend={setTrend}></ToggleBar>

      <div
        id="exercise-stats"
        className="flex flex-col justify-start w-full mt-2 h-screen px-10"
      >
        <div className="flex flex-row justify-between w-full">
          <div
            id="fav-exercise"
            className="flex flex-col border border-zinc-500 p-2 rounded-lg h-full w-5/12"
          >
            <span className="text-xs">Favourite Exercise</span>
            <span className="text-2xl">Squats</span>
            <div>
              <span className="text-sm font-semibold">9320</span>
              <span className="text-xs"> Reps</span>
            </div>
            <div>
              <span className="text-sm font-semibold">89%</span>
              <span className="text-xs"> Perfect</span>
            </div>
          </div>
          <div className="flex flex-col justify-evenly w-5/12">
            <div
              id="streak"
              className="flex flex-col border border-zinc-500 p-2 rounded-lg"
            >
              <span className="text-xs">Longest Streak&#9889;</span>
              <span className="text-xl">324 days</span>
            </div>
            <div
              id="calories"
              className="flex flex-col border border-zinc-500 p-2 rounded-lg mt-2"
            >
              <span className="text-xs">Calories Burnt&#128293; </span>
              <span className="text-xl">46000 kcal</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-evenly mt-2">
          <div
            id="workout"
            className="flex flex-col border border-zinc-500 p-2 rounded-lg w-full"
          >
            <span className="text-xs">Favourite Workout</span>
            <span className="text-3xl">HIIT</span>
            <div>
              <span className="text-sm font-semibold">42</span>
              <span className="text-xs"> Times</span>
            </div>
            <div>
              <span className="text-sm font-semibold">11</span>
              <span className="text-xs"> hrs </span>
              <span className="text-sm font-semibold">42</span>
              <span className="text-xs"> mins</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-evenly mt-2">
          <div
            id="breakdown"
            className="flex flex-col border border-zinc-500 p-2 rounded-lg w-full"
          >
            <span className="text-xs">Exercise Breakdown</span>
            <span className="text-3xl">IMAGE HERE</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <ToggleBar isTrend={isTrend} setTrend={setTrend}></ToggleBar>
    </div>
  );
};

export default ProfileInfo;
