import React, { useState, useEffect, useRef } from "react";

//utils imports
import checkLoginStatus from "../../utils/checkLogin";
import { getProfileDataAsync } from "../../utils/getProfileData";

import { googleLogout } from "@react-oauth/google";

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
import UpdateProfile from "../../components/login/UpdateProfile";
import Login from "../../components/login/Login";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ToggleBar from "../../components/profile/ToggleBar";
import Trend from "../../components/profile/Trend";
import UserFeed from "../../components/profile/UserFeed";

import { backend } from "../../App";
import { profile } from "console";

type ProfileProps = {
  updateProfileState: number
}

const Tab3 = ({ updateProfileState }: ProfileProps) => {
  const [profileData, setProfileData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [userFeedData, setUserFeedData] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [isTrend, setTrend] = useState(true);

  useEffect(() => {
    console.log(`the current loginStatus is ${loginStatus}`);
    console.log(`the current profileData is ${profileData}`);
    checkLoginStatus(loginStatus, setLoginStatus);
    async function obtainProfileData() {
      let data = await getProfileDataAsync();
      console.log(data);
      console.log(profileData);
      if (profileData === null) {
        setProfileData(data);
      }
      if (profileData !== null) { //this is a type guard to tell typescript that profileData definitely won't be null
        // if any the following are different, we'll update the profileData state.
        // We're doing this because we can't update profileData state all the time, it causes infintie loop
        if (profileData['username'] !== data.username ||
          profileData['email'] !== data.email ||
          profileData['profile_photo'] !== data['profile_photo']) {
          setProfileData(data)
        }
      }
      // setProfileData(data);

    }

    if (loginStatus) {
      obtainProfileData();
    }

  }, [
    loginStatus,
    setLoginStatus,
    checkLoginStatus,
    getProfileDataAsync,
    setProfileData,
    profileData,
    updateProfileState
  ]);

  const logOut = () => {
    googleLogout();
    setLoginStatus(false);
    setProfileData(null);
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent fullscreen>
        {loginStatus === false ? (
          <Login setLoginStatus={setLoginStatus} />
        ) : (
          <div>
            <ProfileInfo profileData={profileData} isTrend={isTrend} />
            <ToggleBar isTrend={isTrend} setTrend={setTrend} />
            {isTrend === true ? (
              <Trend trendData={trendData} />
            ) : (
              <UserFeed userFeedData={userFeedData} />
            )}
          </div>
        )}
        <IonButton routerLink="/profile/create" routerDirection="forward">
          Edit Profile
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
