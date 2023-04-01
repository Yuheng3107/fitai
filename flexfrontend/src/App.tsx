//React imports
import { useEffect, useState } from 'react';


//Util function imports
import getProfileData from './utils/getProfileData';

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
import Home from "./pages/Home";
import Exercise from "./pages/exercise/Exercise";
import ChooseExercise from './pages/exercise/ChooseExercise';
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";

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

const App: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData)
  useEffect(() => {
    getProfileData(setProfileData);
  }, [getProfileData, setProfileData])

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/exercise">
              <ChooseExercise />
            </Route>
            <Route exact path="/exercise/placeholder">
              <Exercise />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path='/profile/create/'>
              <EditProfile />
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
              <img className={`rounded-full border border-neutral-800 h-9`} src={backend.concat(profileData.profile_photo)} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

export { backend };
