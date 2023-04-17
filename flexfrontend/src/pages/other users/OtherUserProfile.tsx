import { RouteComponentProps } from "react-router";
import React, { useState, useEffect } from "react";

//utils imports
import { getAllProfileData } from "../../utils/getProfileData";
import { getUserPostsAsync } from "../../utils/getPostData";
import { ExerciseStats, emptyExerciseStats, ProfileData, emptyProfileData } from "../../types/stateTypes";

//img imports
import img404 from "../../assets/img/404.png"

//ionic imports
import {
  IonContent,
  IonPage,
  IonButton,
} from "@ionic/react";

//component imports
import Login from "../../components/login/Login";
import UserProfileTemplate from "../../components/profile/UserProfileTemplate";

type ProfileProps = {
  updateProfileState: number;
  setUpdateProfileState: (arg: number) => void;
}
// for keeping track of how many sets of user posts
let currentUserPostSet = 0;
let hasLoaded = false;

interface OtherUserProfileProps
    extends RouteComponentProps<{
        userId: string;
    }> { }

const OtherUserProfile: React.FC<OtherUserProfileProps> = ({ match }) => {
    const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData);
    const [exerciseStats, setExerciseStats] = useState<ExerciseStats>(emptyExerciseStats);
    const [userPostArray, setUserPostArray] = useState(new Array());
    const [loginStatus, setLoginStatus] = useState(false);

    useEffect(() => {
        if (hasLoaded === false) {
            loadAllProfileData();
            hasLoaded = true;
        }
    });

    const loadAllProfileData = async () => {
        let data = await getAllProfileData(match.params.userId);
        setProfileData(data.profileData);
        setExerciseStats(data.exerciseStats);
        console.log(match.params.userId);
        console.log(data.profileData);
    };

    const loadUserPostData = async () => {
        let data = await getUserPostsAsync(match.params.userId, currentUserPostSet);
        setUserPostArray(userPostArray.concat(data));
        currentUserPostSet += 1;
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                {profileData.id === -1 ? 
                    <div className="flex flex-col justify-evenly items-center">
                        <img src={img404} />
                    </div> 
                :
                    <UserProfileTemplate profileData={profileData} exerciseStats={exerciseStats} userPostArray={userPostArray} loadUserPostData={loadUserPostData}/>
                }
            </IonContent>
        </IonPage>
    );
}


export default OtherUserProfile;