import React, { useState, useEffect } from "react";

import { backend } from "../../App";
import TrendingUpIcon from "../../assets/svgComponents/TrendingUpIcon"
import GridViewIcon from "../../assets/svgComponents/GridViewIcon"

type ProfileInfoProps = {
  profileData: {
    achivements: any[];
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

  console.log(profileData?.username);
  return (
    <div id="userInfo" className="flex flex-col items-center justify-evenly">
      <img
        className="rounded-full w-1/3 mt-2 p-1"
        src={imageUrl}
      />
      <span id="username" className="text-3xl">
        {profileData?.username}
      </span>
      <span id="achievements">HAHA ACHIEVEMENTS EXIST</span>
      <div
        id="user-stats"
        className="flex flex-row items-center justify-evenly w-full"
      >
        <div id="reps" className="flex flex-col items-center justify-evenly">
          <span className="text-xl font-semibold m-0">12.4k</span>
          <span className="text-l m-0">Repetitions</span>
        </div>
        <div id="perfect" className="flex flex-col items-center justify-evenly">
          <span className="text-xl font-semibold">94%</span>
          <span className="text-l">Perfect</span>
        </div>
        <div
          id="followers"
          className="flex flex-col items-center justify-evenly"
        >
          <span className="text-xl font-semibold">69</span>
          <span className="text-l">Followers</span>
        </div>
      </div>
      <div id="toggle-bar" className="pt-3 pb-1 border-b border-zinc-500 w-full grid grid-cols-2 justify-items-center">
        <TrendingUpIcon className="h-8"></TrendingUpIcon>
        <GridViewIcon className="h-8"></GridViewIcon>
      </div>
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
              <span className="text-xs">Longest Streak</span>
              <span className="text-xl">324 days</span>
            </div>
            <div
              id="calories"
              className="flex flex-col border border-zinc-500 p-2 rounded-lg mt-2"
            >
              <span className="text-xs">Calories Burnt</span>
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
  );
};

export default ProfileInfo;
