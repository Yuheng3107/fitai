import filledCircle from "../../assets/svg/circle_FILL1_wght400_GRAD0_opsz48.svg";
import FilledCircle from "../../assets/svgComponents/FilledCircle";
import CommentIcon from "../../assets/svgComponents/CommentIcon";
import LikeIcon from "../../assets/svgComponents/LikeIcon";
import BookmarkIcon from "../../assets/svgComponents/BookmarkIcon";
import SendIcon from "../../assets/svgComponents/SendIcon";

import React, { useState, useEffect } from "react";

import { backend } from "../../App";
import { UserPostData, ProfileData, CommunityData, emptyCommunityData } from "../../types/stateTypes";
import { timeSince } from "../../utils/generalUtils";
import { getCommunityAsync } from "../../utils/getData/getCommunityData";

type UserPostProps = {
  userPostData: UserPostData;
  profileData: ProfileData;
};

const PersonTextCard = ({ userPostData, profileData }: UserPostProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [communityData, setCommunityData] = useState<CommunityData>(emptyCommunityData);
  const postDate = new Date(userPostData.posted_at);

  useEffect(() => {
    if (profileData?.profile_photo) {
      setImageUrl(backend.concat(profileData.profile_photo))
    }
    if (userPostData?.community !== undefined) {
      getCommunityData(userPostData.community);
    }
  }, [profileData?.profile_photo])

  async function getCommunityData(pk:number) {
    setCommunityData(await getCommunityAsync(pk));
  }

  return (
    <div id="card-container" className="border border-zinc-500 mt-4 p-2">
      <div id="top-bar" className=" flex flex-row justify-between mb-2">
        <div className="flex flex-row">
          <a href={`/profile/${profileData.id}`}>
            <img
              alt="profile-picture"
              src={imageUrl}
              className="h-12 w-12 rounded-full object-cover"
            />
          </a>
          <div className="ml-3">
            <a id="username" className="font-semibold text-black" href={`/profile/${profileData.id}`}>
              {profileData?.username}
            </a>
            <p
              id="subtitle"
              className="flex flex-row items-center text-sm text-gray-700"
            >
              <span id="post-place">{userPostData?.community === undefined ? "Feed" : communityData?.name}</span>
              <FilledCircle className="mx-1 h-1.5 w-1.5 aspect-square fill-slate-500" />
              <span id="time-stamp">{timeSince(postDate)}</span>
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
