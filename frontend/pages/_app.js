import '../styles/globals.css'

//ionic stuff
import "@ionic/react/css/core.css";
import { setupIonicReact } from '@ionic/react';
setupIonicReact();

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
  console.log(oAuthClientId);
  return <GoogleOAuthProvider clientId={oAuthClientId}>
    <Component {...pageProps} />
  </GoogleOAuthProvider>
}

MyApp.getInitialProps = (ctx) => {
  const oAuthClientId = process.env.GOOGLE_OAUTH_ID;
  // const appInitialProps = App.getInitialProps(appContext);
  return { oAuthClientId };
}

export default MyApp
