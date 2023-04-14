//React imports
import { useEffect, useState } from 'react';

//Redux imports
import { useAppSelector, useAppDispatch } from './store/hooks';
import { profileDataActions } from './store/profileDataSlice';
import { exerciseDataActions } from './store/exerciseDataSlice';


//Util function imports
import getProfileData, { getProfileDataAsync, getFavoriteExerciseAsync } from './utils/getProfileData';

//type import
import { ProfileData, emptyProfileData } from './types/stateTypes';


// tailwind imports
import "./theme/tailwind.css";


import { Redirect, Route } from "react-router-dom";

//Ionic Imports
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  accessibility,
  home,
  person,
} from "ionicons/icons";

//Pages Components imports
import Home from "./pages/Home/Home";
import Exercise from "./pages/exercise/Exercise";
import ChooseExercise from './pages/exercise/ChooseExercise';
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import CreatePost from './pages/post/CreatePost';

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

setupIonicReact();

const backend = " http://localhost:8000";
const exercises = ["zero", "Squats", "Push-ups", "Hamstring Stretch"];

const App: React.FC = () => {

  const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData)
  const [updateProfileState, setUpdateProfileState] = useState(0);

  const profileDataRedux = useAppSelector((state) => state.profile.profileData);
  const exerciseDataRedux = useAppSelector((state) => state.exerciseData);
  const dispatch = useAppDispatch();
  console.log(profileDataRedux);
  console.log(exerciseDataRedux);

  useEffect(() => {
    console.log('getprofiledata running from App.tsx')
    async function obtainProfileData() {
      let data = await getProfileDataAsync();
      let favoriteExercise = await getFavoriteExerciseAsync(data.id)
      if (data) {
        dispatch(profileDataActions.setProfileData(data));
      }
      if (favoriteExercise) {
        dispatch(exerciseDataActions.setExerciseData(favoriteExercise));
      }
    }


    obtainProfileData();
  }, [getProfileData, setProfileData, updateProfileState])

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/post/create">
              <CreatePost />
            </Route>
            <Route exact path="/exercise">
              <ChooseExercise />
            </Route>
            <Route exact path="/exercise/:exerciseId" render={(props) => {
              return <Exercise {...props} />;
            }} />
            <Route exact path="/profile">
              <Profile updateProfileState={updateProfileState} setUpdateProfileState={setUpdateProfileState} />
            </Route>
            <Route exact path='/profile/create/'>
              <EditProfile setUpdateProfileState={setUpdateProfileState} updateProfileState={updateProfileState} />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon aria-hidden="true" icon={home} />
            </IonTabButton>
            <IonTabButton tab="exercise" href="/exercise">
              {/* <div className="relative bg-sky-400 aspect-square rounded-full"> */}
              <IonIcon
                className="absolute"
                aria-hidden="true"
                icon={accessibility}
              />
              {/* </div> */}
            </IonTabButton>
            <IonTabButton tab="profile" href="/profile">
              {/* <IonIcon className="fill-red-600 stroke-red-600" aria-hidden="true" src={personUnfilled} /> */}
              {/* <IonIcon aria-hidden="true" icon={backend.concat(profileData.profile_photo)} /> */}
              <img className={`rounded-full border border-neutral-800 h-9`} src={backend.concat(profileDataRedux.profile_photo)} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp >
  );
};

export default App;

export { backend, exercises };
