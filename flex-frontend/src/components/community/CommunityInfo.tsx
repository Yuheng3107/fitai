
import React, { useState, useEffect } from "react";

// utils imports
import { joinCommunityAsync, leaveCommunityAsync } from "../../utils/data/communities";

//Redux imports
import { useAppSelector } from '../../store/hooks';

import { CommunityData } from "../../types/stateTypes";
import { backend } from "../../App";
import ShareIcon from '../../assets/svgComponents/ShareIcon';

type CommunityInfoProps = {
    communityData: CommunityData;
}
function CommunityInfo({ communityData }: CommunityInfoProps) {
    const [bannerUrl, setBannerUrl] = useState("");
    const [communityPhotoUrl, setCommunityPhotoUrl] = useState("");
    const [isMember, setIsMember] = useState(false);

    const profileDataRedux = useAppSelector((state) => state.profile.profileData)

    useEffect(() => {
        if (communityData?.banner !== null) setBannerUrl(backend.concat(communityData.banner))
        if (communityData?.community_photo !== null) setCommunityPhotoUrl(backend.concat(communityData.community_photo))
        if (profileDataRedux.communities.includes(communityData.id)) setIsMember(true);
    });

    const joinCommunity = async () => {
        let response = await joinCommunityAsync(communityData.id);
        if (response?.status === 200) setIsMember(true);
    }
    const leaveCommunity = async () => {
        let response = await leaveCommunityAsync(communityData.id);
        if (response?.status === 200) setIsMember(false);
    }

    return <div className="flex flex-col">
        <div className="w-full h-36 object-cover">
            <img src={bannerUrl} className="w-full h-36 object-cover" alt="" />
            
        </div>
        
        <div id="name-and-actions" className="mt-3 px-8 flex flex-row justify-between">
            {communityData.community_photo === null ? "No photo Here" :
                <img alt="community-picture" src={communityPhotoUrl} className="h-20 w-20 rounded-full object-cover border border-zinc-500"/>}
            <div className="flex flex-col justify-evenly">
               <span className="text-2xl font-semibold text-left">{communityData.name}</span>
                <div className="flex flex-row justify-between">
                    <span className="">{communityData.member_count} Members</span>
                    <div className="flex flex-row">
                        { isMember === true ?
                            <button onClick={leaveCommunity} className=" mr-1 px-4 rounded-full bg-orange-400 text-white h-8">
                                Leave </button>
                        :
                            <button onClick={joinCommunity} className=" mr-1 px-4 rounded-full bg-orange-400 text-white h-8">
                                Join </button>
                        }
                        <button className=" aspect-square bg-gray-300 rounded-full h-8 flex justify-center items-center">
                            <ShareIcon className={`h-6 w-6`}/>
                        </button>
                    </div>
                </div> 
            </div>
            
            
        </div>
        <p id="description" className="px-6 mt-3">{communityData.description}</p>
    </div>
}

export default CommunityInfo;