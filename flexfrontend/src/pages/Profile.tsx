import React, { useState, useEffect, useRef } from "react";

import checkLoginStatus from "../utils/checkLogin";
import getProfileData from "../utils/getProfileData";
import UpdateProfile from "../components/login/UpdateProfile";

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
import Login from "../components/login/Login";
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



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonTitle size="large">Tab 3</IonTitle>
        <div>
          Login Here
          <Login setLoginStatus={setLoginStatus} />
        </div>
        <UpdateProfile />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
