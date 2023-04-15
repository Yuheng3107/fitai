import React, { useState, useEffect } from "react";

//redux imports
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { profileDataActions } from '../../store/profileDataSlice';

//utils imports
import checkLoginStatus from "../../utils/checkLogin";
import { getProfileDataAsync, getFavoriteExerciseAsync, getFavoriteExerciseRegimeAsync } from "../../utils/getProfileData";
import { getExerciseRegimeAsync } from "../../utils/getExerciseData";
import { getUserPostsAsync } from "../../utils/getPostData";

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
// for keeping track of how many sets of user posts
let currentUserPostSet = 0;

const Tab3 = ({ updateProfileState, setUpdateProfileState }: ProfileProps) => {
  const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats>(emptyExerciseStats);
  const [userPostArray, setUserPostArray] = useState(new Array());
  const [loginStatus, setLoginStatus] = useState(false);
  const dispatch = useAppDispatch();

  const profileDataRedux = useAppSelector((state) => state.profile.profileData)
  const exerciseStatsRedux = useAppSelector((state) => state.exerciseStats)
  

  useEffect(() => {
    console.log(`the current loginStatus is ${loginStatus}`);
    checkLoginStatus(loginStatus, setLoginStatus);
    /*
    async function obtainProfileData() {
      let data = await getProfileDataAsync();
      data.favorite_exercise = await getFavoriteExerciseAsync(data.id);
      data.favorite_exercise_regime = await getFavoriteExerciseRegimeAsync(data.id);
      data.favorite_exercise_regime.name = null;
      if (data.favorite_exercise_regime.exercise_regime !== null) data.favorite_exercise_regime = await getExerciseRegimeAsync(data.favorite_exercise_regime.exercise_regime);
      console.log(data)
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
    */
  }, [loginStatus, setLoginStatus, checkLoginStatus, getProfileDataAsync, setProfileData, profileData, updateProfileState, exerciseStatsRedux]);

  const logOut = () => {
    googleLogout();
    setLoginStatus(false);
    dispatch(profileDataActions.setProfileData(emptyProfileData))
  };

  const loadUserPostData = async () => {
    let data = await getUserPostsAsync(profileDataRedux.id, currentUserPostSet);
    setUserPostArray(userPostArray.concat(data));
    console.log(data);
    console.log(currentUserPostSet);
    currentUserPostSet += 1;
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        {loginStatus ?
          <UserProfileTemplate profileData={profileDataRedux} exerciseStats={exerciseStatsRedux} userPostArray={userPostArray} loadUserPostData={loadUserPostData}/>
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
