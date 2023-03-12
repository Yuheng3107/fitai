import '../styles/globals.css'

//ionic stuff
import "@ionic/react/css/core.css";
import { setupIonicReact } from '@ionic/react';
setupIonicReact();

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
