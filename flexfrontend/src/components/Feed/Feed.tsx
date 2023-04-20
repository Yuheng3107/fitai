
import React, { useState, useEffect } from "react";

//Redux imports
import { useAppSelector, useAppDispatch } from '../../store/hooks';

import FeedPosts from "./FeedPosts";
import { getUserFeedAsync } from "../../utils/getPostData";
import { getOtherProfileDataAsync } from "../../utils/getProfileData";

import { backend } from "../../App";
import { Link } from "react-router-dom";
import { ProfileData } from "../../types/stateTypes";
import AddIcon from "../../assets/svgComponents/AddIcon";

let currentFeedSet = 0;

function Feed() {
    const profileDataRedux = useAppSelector((state) => state.profile.profileData);
    const [feedPostArray, setFeedPostArray] = useState(new Array());

    const loadFeedData = async () => {
        let data = await getUserFeedAsync(currentFeedSet);
        let dataWithProfile:any[] = [];
        for (let i=0;i<data.length;i++) {
            let profileData:ProfileData = await getOtherProfileDataAsync(data[i].poster)
            dataWithProfile.push({
                postData: data[i],
                profileData: profileData,
            })
        }
        console.log(dataWithProfile);
        setFeedPostArray(feedPostArray.concat(dataWithProfile));
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
        <FeedPosts feedPostArray={feedPostArray} loadFeedData={loadFeedData} />
        <Link to="/home/post/create" className="w-14 h-14 bg-sky-500 rounded-full fixed right-4 bottom-4 flex justify-center items-center" >
            <AddIcon className="fill-slate-50"/>
        </Link>
    </main>
}

export default Feed;