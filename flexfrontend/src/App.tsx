/* Tailwind styles */
import './theme/tailwind.css';

import personUnfilled from './assets/svg/person_unfilled.svg';

import { Redirect, Route, useParams } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonImg,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { accessibility, ellipse, home, person, personOutline, square, triangle } from 'ionicons/icons';
import Home from './pages/Home';
import Exercise from './pages/Exercise';
import Profile from './pages/Profile';



/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';


setupIonicReact();

const backend = " http://127.0.0.1:8000";


const App: React.FC = () => {
  return <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/exercise">
            <Exercise />
          </Route>
          <Route path="/profile">
            <Profile />
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
              <IonIcon className="absolute" aria-hidden="true" icon={accessibility} />
            {/* </div> */}
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">

            {/* <IonIcon className="fill-red-600 stroke-red-600" aria-hidden="true" src={personUnfilled} /> */}
            <IonIcon aria-hidden="true" icon={person} />

          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
};

export default App;



export { backend };
