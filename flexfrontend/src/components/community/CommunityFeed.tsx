
import React, { useState, useEffect } from "react";

//Redux imports
import { useAppSelector, useAppDispatch } from '../../store/hooks';

import Posts from "../Feed/Posts";
import { getCommunityPostsAsync } from "../../utils/getData/getPostData";
import { getManyOtherProfileDataAsync } from "../../utils/getData/getProfileData";

import { CommunityData } from "../../types/stateTypes";

import { backend } from "../../App";
import { Link } from "react-router-dom";
import AddIcon from "../../assets/svgComponents/AddIcon";

let currentFeedSet = 0;

type CommunityFeedProps = {
    communityData: CommunityData;
}
function CommunityFeed({ communityData }: CommunityFeedProps) {
    const profileDataRedux = useAppSelector((state) => state.profile.profileData);
    const [feedPost, setFeedPost] = useState<{postArray: any[], profileArray: any[], communityArray: any[]}>({
        postArray: [],
        profileArray: [],
        communityArray: [],
    });

    const loadFeedData = async () => {
        const postArray = await getCommunityPostsAsync(communityData.id, currentFeedSet);
        console.log(currentFeedSet)
        console.log(communityData.id)
        console.log(postArray);
        let profiles:any[] = [];
        for (let i=0;i<postArray.length;i++) profiles.push(postArray[i].poster);
        let profileArray = await getManyOtherProfileDataAsync(profiles);
        const profileMap = profileArray.reduce((acc:any, profile:any) => {
            return {
              ...acc,
              [profile.id]: profile,
            };
          }, {});
        for (let i=0;i<postArray.length;i++) profileArray[i] = profileMap[postArray[i].poster];
        setFeedPost({
            postArray: feedPost.postArray.concat(postArray),
            profileArray: feedPost.profileArray.concat(profileArray),
            communityArray: [communityData],
        });
        currentFeedSet += 1;
    }

    function createPostHandler(event: React.MouseEvent<HTMLButtonElement>) {
        fetch(`${backend}/feed/user_post/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": String(
                    document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
                ),
            },
            credentials: "include",
            body: JSON.stringify({
                text: "what's up baby"
            }),
        }).then((response) => {
            // do something with response
            console.log(response);
        });
    }
    return <main className="w-full relative">
        <Posts posts={feedPost} loadData={loadFeedData} />
        <Link to="/home/post/create" className="w-14 h-14 bg-sky-500 rounded-full fixed right-4 bottom-4 flex justify-center items-center" >
            <AddIcon className="fill-slate-50"/>
        </Link>
    </main>
}

export default CommunityFeed;