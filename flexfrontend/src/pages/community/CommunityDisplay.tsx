
import { useState, useEffect, useReducer } from 'react';

//Ionic Imports
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonTitle,
    IonButtons,
    IonButton,
} from '@ionic/react';
import { RouteComponentProps } from "react-router";

//img imports
import img404 from "../../assets/img/404.png"

//utils imports
import { getCommunityAsync } from '../../utils/communities';
import { backend } from '../../App';
import ShareIcon from '../../assets/svgComponents/ShareIcon';
import { CommunityData, emptyCommunityData, invalidCommunityData } from '../../types/stateTypes';

import CommunityFeed from '../../components/community/CommunityFeed';

interface CommunityDisplayProps extends RouteComponentProps<{
    communityId: string;
}> { }

function CommunityDisplay({ match }: CommunityDisplayProps) {
    const [communityData, setCommunityData] = useState<CommunityData>(emptyCommunityData);

    useEffect(() => {
        async function getCommunityData(pk: number) {
            let communityDetails = await getCommunityAsync(pk);
            if (communityDetails === undefined) communityDetails = invalidCommunityData;
            console.log(communityDetails);
            setCommunityData(communityDetails);
        }
        getCommunityData(Number(match.params.communityId));
    }, [match])

    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton></IonBackButton>
                </IonButtons>
                <IonTitle>{communityData.name}</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            { communityData.id === -1 ?
                <div className="flex flex-col justify-evenly items-center">
                    <img src={img404} />
                </div> 
            :
                <main className="h-full">
                    <MainInfo communityData={communityData} />
                </main>
            }
            
        </IonContent>
    </IonPage>
}

type MainInfoProps = {
    communityData: CommunityData;
}
function MainInfo({ communityData }: MainInfoProps) {
    const [bannerUrl, setBannerUrl] = useState("");
    const [communityPhotoUrl, setCommunityPhotoUrl] = useState("");

    useEffect(() => {
        if (communityData?.banner !== null) setBannerUrl(backend.concat(communityData.banner))
        if (communityData?.community_photo !== null) setCommunityPhotoUrl(backend.concat(communityData.community_photo))
    });

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
                    <span className="">69 Members</span>
                    <div className="flex flex-row">
                        <button className=" mr-1 px-4 rounded-full bg-orange-400 text-white h-8">
                            join
                        </button>
                        <button className=" aspect-square bg-gray-300 rounded-full h-8 flex justify-center items-center">
                            <ShareIcon className={`h-6 w-6`}/>
                        </button>
                    </div>
                </div> 
            </div>
            
            
        </div>
        <p id="description" className="px-6 mt-3">{communityData.description}</p>
        <CommunityFeed communityData={communityData}/>
    </div>
}

export default CommunityDisplay;