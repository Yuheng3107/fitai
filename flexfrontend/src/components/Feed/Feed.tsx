
import React, { useState, useEffect } from "react";

//Redux imports
import { useAppSelector, useAppDispatch } from '../../store/hooks';

import Posts from "./Posts";
import { getUserFeedAsync } from "../../utils/getData/getPostData";
import { getManyOtherProfileDataAsync } from "../../utils/getData/getProfileData";
import { getCommunityListAsync } from "../../utils/communities";

import { backend } from "../../App";
import { Link } from "react-router-dom";
import AddIcon from "../../assets/svgComponents/AddIcon";

function Feed() {
    const profileDataRedux = useAppSelector((state) => state.profile.profileData);
    const [feedPost, setFeedPost] = useState<{postArray: any[], profileArray: any[], communityArray: any[]}>({
        postArray: [],
        profileArray: [],
        communityArray: [],
    });
    const [currentFeedSet, setCurrentFeedSet] = useState(0);
    useEffect(() => {
        loadFeedData();
    },[]);
    const loadFeedData = async () => {
        const postArray = await getUserFeedAsync(currentFeedSet);
        console.log(`set:${currentFeedSet}`)
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

        let communities:any[] = [];
        for (let i=0;i<postArray.length;i++) if (postArray[i].community !== undefined) communities.push(postArray[i].community);
        let communityArray = await getCommunityListAsync(communities);
        const communityMap = communityArray.reduce((acc:any, community:any) => {
            return {
              ...acc,
              [community.id]: community,
            };
          }, {});
        for (let i=0;i<postArray.length;i++) communityArray[i] = communityMap[postArray[i].community];
        setFeedPost({
            postArray: feedPost.postArray.concat(postArray),
            profileArray: feedPost.profileArray.concat(profileArray),
            communityArray: feedPost.communityArray.concat(communityArray),
        });
        setCurrentFeedSet(currentFeedSet+1);
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

export default Feed;