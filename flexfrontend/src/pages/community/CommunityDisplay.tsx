
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
import { getCommunityAsync } from '../../utils/data/communities';
import { getCommunityPostsAsync } from "../../utils/data/posts";
import { getManyOtherProfileDataAsync } from "../../utils/data/profile";

import { backend } from '../../App';
import { CommunityData, emptyCommunityData, invalidCommunityData } from '../../types/stateTypes';

import CommunityFeed from '../../components/community/CommunityFeed';
import CommunityInfo from '../../components/community/CommunityInfo';

interface CommunityDisplayProps extends RouteComponentProps<{
    communityId: string;
}> { }
let currentFeedSet = 0;
function CommunityDisplay({ match }: CommunityDisplayProps) {
    const [communityData, setCommunityData] = useState<CommunityData>(emptyCommunityData);
    const [postArray, setPostArray] = useState<any[]>([]);
    const [profileArray, setProfileArray] = useState<any[]>([]);

    useEffect(() => {
        async function getCommunityData(pk: number) {
            let communityDetails = await getCommunityAsync(pk);
            if (communityDetails === undefined) communityDetails = invalidCommunityData;
            setCommunityData(communityDetails);
        }
        getCommunityData(parseInt(match.params.communityId));
    }, [match])

    const loadFeedData = async () => {
        const postArray = await getCommunityPostsAsync(Number(match.params.communityId), currentFeedSet);
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
        setPostArray(postArray);
        setProfileArray(profileArray);
        currentFeedSet += 1;
    }

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
                    <CommunityInfo communityData={communityData} />
                    <CommunityFeed postArray={postArray} profileArray={profileArray} communityData={communityData} loadData={loadFeedData} />
                </main>
            }
            
        </IonContent>
    </IonPage>
}
export default CommunityDisplay;