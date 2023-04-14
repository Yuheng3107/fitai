import React, { useState, useEffect } from "react";

//redux imports
import { useAppSelector } from "../../store/hooks";

//utils imports
import checkLoginStatus from "../../utils/checkLogin";
import { getProfileDataAsync, getFavoriteExerciseAsync } from "../../utils/getProfileData";

import { googleLogout } from "@react-oauth/google";
import { ExerciseStats, emptyExerciseStats, ProfileData, emptyProfileData } from "../../types/stateTypes";
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

const Tab3 = ({ updateProfileState, setUpdateProfileState }: ProfileProps) => {
  const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats>(emptyExerciseStats);
  const [userFeedData, setUserFeedData] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);

  const profileDataRedux = useAppSelector((state) => state.profile.profileData)

  useEffect(() => {
    console.log(`the current loginStatus is ${loginStatus}`);
    console.log(`the current profileData is ${profileData}`);
    checkLoginStatus(loginStatus, setLoginStatus);

    async function obtainProfileData() {
      let data = await getProfileDataAsync();
      data.favorite_exercise = await getFavoriteExerciseAsync(data.id);
      if (profileData['username'] !== data.username ||
        profileData['email'] !== data.email ||
        profileData['profile_photo'] !== data['profile_photo'] ||
        profileData['bio'] !== data.bio) {
        setProfileData(data)
      }
      setExerciseStats(data);
    }


    if (loginStatus) {
      obtainProfileData();
    }
  }, [loginStatus, setLoginStatus, checkLoginStatus, getProfileDataAsync, setProfileData, profileData, updateProfileState]);

  const logOut = () => {
    googleLogout();
    setLoginStatus(false);
    setProfileData(emptyProfileData);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        {loginStatus ?
          <UserProfileTemplate profileData={profileDataRedux} exerciseStats={exerciseStats} userFeedData={userFeedData} />
          :
          <Login setLoginStatus={setLoginStatus} setUpdateProfileState={setUpdateProfileState} updateProfileState={updateProfileState} />
        }
        <IonButton routerLink="/profile/create" routerDirection="forward">
          Edit Profile
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
