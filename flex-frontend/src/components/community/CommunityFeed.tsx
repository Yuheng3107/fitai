
import React, { useState, useEffect } from "react";

import Posts from "../Feed/Posts";

import { CommunityData } from "../../types/stateTypes";

import { backend } from "../../App";
import { Link } from "react-router-dom";
import AddIcon from "../../assets/svgComponents/AddIcon";


type CommunityFeedProps = {
    postArray: any[];
    profileArray: any[];
    communityData: CommunityData
    loadData: () => void;
}
function CommunityFeed({ postArray, profileArray, communityData, loadData }: CommunityFeedProps) {
    useEffect(() => {
        loadData();
    },[])
    return <main className="w-full relative">
        <Posts posts={{
            postArray: postArray,
            profileArray: profileArray,
            communityArray: [communityData],
        }} loadData={loadData} />
        <Link to={`/home/community/${communityData.id}/create`} className="w-14 h-14 bg-sky-500 rounded-full fixed right-4 bottom-4 flex justify-center items-center" >
            <AddIcon className="fill-slate-50"/>
        </Link>
    </main>
}


export default CommunityFeed;