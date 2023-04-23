
import React, { useState, useEffect } from "react";

import Posts from "../Feed/Posts";

import { CommunityData } from "../../types/stateTypes";

import { backend } from "../../App";
import { Link } from "react-router-dom";
import AddIcon from "../../assets/svgComponents/AddIcon";



type CommunityFeedProps = {
    feedPosts: {
        postArray: any[], profileArray: any[], communityArray: any[],
    };
    loadData: () => void;
}
function CommunityFeed({ feedPosts, loadData }: CommunityFeedProps) {
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
        <Posts posts={feedPosts} loadData={loadData} />
        <Link to="/home/post/create" className="w-14 h-14 bg-sky-500 rounded-full fixed right-4 bottom-4 flex justify-center items-center" >
            <AddIcon className="fill-slate-50"/>
        </Link>
    </main>
}


export default CommunityFeed;