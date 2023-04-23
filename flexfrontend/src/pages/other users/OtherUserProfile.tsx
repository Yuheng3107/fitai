import { RouteComponentProps } from "react-router";
import React, { useState, useEffect } from "react";

//utils imports
import { getAllProfileData } from "../../utils/data/profile";
import { getUserPostsAsync } from "../../utils/data/posts";
import { ExerciseStats, emptyExerciseStats, ProfileData, emptyProfileData } from "../../types/stateTypes";
import { sendFriendRequest, deleteFriendRequest, deleteFriend } from "../../utils/data/friends";

//img imports
import img404 from "../../assets/img/404.png"

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

//component imports
import UserProfileTemplate from "../../components/profile/UserProfileTemplate";

//Redux imports
import { useAppSelector } from '../../store/hooks';

// for keeping track of how many sets of user posts
let currentUserPostSet = 0;

interface OtherUserProfileProps
    extends RouteComponentProps<{
        userId: string;
    }> { }

const OtherUserProfile: React.FC<OtherUserProfileProps> = ({ match }) => {
    const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData);
    const [exerciseStats, setExerciseStats] = useState<ExerciseStats>(emptyExerciseStats);
    const [userPostArray, setUserPostArray] = useState(new Array());
    // 0 is no friend request sent, 1 is friend request sent, 2 is already friends
    const [friendStatus, setFriendStatus] = useState(0);

    const profileDataRedux = useAppSelector((state) => state.profile.profileData)

    useEffect(() => {
        //useEffect with empty dependency array means this function will only run once right after the component is mounted
        loadAllProfileData();
        if (profileDataRedux.followers.includes(parseInt(match.params.userId))) setFriendStatus(2);
        if (profileDataRedux.sent_friend_requests.includes(parseInt(match.params.userId))) setFriendStatus(1);
    },[friendStatus, setFriendStatus, profileDataRedux]);

    const loadAllProfileData = async () => {
        let data = await getAllProfileData(Number(match.params.userId));
        setProfileData(data.profileData);
        setExerciseStats(data.exerciseStats);
        console.log(data.profileData);
    };

    const loadUserPostData = async () => {
        let data = await getUserPostsAsync(Number(match.params.userId), currentUserPostSet);
        setUserPostArray(userPostArray.concat(data));
        currentUserPostSet += 1;
    };

    const friendRequest = async () => {
        let response = await sendFriendRequest(Number(match.params.userId));
        if (response?.status === 200) setFriendStatus(1);
    }

    const removeFriendRequest = async () => {
        let response = await deleteFriendRequest(Number(match.params.userId));
        if (response?.status === 200) setFriendStatus(0);
    }

    const removeFriend = async () => {
        let response = await deleteFriend(Number(match.params.userId));
        if (response?.status === 200) setFriendStatus(0);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>{profileData?.username}'s Profile</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {profileData.id === -1 ? 
                    <div className="flex flex-col justify-evenly items-center">
                        <img src={img404} />
                    </div> 
                :
                    <div>
                        <UserProfileTemplate profileData={profileData} exerciseStats={exerciseStats} userPostArray={userPostArray} loadUserPostData={loadUserPostData}/>
                        {friendStatus === 0 ?
                            <IonButton onClick={friendRequest}>Send Friend Request</IonButton>
                        : friendStatus === 1 ?
                            <IonButton onClick={removeFriendRequest}>Remove Friend Request</IonButton>
                        : 
                            <IonButton onClick={removeFriend}>Remove Friend</IonButton>
                        }
                    </div>
                }
            </IonContent>
        </IonPage>
    );
}


export default OtherUserProfile;