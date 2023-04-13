import React, { useState, useEffect, useRef } from "react";

//utils imports
import checkLoginStatus from "../../utils/checkLogin";
import { getProfileDataAsync } from "../../utils/getProfileData";

import { googleLogout } from "@react-oauth/google";
import { TrendData, emptyTrendData, ProfileData, emptyProfileData } from "../../types/stateTypes";
//ionic imports
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonNavLink,
  IonButton,
} from "@ionic/react";

//component imports
import Login from "../../components/login/Login";
import UserProfile from "../../components/profile/UserProfile";

import { backend } from "../../App";
import { profile } from "console";

type ProfileProps = {
  updateProfileState: number;
  setUpdateProfileState: (arg: number) => void;
}
//used to prevent spam logging in on a loop
let profileDataObtained = false;

const Tab3 = ({ updateProfileState, setUpdateProfileState }: ProfileProps) => {
  const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData);
  const [trendData, setTrendData] = useState<TrendData>(emptyTrendData);
  const [userFeedData, setUserFeedData] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    console.log(`the current loginStatus is ${loginStatus}`);
    console.log(`the current profileData is ${profileData}`);
    checkLoginStatus(loginStatus, setLoginStatus);

    async function obtainProfileData() {
      let data = await getProfileDataAsync();
      console.log(data);
      console.log(profileData);
      
      setProfileData(data);
      setTrendData({
        calories_burnt: data?.calories_burnt,
        exercise_regimes: data?.exercise_regimes,
        exercises: data?.exercises,
      });
    }

    
    if (loginStatus && profileDataObtained === false) {
      obtainProfileData();
      profileDataObtained = true;
    }
  }, [
    loginStatus,
    setLoginStatus,
    checkLoginStatus,
    getProfileDataAsync,
    setProfileData,
    profileData,
    updateProfileState,
  ]);

  const logOut = () => {
    googleLogout();
    setLoginStatus(false);
    setProfileData(emptyProfileData);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        {loginStatus === false ? (
          <Login setLoginStatus={setLoginStatus} setUpdateProfileState={setUpdateProfileState} updateProfileState={updateProfileState} />
        ) : (
          <UserProfile profileData={profileData} trendData={trendData} userFeedData={userFeedData}/>
        )}
        <IonButton routerLink="/profile/create" routerDirection="forward">
          Edit Profile
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
