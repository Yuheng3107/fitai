import React, { useState, useEffect, useRef } from "react";

//utils imports
import checkLoginStatus from "../utils/checkLogin";
import getProfileData from "../utils/getProfileData";

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
} from "@ionic/react";

//component imports
import UpdateProfile from "../components/login/UpdateProfile";
import Login from "../components/login/Login";
import ProfileInfo from "../components/profile/ProfileInfo";

import { backend } from "../App";

const Tab3: React.FC = () => {

  const [loginStatus, setLoginStatus] = useState(false);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    console.log(`the current loginStatus is ${loginStatus}`);
    console.log(`the current profileData is ${profileData}`);
    checkLoginStatus(loginStatus, setLoginStatus);



    if (loginStatus && !Object.keys(profileData).length) {
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
    setProfileData({});
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {loginStatus === true && <button onClick={logOut}>logout</button>}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loginStatus === false ? <Login setLoginStatus={setLoginStatus} /> :
          <ProfileInfo profileData={profileData} />}
        <UpdateProfile />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
