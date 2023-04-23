
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
import { getCommunityPostsAsync } from "../../utils/getData/getPostData";
import { getManyOtherProfileDataAsync } from "../../utils/getData/getProfileData";

import { backend } from '../../App';
import { CommunityData, emptyCommunityData, invalidCommunityData } from '../../types/stateTypes';

import CommunityFeed from '../../components/community/CommunityFeed';
import CommunityInfo from '../../components/community/CommunityInfo';

interface CommunityDisplayProps extends RouteComponentProps<{
    communityId: string;
}> { }

function CommunityDisplay({ match }: CommunityDisplayProps) {
    const [communityData, setCommunityData] = useState<CommunityData>(emptyCommunityData);
    const [feedPosts, setFeedPosts] = useState<{postArray: any[], profileArray: any[], communityArray: any[]}>({
        postArray: [],
        profileArray: [],
        communityArray: [],
    });
    const [currentFeedSet, setCurrentFeedSet] = useState(0);

    useEffect(() => {
        async function getCommunityData(pk: number) {
            let communityDetails = await getCommunityAsync(pk);
            if (communityDetails === undefined) communityDetails = invalidCommunityData;
            console.log(communityDetails);
            setCommunityData(communityDetails);
        }
        getCommunityData(Number(match.params.communityId));
        loadFeedData();
    }, [match])

    const loadFeedData = async () => {
        const postArray = await getCommunityPostsAsync(match.params.communityId, currentFeedSet);
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
        setFeedPosts({
            postArray: feedPosts.postArray.concat(postArray),
            profileArray: feedPosts.profileArray.concat(profileArray),
            communityArray: [communityData],
        });
        setCurrentFeedSet(currentFeedSet+1);
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
                    <CommunityFeed feedPosts={feedPosts} loadData={loadFeedData} />
                </main>
            }
            
        </IonContent>
    </IonPage>
}
export default CommunityDisplay;