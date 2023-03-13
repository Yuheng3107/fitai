import '../styles/globals.css'

import { useEffect } from 'react';

//ionic stuff
import "@ionic/react/css/core.css";
import { setupIonicReact } from '@ionic/react';
import { IonApp } from '@ionic/react';

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



//Google auth
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

function MyApp({ Component, pageProps, oAuthClientId }) {
  useEffect(() => {
    console.log('setupIonicReact running')
    setupIonicReact();
  }, [])
  console.log(oAuthClientId);
  return <GoogleOAuthProvider clientId={oAuthClientId}>
    <IonApp>
      <Component {...pageProps} />
    </IonApp>
  </GoogleOAuthProvider >
}

MyApp.getInitialProps = (ctx) => {
  const oAuthClientId = process.env.GOOGLE_OAUTH_ID;
  // const appInitialProps = App.getInitialProps(appContext);
  return { oAuthClientId };
}

export default MyApp
