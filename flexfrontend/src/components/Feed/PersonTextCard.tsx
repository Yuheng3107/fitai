import filledCircle from "../../assets/svg/circle_FILL1_wght400_GRAD0_opsz48.svg";
import FilledCircle from "../../assets/svgComponents/FilledCircle";
import CommentIcon from "../../assets/svgComponents/CommentIcon";
import LikeIcon from "../../assets/svgComponents/LikeIcon";
import BookmarkIcon from "../../assets/svgComponents/BookmarkIcon";
import SendIcon from "../../assets/svgComponents/SendIcon";

import React, { useState, useEffect } from "react";

import { backend } from "../../App";

import { UserPostData, ProfileData } from "../../types/stateTypes";

type UserPostProps = {
  userPostData: UserPostData;
  profileData: ProfileData;
};

const PersonTextCard = ({ userPostData, profileData }: UserPostProps) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (profileData?.profile_photo) {
      setImageUrl(backend.concat(profileData.profile_photo))
    }
  }, [profileData?.profile_photo])
  return (
    <div id="card-container" className="border border-zinc-500 mt-4 p-2">
      <div id="top-bar" className=" flex flex-row justify-between mb-2">
        <div className="flex flex-row">
          <img
            alt="profile-picture"
            src={imageUrl}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="ml-3">
            <span id="username" className="font-semibold">
              {profileData?.username}
            </span>
            <p
              id="subtitle"
              className="flex flex-row items-center text-sm text-gray-700"
            >
              <span id="post-place">Swimming</span>
              <FilledCircle className="mx-1 h-1.5 w-1.5 aspect-square fill-slate-500" />
              <span id="time-stamp">{userPostData?.posted_at}</span>
            </p>
          </div>
        </div>
        <button id="menu-button"></button>
      </div>
      <div id="content" className="mb-2">
        <p id="title" className="font-semibold text-xl mb-2">
          {userPostData?.title}
        </p>
        <p id="main-content" className="text-sm">
          {userPostData?.text}
        </p>
      </div>
      <div
        id="action-bar"
        className="flex flex-row items-center justify-evenly mx-auto"
      >
        <div className="bg-slate-300 rounded-full grow flex flex-row items-center justify-between">
          <input
            type="text"
            className="bg-transparent py-1 grow"
            placeholder="  comment"
          />
          <button>
            <SendIcon className="w-8 h-8" />
          </button>
        </div>
        <button>
          <LikeIcon className="w-8 h-8" />
        </button>
        <button>
          <CommentIcon className="w-8 h-8" />
        </button>
        <button>
          <BookmarkIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}

export default PersonTextCard;
