import React, { useState, useEffect, useRef } from "react";

//utils imports
import checkLoginStatus from "../../utils/checkLogin";
import getProfileData from "../../utils/getProfileData";

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
  IonButton
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

const Tab3: React.FC = () => {  
  const [profileData, setProfileData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [userFeedData, setUserFeedData] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [isTrend, setTrend] = useState(true);

  useEffect(() => {
    console.log(`the current loginStatus is ${loginStatus}`);
    console.log(`the current profileData is ${profileData}`);
    checkLoginStatus(loginStatus, setLoginStatus);

    if (loginStatus && profileData === null) {
      getProfileData(setProfileData);
    }
    
  }, [
    loginStatus,
    setLoginStatus,
    checkLoginStatus,
    getProfileData,
    setProfileData,
    profileData,
  ]);

  const logOut = () => {
    googleLogout();
    setLoginStatus(false);
    setProfileData(null);
  };

  return (
    <IonPage>
      <IonHeader>

      </IonHeader>
      <IonContent fullscreen>
        {loginStatus === false ? <Login setLoginStatus={setLoginStatus} /> :
          <div>
            <ProfileInfo profileData={profileData} isTrend={isTrend}/>
            <ToggleBar isTrend={isTrend} setTrend={setTrend} />
            {isTrend === true ? <Trend trendData={trendData}/> : <UserFeed userFeedData={userFeedData}/>}
          </div>
        }
        <IonButton routerLink="/profile/create" routerDirection="forward">Edit Profile</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
